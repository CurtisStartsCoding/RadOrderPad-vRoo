/**
 * Utility functions for generating database context for validation
 */
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
 * Get the active default prompt template from the database
 */
export declare function getActivePromptTemplate(): Promise<PromptTemplate>;
/**
 * Generate database context based on extracted keywords
 */
export declare function generateDatabaseContext(keywords: string[]): Promise<string>;
/**
 * Construct the prompt for the LLM
 */
export declare function constructPrompt(templateContent: string, sanitizedText: string, databaseContext: string, wordLimit: number | null | undefined, isOverrideValidation: boolean): string;
