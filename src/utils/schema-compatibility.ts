/**
 * Schema Compatibility Utilities
 * 
 * This module provides utilities for handling database schema compatibility issues,
 * particularly for dealing with columns that may not exist in all environments.
 * 
 * These utilities help create more resilient code that can gracefully handle
 * schema differences between development, staging, and production environments.
 */

import { queryMainDb, queryPhiDb } from '../config/db';
import logger from './logger';
import enhancedLogger from './enhanced-logger';

/**
 * Interface for column information
 */
interface ColumnInfo {
  column_name: string;
  data_type: string;
  is_nullable: string;
}

/**
 * Cache for column existence checks to avoid repeated database queries
 */
const columnExistenceCache: Record<string, Record<string, boolean>> = {};

/**
 * Check if a column exists in a table
 * 
 * @param table The table name to check
 * @param column The column name to check
 * @param usePhiDb Whether to use the PHI database (default: false)
 * @returns Promise<boolean> True if the column exists, false otherwise
 */
export async function columnExists(
  table: string, 
  column: string, 
  usePhiDb = false
): Promise<boolean> {
  // Check cache first
  const cacheKey = `${table}.${column}`;
  const dbType = usePhiDb ? 'phi' : 'main';
  
  if (columnExistenceCache[dbType]?.[cacheKey] !== undefined) {
    return columnExistenceCache[dbType][cacheKey];
  }
  
  try {
    const queryDb = usePhiDb ? queryPhiDb : queryMainDb;
    const result = await queryDb(
      `SELECT column_name 
       FROM information_schema.columns 
       WHERE table_name = $1 AND column_name = $2`,
      [table, column]
    );
    
    const exists = result.rows.length > 0;
    
    // Cache the result
    if (!columnExistenceCache[dbType]) {
      columnExistenceCache[dbType] = {};
    }
    columnExistenceCache[dbType][cacheKey] = exists;
    
    enhancedLogger.debug(`Column existence check: ${table}.${column}`, { 
      exists, 
      dbType 
    });
    
    return exists;
  } catch (error) {
    logger.error(`Error checking if column ${column} exists in table ${table}:`, error);
    // Default to false if there's an error
    return false;
  }
}

/**
 * Get all columns for a table
 * 
 * @param table The table name to get columns for
 * @param usePhiDb Whether to use the PHI database (default: false)
 * @returns Promise<ColumnInfo[]> Array of column information
 */
export async function getTableColumns(
  table: string, 
  usePhiDb = false
): Promise<ColumnInfo[]> {
  try {
    const queryDb = usePhiDb ? queryPhiDb : queryMainDb;
    const result = await queryDb(
      `SELECT column_name, data_type, is_nullable
       FROM information_schema.columns 
       WHERE table_name = $1
       ORDER BY ordinal_position`,
      [table]
    );
    
    enhancedLogger.debug(`Retrieved columns for table ${table}`, { 
      columnCount: result.rows.length,
      dbType: usePhiDb ? 'phi' : 'main'
    });
    
    return result.rows;
  } catch (error) {
    logger.error(`Error getting columns for table ${table}:`, error);
    return [];
  }
}

/**
 * Build a SELECT query that is resilient to missing columns
 * 
 * @param table The table name to query
 * @param columns Array of columns to select
 * @param whereClause The WHERE clause for the query
 * @param orderByClause Optional ORDER BY clause
 * @param usePhiDb Whether to use the PHI database (default: false)
 * @returns Promise<string> The constructed SQL query
 */
export async function buildResilientSelectQuery(
  table: string,
  columns: string[],
  whereClause: string,
  orderByClause?: string,
  usePhiDb = false
): Promise<string> {
  // Get all available columns for the table
  const availableColumns = await getTableColumns(table, usePhiDb);
  const availableColumnNames = availableColumns.map(col => col.column_name);
  
  // Filter out columns that don't exist
  const validColumns = columns.filter(col => availableColumnNames.includes(col));
  
  if (validColumns.length === 0) {
    throw new Error(`No valid columns found for table ${table}`);
  }
  
  let query = `SELECT ${validColumns.join(', ')} FROM ${table} WHERE ${whereClause}`;
  
  if (orderByClause) {
    query += ` ORDER BY ${orderByClause}`;
  }
  
  enhancedLogger.debug(`Built resilient query for ${table}`, { 
    requestedColumns: columns.length,
    validColumns: validColumns.length,
    query
  });
  
  return query;
}

