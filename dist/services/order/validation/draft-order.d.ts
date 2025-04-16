import { PatientInfo } from './types';
/**
 * Create a new draft order
 *
 * @param dictationText - The original dictation text
 * @param userId - The ID of the user creating the order
 * @param patientInfo - Information about the patient
 * @param radiologyOrganizationId - Optional ID of the radiology organization
 * @returns The ID of the created order
 */
export declare function createDraftOrder(dictationText: string, userId: number, patientInfo: PatientInfo, radiologyOrganizationId?: number): Promise<number>;
