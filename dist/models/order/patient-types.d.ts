/**
 * Patient interface
 */
export interface Patient {
    id: number;
    pidn: string;
    organization_id: number;
    mrn?: string;
    first_name: string;
    last_name: string;
    middle_name?: string;
    date_of_birth: string;
    gender: string;
    address_line1?: string;
    address_line2?: string;
    city?: string;
    state?: string;
    zip_code?: string;
    phone_number?: string;
    email?: string;
    created_at: Date;
    updated_at: Date;
}
/**
 * Patient info for validation and finalization requests
 */
export interface PatientInfo {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: string;
    mrn?: string;
}
