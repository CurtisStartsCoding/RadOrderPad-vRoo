/**
 * Normalize code arrays to ensure consistent format
 */
export function normalizeCodeArray(codes) {
    if (!codes)
        return [];
    // If codes is already an array of objects with code and description
    if (Array.isArray(codes) && codes.length > 0 && typeof codes[0] === 'object') {
        return codes.map(item => ({
            code: item.code || '',
            description: item.description || '',
            isPrimary: Boolean(item.isPrimary)
        }));
    }
    // If codes is an array of strings
    if (Array.isArray(codes) && codes.length > 0 && typeof codes[0] === 'string') {
        // For string arrays, set the first code as primary by default
        return codes.map((code, index) => ({
            code,
            description: '',
            isPrimary: index === 0
        }));
    }
    // If codes is a string (comma-separated list)
    if (typeof codes === 'string') {
        // For comma-separated strings, set the first code as primary by default
        return codes.split(',').map((code, index) => ({
            code: code.trim(),
            description: '',
            isPrimary: index === 0
        }));
    }
    // Default to empty array
    return [];
}
//# sourceMappingURL=normalize-code-array.js.map