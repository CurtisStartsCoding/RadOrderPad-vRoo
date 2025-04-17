/**
 * UserTable Component
 * 
 * Displays a table of users with relevant information and action buttons.
 */

import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../components/ui/table';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { User, UserStatus } from '../types/user-types';
import { formatRole, formatDate, getStatusBadgeVariant } from '../utils/format-utils';

interface UserTableProps {
  users: User[];
  isLoading: boolean;
  onViewUser: (userId: string) => void;
  onDeactivateUser: (userId: string) => void;
}

export const UserTable: React.FC<UserTableProps> = ({
  users,
  isLoading,
  onViewUser,
  onDeactivateUser
}) => {
  if (isLoading) {
    return <div className="flex justify-center p-4">Loading users...</div>;
  }

  if (!users || users.length === 0) {
    return <div className="text-center p-4">No users found.</div>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Organization</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">
                {user.firstName} {user.lastName}
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{formatRole(user.role)}</TableCell>
              <TableCell>{user.organizationName || '-'}</TableCell>
              <TableCell>
                <Badge variant={getStatusBadgeVariant(user.status)}>
                  {user.status}
                </Badge>
              </TableCell>
              <TableCell>{formatDate(user.createdAt)}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="outline"
                  size="sm"
                  className="mr-2"
                  onClick={() => onViewUser(user.id)}
                >
                  View/Edit
                </Button>
                {user.status === UserStatus.ACTIVE && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDeactivateUser(user.id)}
                  >
                    Deactivate
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