import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "../../../components/ui/table";
import { Badge } from "../../../components/ui/badge";
import { AdminOrderQueueItem, AdminOrderStatus } from "../types";
import { formatDate } from "../utils/date-utils";

/**
 * Props for the AdminOrderTable component
 */
interface AdminOrderTableProps {
  /** Orders to display in the table */
  orders: AdminOrderQueueItem[];
  
  /** Whether the orders are loading */
  isLoading: boolean;
}

/**
 * AdminOrderTable Component
 * 
 * Displays a table of orders pending admin action.
 */
export const AdminOrderTable: React.FC<AdminOrderTableProps> = ({
  orders,
  isLoading
}) => {
  const router = useRouter();
  
  // Handle row click
  const handleRowClick = (orderId: string) => {
    router.push(`/admin/order/${orderId}`);
  };
  
  // Get status badge variant
  const getStatusBadgeVariant = (status: AdminOrderStatus) => {
    switch (status) {
      case AdminOrderStatus.PENDING_ADMIN:
        return 'default';
      case AdminOrderStatus.SENT_TO_RADIOLOGY:
        return 'secondary';
      case AdminOrderStatus.COMPLETED:
        return 'success';
      case AdminOrderStatus.CANCELLED:
        return 'destructive';
      default:
        return 'outline';
    }
  };
  
  // Get EMR badge variant
  const getEmrBadgeVariant = (processed: boolean) => {
    return processed ? 'success' : 'default';
  };
  
  // Get insurance badge variant
  const getInsuranceBadgeVariant = (verified: boolean) => {
    return verified ? 'success' : 'default';
  };
  
  // If loading, show skeleton
  if (isLoading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient</TableHead>
              <TableHead>DOB</TableHead>
              <TableHead>MRN</TableHead>
              <TableHead>Modality</TableHead>
              <TableHead>Body Part</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>EMR</TableHead>
              <TableHead>Insurance</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Physician</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                {Array.from({ length: 10 }).map((_, cellIndex) => (
                  <TableCell key={cellIndex}>
                    <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }
  
  // If no orders, show empty state
  if (orders.length === 0) {
    return (
      <div className="rounded-md border p-8 text-center">
        <p className="text-gray-500">No orders pending admin action.</p>
      </div>
    );
  }
  
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Patient</TableHead>
            <TableHead>DOB</TableHead>
            <TableHead>MRN</TableHead>
            <TableHead>Modality</TableHead>
            <TableHead>Body Part</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>EMR</TableHead>
            <TableHead>Insurance</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Physician</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow
              key={order.id}
              onClick={() => handleRowClick(order.id)}
              className="cursor-pointer hover:bg-gray-50"
            >
              <TableCell>{order.patientName}</TableCell>
              <TableCell>{formatDate(order.patientDob)}</TableCell>
              <TableCell>{order.patientMrn}</TableCell>
              <TableCell>{order.modality}</TableCell>
              <TableCell>{order.bodyPart}</TableCell>
              <TableCell>
                <Badge variant={getStatusBadgeVariant(order.status)}>
                  {order.status === AdminOrderStatus.PENDING_ADMIN ? 'Pending Admin' : 
                   order.status === AdminOrderStatus.SENT_TO_RADIOLOGY ? 'Sent to Radiology' :
                   order.status === AdminOrderStatus.COMPLETED ? 'Completed' : 'Cancelled'}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={getEmrBadgeVariant(order.emrProcessed)}>
                  {order.emrProcessed ? 'Processed' : 'Pending'}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={getInsuranceBadgeVariant(order.insuranceVerified)}>
                  {order.insuranceVerified ? 'Verified' : 'Pending'}
                </Badge>
              </TableCell>
              <TableCell>{formatDate(order.createdAt)}</TableCell>
              <TableCell>{order.physicianName}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};