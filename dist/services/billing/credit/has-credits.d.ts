/**
 * Check if an organization has sufficient credits
 *
 * @param organizationId Organization ID
 * @returns Promise<boolean> True if the organization has credits, false otherwise
 * @throws Error if the organization is not found or there's a database error
 */
export declare function hasCredits(organizationId: number): Promise<boolean>;
