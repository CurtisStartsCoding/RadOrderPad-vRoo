/**
 * Insurance data interface with required fields
 */
interface InsuranceData {
    insurer_name?: string;
    policy_number?: string;
    [key: string]: unknown;
}
/**
 * Validate insurance data for required fields
 * @param insurance Insurance data
 * @returns Array of missing field names
 */
export declare function validateInsuranceData(insurance: InsuranceData | null | undefined): string[];
export {};
