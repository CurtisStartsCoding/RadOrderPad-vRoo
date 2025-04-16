import { PaginationResult } from '../types';
/**
 * Create pagination result object
 * @param totalCount Total number of items
 * @param page Current page number
 * @param limit Items per page
 * @returns Pagination result object
 */
export declare function createPaginationResult(totalCount: number, page: number, limit: number): PaginationResult;
export default createPaginationResult;
