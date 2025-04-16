import { UpdateQueryResult } from './types';
/**
 * Build an SQL update query
 * @param tableName Name of the table to update
 * @param updateData Object containing field/value pairs to update
 * @param idField Name of the ID field (default: 'id')
 * @param idValue Value of the ID
 * @param fieldMap Optional mapping of object keys to database columns
 * @param includeTimestamp Whether to include updated_at = NOW() (default: true)
 * @param returnFields Fields to return (default: ['id'])
 * @returns Object containing the query string and parameter values
 */
export declare function buildUpdateQuery(tableName: string, updateData: {
    [key: string]: any;
}, idField: string | undefined, idValue: any, fieldMap?: {
    [key: string]: string;
}, includeTimestamp?: boolean, returnFields?: string[]): UpdateQueryResult;
