/**
 * Main validation logic
 */
import { ValidationResult } from '../../models';
import { ValidationContext, ValidationOptions } from './types';
/**
 * Run validation on the provided text and context
 */
export declare function runValidation(text: string, context?: ValidationContext, options?: ValidationOptions): Promise<ValidationResult>;
