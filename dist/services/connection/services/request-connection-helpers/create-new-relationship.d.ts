import { ConnectionOperationResponse } from '../../types';
/**
 * Create a new relationship
 */
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
export declare function createNewRelationship(client: DatabaseClient, initiatingOrgId: number, targetOrgId: number, initiatingUserId: number, notes: string | undefined, orgsData: OrganizationData[]): Promise<ConnectionOperationResponse>;
export {};
