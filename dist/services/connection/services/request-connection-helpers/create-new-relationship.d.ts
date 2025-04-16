import { ConnectionOperationResponse } from '../../types';
/**
 * Create a new relationship
 */
export declare function createNewRelationship(client: any, initiatingOrgId: number, targetOrgId: number, initiatingUserId: number, notes: string | undefined, orgsData: any[]): Promise<ConnectionOperationResponse>;
