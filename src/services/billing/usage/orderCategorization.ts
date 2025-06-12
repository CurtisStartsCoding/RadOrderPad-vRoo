/**
 * Order categorization service
 * 
 * This module handles the logic for categorizing orders as standard or advanced imaging.
 */

// Price constants moved to constants.ts
const ADVANCED_ORDER_PRICE_CENTS = 700;  // $7.00
const STANDARD_ORDER_PRICE_CENTS = 200;  // $2.00

// Define modalities that are considered advanced imaging
const ADVANCED_MODALITIES = ['MRI', 'CT', 'PET', 'NUCLEAR'];

/**
 * Determine if an order is for advanced imaging based on modality or CPT code
 * 
 * @param modality The imaging modality
 * @param cptCode The CPT code
 * @returns boolean indicating if this is advanced imaging
 */
export function isAdvancedImaging(modality: string | null, cptCode: string | null): boolean {
  if (!modality && !cptCode) return false;
  
  // Check modality first if available
  if (modality) {
    const upperModality = modality.toUpperCase();
    return ADVANCED_MODALITIES.some(advancedModality => 
      upperModality.includes(advancedModality));
  }
  
  // If no modality or not matched, check CPT code ranges
  // This is a simplified implementation - in production, you would have a more comprehensive mapping
  if (cptCode) {
    // MRI CPT codes often start with 70 or 72
    // CT scans often start with 70, 71, or 73
    // PET scans often start with 78
    const advancedPrefixes = ['70', '71', '72', '73', '78'];
    return advancedPrefixes.some(prefix => cptCode.startsWith(prefix));
  }
  
  return false;
}

/**
 * Calculate order amounts based on standard and advanced order counts
 * 
 * @param standardOrderCount Number of standard orders
 * @param advancedOrderCount Number of advanced orders
 * @returns Object with standard, advanced, and total amounts in cents
 */
export function calculateOrderAmounts(standardOrderCount: number, advancedOrderCount: number): {
  standardOrderAmount: number;
  advancedOrderAmount: number;
  totalAmount: number;
} {
  const standardOrderAmount = standardOrderCount * STANDARD_ORDER_PRICE_CENTS;
  const advancedOrderAmount = advancedOrderCount * ADVANCED_ORDER_PRICE_CENTS;
  const totalAmount = standardOrderAmount + advancedOrderAmount;
  
  return {
    standardOrderAmount,
    advancedOrderAmount,
    totalAmount
  };
}