import { ConnectionOperationResponse } from '../types';
/**
 * Update an existing relationship to pending
 */
export declare function updateExistingRelationship(client: any, initiatingOrgId: number, targetOrgId: number, initiatingUserId: number, notes: string | undefined, existingId: number, orgsData: any[]): Promise<ConnectionOperationResponse>;
/**
 * Create a new relationship
 */
export declare function createNewRelationship(client: any, initiatingOrgId: number, targetOrgId: number, initiatingUserId: number, notes: string | undefined, orgsData: any[]): Promise<ConnectionOperationResponse>;
