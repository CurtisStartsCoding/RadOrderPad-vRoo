import { PatientUpdateData } from './types';
/**
 * Update patient information
 * @param patientId Patient ID
 * @param patientData Patient data
 * @returns Promise with result
 */
export declare function updatePatientInfo(patientId: number, patientData: PatientUpdateData): Promise<number>;
/**
 * Update patient information from parsed EMR data
 * @param patientId Patient ID
 * @param parsedPatientInfo Parsed patient information
 * @returns Promise with result
 */
export declare function updatePatientFromEmr(patientId: number, parsedPatientInfo: any): Promise<void>;
declare const _default: {
    updatePatientInfo: typeof updatePatientInfo;
    updatePatientFromEmr: typeof updatePatientFromEmr;
};
export default _default;
