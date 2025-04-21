import { OrderDetails } from '../types';

/**
 * Export order data as JSON
 * @param orderDetails Order details object
 * @returns JSON object
 */
export function exportAsJson(orderDetails: OrderDetails): OrderDetails {
  // Simply return the complete order details object
  // The controller will handle setting the Content-Type header to application/json
  return orderDetails;
}

export default exportAsJson;