/**
 * SuperAdminUserTable Component
 * 
 * Table for displaying and managing users in the Super Admin feature.
 */

import React from 'react';
import Link from 'next/link';
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
import {
  User,
  UserFilterParams
} from '../../types';
import { UserRoleBadge } from './UserRoleBadge';
import { UserFilters } from './UserFilters';

interface SuperAdminUserTableProps {
  users: User[] | undefined;
  isLoading: boolean;
  onToggleActive: (userId: number, isActive: boolean) => void;
  onSendPasswordReset: (userId: number) => void;
  onVerifyEmail: (userId: number) => void;
  onUpdateFilters: (filters: UserFilterParams) => void;
  onResetFilters: () => void;
  filterParams: UserFilterParams;
}

export const SuperAdminUserTable: React.FC<SuperAdminUserTableProps> = ({
  users,
  isLoading,
  onToggleActive,
  onSendPasswordReset,
  onVerifyEmail,
  onUpdateFilters,
  onResetFilters,
  filterParams
}) => {
  // Render loading state
  if (isLoading) {
    return <div className="text-center py-8">Loading users...</div>;
  }
  
  // Render empty state
  if (!users || users.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No users found.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <UserFilters
        filters={filterParams}
        onUpdateFilters={onUpdateFilters}
        onResetFilters={onResetFilters}
      />
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Organization</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell className="font-medium">
                  <Link
                    href={`/superadmin/users/${user.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    {user.firstName} {user.lastName}
                  </Link>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Link
                    href={`/superadmin/organizations/${user.organizationId}`}
                    className="text-blue-600 hover:underline"
                  >
                    {user.organizationName}
                  </Link>
                </TableCell>
                <TableCell>
                  <UserRoleBadge role={user.role} />
                </TableCell>
                <TableCell>
                  <Badge variant={user.isActive ? 'default' : 'secondary'}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onToggleActive(user.id, !user.isActive)}
                    >
                      {user.isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onSendPasswordReset(user.id)}
                    >
                      Reset Password
                    </Button>
                    {!user.emailVerified && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onVerifyEmail(user.id)}
                      >
                        Verify Email
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};