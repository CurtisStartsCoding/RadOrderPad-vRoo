/**
 * Interface for prompt template from database
 */
export interface PromptTemplate {
    id: number;
    name: string;
    type: string;
    version: string;
    content_template: string;
    word_limit: number;
    active: boolean;
    created_at: Date;
    updated_at: Date;
}
/**
 * Interface for categorized keywords
 */
export interface CategorizedKeywords {
    anatomyTerms: string[];
    modalities: string[];
    symptoms: string[];
    codes: string[];
}
/**
 * Interface for ICD-10 code row
 */
export interface ICD10Row {
    icd10_code: string;
    description: string;
    clinical_notes?: string | null;
    imaging_modalities?: string | null;
    primary_imaging?: string | null;
}
/**
 * Interface for CPT code row
 */
export interface CPTRow {
    cpt_code: string;
    description: string;
    modality?: string | null;
    body_part?: string | null;
}
/**
 * Interface for mapping row
 */
export interface MappingRow {
    id: number;
    icd10_code: string;
    icd10_description: string;
    cpt_code: string;
    cpt_description: string;
    appropriateness: number | string;
    evidence_source?: string | null;
    refined_justification?: string | null;
}
/**
 * Interface for markdown row
 */
export interface MarkdownRow {
    id: number;
    icd10_code: string;
    icd10_description: string;
    content_preview: string;
}
