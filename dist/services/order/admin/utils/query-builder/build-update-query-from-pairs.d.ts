import { UpdateQueryResult } from './types';
/**
 * Build an SQL update query from a list of field/value pairs
 * @param tableName Name of the table to update
 * @param fieldValuePairs Array of objects with field and value properties
 * @param idField Name of the ID field (default: 'id')
 * @param idValue Value of the ID field
 * @param includeTimestamp Whether to include updated_at = NOW() (default: true)
 * @param returnFields Fields to return (default: ['id'])
 * @returns Object containing the query string and parameter values
 */
export declare function buildUpdateQueryFromPairs(tableName: string, fieldValuePairs: {
    field: string;
    value: string | number | boolean | null | undefined;
}[], idField: string | undefined, idValue: string | number, includeTimestamp?: boolean, returnFields?: string[]): UpdateQueryResult;
