import { OrderDetails } from './types';
import { getOrderDetails } from './details';

// Re-export all functions from the details directory
export * from './details';

// Export the main function as default
export default getOrderDetails;