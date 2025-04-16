import { ConnectionOperationResponse } from '../../types';
/**
 * Update an existing relationship to pending
 */
export declare function updateExistingRelationship(client: any, initiatingOrgId: number, targetOrgId: number, initiatingUserId: number, notes: string | undefined, existingId: number, orgsData: any[]): Promise<ConnectionOperationResponse>;
