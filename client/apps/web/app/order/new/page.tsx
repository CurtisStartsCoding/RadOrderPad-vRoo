import { PhysicianOrderWorkflow } from "../../../../../src/features/physician-order";

/**
 * New Order Page
 * 
 * This page serves as the entry point for creating a new physician order.
 * It renders the PhysicianOrderWorkflow component which orchestrates the entire order creation process.
 */
export default function NewOrderPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">New Radiology Order</h1>
      <PhysicianOrderWorkflow />
    </div>
  );
}