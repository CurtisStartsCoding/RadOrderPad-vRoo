/**
 * Types related to prompt templates and assignments
 */

/**
 * Represents a prompt template in the database
 */
export interface PromptTemplate {
  id: number;
  name: string;
  type: string;
  version: string;
  content_template: string;
  word_limit?: number | null;
  active: boolean;
  created_at: Date;
  updated_at: Date;
}

/**
 * Represents a prompt assignment in the database
 */
export interface PromptAssignment {
  id: number;
  physician_id: number;
  prompt_id: number;
  ab_group?: string | null;
  assigned_on: Date;
  is_active: boolean;
}

/**
 * Input for creating a new prompt template
 */
export type CreatePromptTemplateInput = Omit<PromptTemplate, 'id' | 'created_at' | 'updated_at'>;

/**
 * Input for updating an existing prompt template
 */
export type UpdatePromptTemplateInput = Partial<Omit<PromptTemplate, 'id' | 'created_at' | 'updated_at'>>;

/**
 * Filters for listing prompt templates
 */
export interface PromptTemplateFilters {
  type?: string;
  active?: boolean;
  version?: string;
}

/**
 * Input for creating a new prompt assignment
 */
export type CreatePromptAssignmentInput = Omit<PromptAssignment, 'id' | 'assigned_on'>;

/**
 * Input for updating an existing prompt assignment
 */
export type UpdatePromptAssignmentInput = Partial<Omit<PromptAssignment, 'id' | 'assigned_on'>>;

/**
 * Filters for listing prompt assignments
 */
export interface PromptAssignmentFilters {
  physician_id?: number;
  prompt_id?: number;
  is_active?: boolean;
  ab_group?: string;
}

/**
 * Extended prompt assignment with related data
 */
export interface PromptAssignmentWithDetails extends PromptAssignment {
  physician_name?: string;
  physician_email?: string;
  template_name?: string;
  template_type?: string;
  template_version?: string;
}