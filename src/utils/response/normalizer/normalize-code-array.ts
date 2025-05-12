/**
 * Type for code object
 */
type CodeObject = {
  code: string;
  description: string;
  isPrimary?: boolean;
  confidence?: number;
};

/**
 * Normalize code arrays to ensure consistent format
 */
export function normalizeCodeArray(
  codes: string | string[] | CodeObject[] | null | undefined
): CodeObject[] {
  if (!codes) return [];
  
  // If codes is already an array of objects with code and description
  if (Array.isArray(codes) && codes.length > 0 && typeof codes[0] === 'object') {
    return (codes as CodeObject[]).map(item => ({
      code: item.code || '',
      description: item.description || '',
      isPrimary: Boolean(item.isPrimary),
      confidence: typeof item.confidence === 'number' ? item.confidence : 0.8 // Default confidence of 80%
    }));
  }
  
  // If codes is an array of strings
  if (Array.isArray(codes) && codes.length > 0 && typeof codes[0] === 'string') {
    // For string arrays, set the first code as primary by default
    return (codes as string[]).map((code, index) => ({
      code,
      description: '',
      isPrimary: index === 0,
      confidence: 0.8 // Default confidence of 80%
    }));
  }
  
  // If codes is a string (comma-separated list)
  if (typeof codes === 'string') {
    // For comma-separated strings, set the first code as primary by default
    return codes.split(',').map((code, index) => ({
      code: code.trim(),
      description: '',
      isPrimary: index === 0,
      confidence: 0.8 // Default confidence of 80%
    }));
  }
  
  // Default to empty array
  return [];
}