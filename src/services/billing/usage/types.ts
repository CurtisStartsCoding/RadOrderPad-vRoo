/**
 * Types for the radiology order usage reporting functionality
 */

/**
 * Order category enum
 */
export enum OrderCategory {
  STANDARD = 'standard',
  ADVANCED = 'advanced'
}

/**
 * Order usage data interface
 * Represents the count of standard and advanced orders for a radiology organization
 */
export interface OrderUsageData {
  radiologyOrgId: number;
  standardOrderCount: number;
  advancedOrderCount: number;
}

/**
 * Radiology organization info interface
 * Contains the billing ID and name of a radiology organization
 */
export interface RadiologyOrgInfo {
  billingId: string;
  name: string;
}

/**
 * Order usage report interface
 * Represents the final report for a radiology organization
 */
export interface OrderUsageReport {
  organizationId: number;
  organizationName: string;
  billingId: string;
  standardOrderCount: number;
  advancedOrderCount: number;
  standardOrderAmount: number;
  advancedOrderAmount: number;
  totalAmount: number;
  reportedToStripe: boolean;
  stripeInvoiceItemIds?: string[];
  error?: string;
}

/**
 * Pricing constants
 */
export const STANDARD_ORDER_PRICE_CENTS = 200; // $2.00 per standard order
export const ADVANCED_ORDER_PRICE_CENTS = 700; // $7.00 per advanced order