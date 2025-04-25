/**
 * Interface for parsed patient information from EMR
 */
interface ParsedPatientInfo {
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    phone?: string;
    email?: string;
    [key: string]: string | undefined;
}
/**
 * Update patient information from parsed EMR data
 * @param patientId Patient ID
 * @param parsedPatientInfo Parsed patient information
 * @returns Promise with result
 */
export declare function updatePatientFromEmr(patientId: number, parsedPatientInfo: ParsedPatientInfo): Promise<void>;
export {};
