/**
 * Utility for building SQL update queries
 */
/**
 * Result of building an update query
 */
export interface UpdateQueryResult {
    query: string;
    values: any[];
}
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
/**
 * Build an SQL update query from a list of field/value pairs
 * @param tableName Name of the table to update
 * @param fieldValuePairs Array of objects with field and value properties
 * @param idField Name of the ID field (default: 'id')
 * @param idValue Value of the ID
 * @param includeTimestamp Whether to include updated_at = NOW() (default: true)
 * @param returnFields Fields to return (default: ['id'])
 * @returns Object containing the query string and parameter values
 */
export declare function buildUpdateQueryFromPairs(tableName: string, fieldValuePairs: {
    field: string;
    value: any;
}[], idField: string | undefined, idValue: any, includeTimestamp?: boolean, returnFields?: string[]): UpdateQueryResult;
declare const _default: {
    buildUpdateQuery: typeof buildUpdateQuery;
    buildUpdateQueryFromPairs: typeof buildUpdateQueryFromPairs;
};
export default _default;
