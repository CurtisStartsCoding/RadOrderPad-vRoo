/**
 * PendingRequestsList Component
 * 
 * Displays a table of pending connection requests from other organizations.
 */

import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ConnectionRequest } from '../types';
import { formatDate } from '../utils/format-utils';

interface PendingRequestsListProps {
  requests: ConnectionRequest[] | undefined;
  isLoading: boolean;
  onApprove: (requestId: number) => void;
  onReject: (requestId: number) => void;
  isApproving: boolean;
  isRejecting: boolean;
}

export const PendingRequestsList: React.FC<PendingRequestsListProps> = ({
  requests,
  isLoading,
  onApprove,
  onReject,
  isApproving,
  isRejecting
}) => {
  if (isLoading) {
    return <div className="text-center py-4">Loading pending requests...</div>;
  }

  if (!requests || requests.length === 0) {
    return (
      <div className="text-center py-4">
        No pending connection requests.
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Organization</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Requested By</TableHead>
            <TableHead>Date Requested</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((request) => (
            <TableRow key={request.id}>
              <TableCell className="font-medium">{request.organizationName}</TableCell>
              <TableCell>{request.organizationType}</TableCell>
              <TableCell>{request.initiatedByName}</TableCell>
              <TableCell>{formatDate(request.createdAt)}</TableCell>
              <TableCell className="space-x-2">
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => onApprove(request.id)}
                  disabled={isApproving || isRejecting}
                >
                  Approve
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onReject(request.id)}
                  disabled={isApproving || isRejecting}
                >
                  Reject
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};