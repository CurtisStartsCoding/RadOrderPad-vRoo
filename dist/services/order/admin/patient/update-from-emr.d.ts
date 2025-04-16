/**
 * Update patient information from parsed EMR data
 * @param patientId Patient ID
 * @param parsedPatientInfo Parsed patient information
 * @returns Promise with result
 */
export declare function updatePatientFromEmr(patientId: number, parsedPatientInfo: any): Promise<void>;
export default updatePatientFromEmr;
