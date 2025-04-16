/**
 * Normalize code arrays to ensure consistent format
 */
export declare function normalizeCodeArray(codes: any): Array<{
    code: string;
    description: string;
    isPrimary?: boolean;
}>;
