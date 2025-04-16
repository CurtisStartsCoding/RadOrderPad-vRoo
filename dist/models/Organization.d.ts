export interface Organization {
    id: number;
    name: string;
    type: OrganizationType;
    npi?: string;
    tax_id?: string;
    address_line1?: string;
    address_line2?: string;
    city?: string;
    state?: string;
    zip_code?: string;
    phone_number?: string;
    fax_number?: string;
    contact_email?: string;
    website?: string;
    logo_url?: string;
    billing_id?: string;
    credit_balance: number;
    subscription_tier?: string;
    status: OrganizationStatus;
    assigned_account_manager_id?: number;
    created_at: Date;
    updated_at: Date;
}
export declare enum OrganizationType {
    REFERRING_PRACTICE = "referring_practice",
    RADIOLOGY_GROUP = "radiology_group"
}
export declare enum OrganizationStatus {
    ACTIVE = "active",
    ON_HOLD = "on_hold",
    PURGATORY = "purgatory",
    TERMINATED = "terminated"
}
export interface OrganizationRegistrationDTO {
    name: string;
    type: OrganizationType;
    npi?: string;
    tax_id?: string;
    address_line1?: string;
    address_line2?: string;
    city?: string;
    state?: string;
    zip_code?: string;
    phone_number?: string;
    fax_number?: string;
    contact_email?: string;
    website?: string;
    registration_key: string;
}
export interface OrganizationResponse {
    id: number;
    name: string;
    type: OrganizationType;
    npi?: string;
    address_line1?: string;
    city?: string;
    state?: string;
    zip_code?: string;
    phone_number?: string;
    contact_email?: string;
    website?: string;
    logo_url?: string;
    status: OrganizationStatus;
    created_at: Date;
}
