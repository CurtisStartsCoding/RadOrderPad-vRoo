/**
 * ConnectionList Component
 * 
 * Displays a table of existing connections between organizations.
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
import { Badge } from '@/components/ui/badge';
import { Connection, ConnectionStatus } from '../types';
import { formatDate, getStatusBadgeVariant, formatStatus } from '../utils/format-utils';

interface ConnectionListProps {
  connections: Connection[] | undefined;
  isLoading: boolean;
  onTerminate: (connectionId: number) => void;
  isTerminating: boolean;
}

export const ConnectionList: React.FC<ConnectionListProps> = ({
  connections,
  isLoading,
  onTerminate,
  isTerminating
}) => {
  if (isLoading) {
    return <div className="text-center py-4">Loading connections...</div>;
  }

  if (!connections || connections.length === 0) {
    return (
      <div className="text-center py-4">
        No connections found. Use the "Request Connection" button to connect with a partner organization.
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Partner Organization</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Connected Since</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {connections.map((connection) => (
            <TableRow key={connection.id}>
              <TableCell className="font-medium">{connection.relatedOrganizationName}</TableCell>
              <TableCell>{connection.relatedOrganizationType}</TableCell>
              <TableCell>
                <Badge variant={getStatusBadgeVariant(connection.status)}>
                  {formatStatus(connection.status)}
                </Badge>
              </TableCell>
              <TableCell>{formatDate(connection.createdAt)}</TableCell>
              <TableCell>
                {connection.status === ConnectionStatus.ACTIVE && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onTerminate(connection.id)}
                    disabled={isTerminating}
                  >
                    Terminate
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};