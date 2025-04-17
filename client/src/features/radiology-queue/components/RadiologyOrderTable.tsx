import React from 'react';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '../../../components/ui/table';
import { Badge } from '../../../components/ui/badge';
import { RadiologyOrder, RadiologyOrderStatus } from '../types/radiology-order-types';
import { formatDate } from '../utils/date-utils';

/**
 * Props for the RadiologyOrderTable component
 */
interface RadiologyOrderTableProps {
  orders: RadiologyOrder[];
  isLoading: boolean;
}

/**
 * RadiologyOrderTable Component
 * 
 * Displays a table of radiology orders with clickable rows.
 */
export const RadiologyOrderTable: React.FC<RadiologyOrderTableProps> = ({
  orders,
  isLoading
}) => {
  const router = useRouter();
  
  /**
   * Handle row click to navigate to order detail
   */
  const handleRowClick = (orderId: string) => {
    router.push(`/radiology/order/${orderId}`);
  };
  
  /**
   * Get status badge variant based on status
   */
  const getStatusBadgeVariant = (status: RadiologyOrderStatus): 'default' | 'secondary' | 'success' | 'destructive' => {
    switch (status) {
      case RadiologyOrderStatus.PENDING_REVIEW:
        return 'default';
      case RadiologyOrderStatus.IN_PROGRESS:
        return 'secondary';
      case RadiologyOrderStatus.COMPLETED:
        return 'success';
      case RadiologyOrderStatus.CANCELLED:
        return 'destructive';
      default:
        return 'default';
    }
  };
  
  /**
   * Format status for display
   */
  const formatStatus = (status: RadiologyOrderStatus): string => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
  };
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Loading orders...</p>
      </div>
    );
  }
  
  // Show empty state
  if (orders.length === 0) {
    return (
      <div className="flex justify-center items-center h-64 border rounded-md">
        <div className="text-center">
          <p className="text-gray-500 mb-2">No orders found</p>
          <p className="text-gray-400 text-sm">Try adjusting your filters</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Patient</TableHead>
            <TableHead>Modality</TableHead>
            <TableHead>Body Part</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Updated</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow
              key={order.id}
              onClick={() => handleRowClick(order.id)}
              className={`cursor-pointer hover:bg-gray-50 ${order.overrideInfo?.isOverridden ? 'bg-amber-50' : ''}`}
            >
              <TableCell className="font-medium">{order.id}</TableCell>
              <TableCell>{order.patient.name}</TableCell>
              <TableCell>{order.modality}</TableCell>
              <TableCell>{order.bodyPart}</TableCell>
              <TableCell>
                <Badge variant={getStatusBadgeVariant(order.status)}>
                  {formatStatus(order.status)}
                </Badge>
                {order.overrideInfo?.isOverridden && (
                  <Badge variant="outline" className="ml-2 bg-amber-50">
                    Override
                  </Badge>
                )}
              </TableCell>
              <TableCell>{formatDate(order.createdAt)}</TableCell>
              <TableCell>{formatDate(order.updatedAt)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};