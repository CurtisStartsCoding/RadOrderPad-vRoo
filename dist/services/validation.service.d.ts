import { ValidationResult } from '../models';
/**
 * Service for handling validation-related operations
 */
export declare class ValidationService {
    /**
     * Run validation on the provided text and context
     */
    static runValidation(text: string, context?: any, testMode?: boolean): Promise<ValidationResult>;
    /**
     * Log validation attempt to the PHI database
     */
    private static logValidationAttempt;
}
export default ValidationService;
