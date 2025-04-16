/**
 * Normalize response field names to handle casing issues
 */
export declare function normalizeResponseFields(response: any): any;
/**
 * Normalize code arrays to ensure consistent format
 */
export declare function normalizeCodeArray(codes: any): Array<{
    code: string;
    description: string;
}>;