/**
 * Add default values to an object for potentially missing columns
 * 
 * @param data The data object to add defaults to
 * @param defaults Record of default values for missing columns
 * @returns The data object with default values added for missing properties
 */
export function addDefaultValues<T>(
  data: T, 
  defaults: Partial<T>
): T {
  const result = { ...data };
  
  for (const [key, value] of Object.entries(defaults)) {
    if (result[key as keyof T] === undefined) {
      result[key as keyof T] = value as T[keyof T];
    }
  }
  
  return result;
}

/**
 * Add default values to an array of objects
 * 
 * @param dataArray Array of data objects
 * @param defaults Record of default values for missing columns
 * @returns Array of data objects with default values added
 */
export function addDefaultValuesToArray<T>(
  dataArray: T[], 
  defaults: Partial<T>
): T[] {
  return dataArray.map(item => addDefaultValues(item, defaults));
}

/**
 * Clear the column existence cache
 * This is useful for testing or after schema changes
 */
export function clearColumnExistenceCache(): void {
  Object.keys(columnExistenceCache).forEach(key => {
    delete columnExistenceCache[key];
  });
  enhancedLogger.debug('Column existence cache cleared');
}

/**
 * Extract table and column names from a PostgreSQL error message
 * 
 * @param error The error object
 * @returns Object with table and column names if found
 */
export function extractSchemaInfoFromError(error: Error | unknown): { table?: string; column?: string } {
  const result: { table?: string; column?: string } = {};
  
  // Check if error is an Error object with a message property
  if (!error || typeof error !== 'object' || !('message' in error) || typeof error.message !== 'string') {
    return result;
  }
  
  const errorMessage = error.message;
  
  // Extract column name from "column X does not exist" errors
  const columnMatch = errorMessage.match(/column ["']?([^"']+)["']? does not exist/i);
  if (columnMatch && columnMatch[1]) {
    result.column = columnMatch[1];
  }
  
  // Extract table name from various error messages
  const tableMatch = errorMessage.match(/(?:relation|table) ["']?([^"']+)["']? does not exist/i);
  if (tableMatch && tableMatch[1]) {
    result.table = tableMatch[1];
  }
  
  return result;
}

/**
 * Check if an error is related to schema compatibility
 * 
 * @param error The error to check
 * @returns boolean True if the error is related to schema compatibility
 */
export function isSchemaCompatibilityError(error: Error | unknown): boolean {
  // Check if error is an Error object with a message property
  if (!error || typeof error !== 'object' || !('message' in error) || typeof error.message !== 'string') {
    return false;
  }
  
  const errorMessage = error.message.toLowerCase();
  
  return (
    errorMessage.includes('column') && errorMessage.includes('does not exist') ||
    errorMessage.includes('relation') && errorMessage.includes('does not exist') ||
    errorMessage.includes('table') && errorMessage.includes('does not exist')
  );
}

/**
 * Log a schema compatibility error with enhanced details
 * 
 * @param error The error to log
 * @param context Additional context information
 */
export function logSchemaCompatibilityError(error: Error | unknown, context: Record<string, unknown> = {}): void {
  if (!isSchemaCompatibilityError(error)) {
    return;
  }
  
  // At this point we know error has a message property
  const errorObj = error as Error;
  
  const schemaInfo = extractSchemaInfoFromError(error);
  
  enhancedLogger.error('Schema compatibility error', {
    ...context,
    error: errorObj.message,
    table: schemaInfo.table,
    column: schemaInfo.column,
    stack: errorObj.stack
  });
}