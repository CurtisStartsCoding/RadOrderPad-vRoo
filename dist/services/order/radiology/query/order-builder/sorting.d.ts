/**
 * Apply sorting to the query
 * @param query Current query string
 * @param sortBy Column to sort by
 * @param sortOrder Sort order (asc or desc)
 * @returns Updated query string
 */
declare function applySorting(query: string, sortBy?: string, sortOrder?: 'asc' | 'desc'): string;
export { applySorting };
