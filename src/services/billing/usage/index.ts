/**
 * Billing usage module
 * 
 * This module now only exports the order categorization function
 * which is used to determine if an order is advanced imaging.
 * Post-paid billing has been removed in favor of the dual credit system.
 */

export { isAdvancedImaging } from './orderCategorization';
export { STANDARD_IMAGING_UNIT_PRICE, ADVANCED_IMAGING_UNIT_PRICE } from './constants';