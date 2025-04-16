/**
 * List all users with optional filtering
 *
 * @param filters Optional filters for users
 * @returns Promise with array of users
 */
export declare function listAllUsers(filters: {
    orgId?: number;
    email?: string;
    role?: string;
    status?: boolean;
}): Promise<any[]>;
