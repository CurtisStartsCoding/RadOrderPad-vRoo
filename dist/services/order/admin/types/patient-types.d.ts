/**
 * Patient data for update
 */
export interface PatientUpdateData {
    firstName?: string;
    lastName?: string;
    middleName?: string;
    dateOfBirth?: string;
    gender?: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    phoneNumber?: string;
    email?: string;
    mrn?: string;
    [key: string]: any;
}
/**
 * Patient data with required fields for validation
 */
export interface PatientData {
    id: number;
    first_name: string;
    last_name: string;
    date_of_birth: string;
    gender: string;
    address_line1?: string;
    city?: string;
    state?: string;
    zip_code?: string;
    phone_number?: string;
}
/**
 * Result of patient information update
 */
export interface PatientUpdateResult {
    success: boolean;
    orderId: number;
    patientId: number;
    message: string;
}
