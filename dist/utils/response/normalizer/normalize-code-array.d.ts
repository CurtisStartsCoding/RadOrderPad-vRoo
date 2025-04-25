/**
 * Type for code object
 */
type CodeObject = {
    code: string;
    description: string;
    isPrimary?: boolean;
};
/**
 * Normalize code arrays to ensure consistent format
 */
export declare function normalizeCodeArray(codes: string | string[] | CodeObject[] | null | undefined): CodeObject[];
export {};
