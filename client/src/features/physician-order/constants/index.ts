/**
 * Constants for the physician-order feature
 * 
 * This file contains all constants used in the physician-order feature.
 * Centralizing these values makes the code more maintainable and easier to update.
 */

// Patient identification constants
export const DEFAULT_DOB_PRIMARY = "01/01/1980";
export const DEFAULT_DOB_SECONDARY = "01/01/2000";
export const DEFAULT_DOB_MANUAL = "01/01/2000";

// Confidence scores for patient suggestions
export const CONFIDENCE_SCORE_PRIMARY = 0.7;
export const CONFIDENCE_SCORE_SECONDARY = 0.3;

// Timing constants
export const PARSING_DELAY_MS = 500;

// CSS class constants
export const CARD_BG_TEMPORARY = "bg-amber-50 border-amber-200";
export const CARD_BG_NORMAL = "bg-white border-gray-200";

export const BUTTON_CLASS_TEMPORARY = "border-amber-300 text-amber-700 bg-amber-100 hover:bg-amber-200 hover:text-amber-900";
export const BUTTON_CLASS_NORMAL = "border-gray-300 text-gray-700 hover:bg-gray-100";