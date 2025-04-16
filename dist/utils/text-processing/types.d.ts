/**
 * Type definitions for text processing utilities
 */
/**
 * Medical keyword categories
 */
export declare enum MedicalKeywordCategory {
    ANATOMY = "anatomy",
    MODALITY = "modality",
    SYMPTOM = "symptom",
    CODE = "code",
    ABBREVIATION = "abbreviation"
}
/**
 * Medical keyword with category
 */
export interface MedicalKeyword {
    term: string;
    category: MedicalKeywordCategory;
}
/**
 * Options for PHI sanitization
 */
export interface PHISanitizerOptions {
    sanitizeMRN?: boolean;
    sanitizeSSN?: boolean;
    sanitizePhoneNumbers?: boolean;
    sanitizeDates?: boolean;
    sanitizeNames?: boolean;
    sanitizeEmails?: boolean;
    sanitizeURLs?: boolean;
    sanitizeAddresses?: boolean;
    sanitizeZipCodes?: boolean;
}
