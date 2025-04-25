/**
 * Result of building an update query
 */
export interface UpdateQueryResult {
    query: string;
    values: (string | number | boolean | null)[];
}
