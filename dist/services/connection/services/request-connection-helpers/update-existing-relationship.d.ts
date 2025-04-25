import { ConnectionOperationResponse } from '../../types';
interface DatabaseClient {
    query: (text: string, params?: (string | number | null)[] | undefined) => Promise<{
        rows: Array<{
            id: number;
        } & Record<string, unknown>>;
        rowCount: number;
    }>;
}
interface OrganizationData {
    id: number;
    name: string;
    contact_email?: string;
    [key: string]: unknown;
}
/**
 * Update an existing relationship to pending
 */
export declare function updateExistingRelationship(client: DatabaseClient, initiatingOrgId: number, targetOrgId: number, initiatingUserId: number, notes: string | undefined, existingId: number, orgsData: OrganizationData[]): Promise<ConnectionOperationResponse>;
export {};
