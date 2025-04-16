/**
 * Verify that the user belongs to the referring organization
 *
 * @param userId The ID of the user
 * @param referringOrgId The ID of the referring organization
 * @throws Error if the user is not authorized
 */
export declare function verifyUserAuthorization(userId: number, referringOrgId: number): Promise<void>;
