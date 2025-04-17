/**
 * SuperAdminOrgTable Component
 * 
 * Table for displaying and managing organizations in the Super Admin feature.
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
import {
  Organization,
  OrganizationStatus,
  OrganizationType,
  OrganizationFilterParams
} from '../../types';
import { OrgStatusBadge } from './OrgStatusBadge';
import { OrgFilters } from './OrgFilters';

interface SuperAdminOrgTableProps {
  organizations: Organization[] | undefined;
  isLoading: boolean;
  onUpdateStatus: (orgId: number, status: OrganizationStatus) => void;
  onAdjustCredits: (orgId: number, amount: number, reason: string) => void;
  onUpdateFilters: (filters: OrganizationFilterParams) => void;
  onResetFilters: () => void;
  filterParams: OrganizationFilterParams;
}

export const SuperAdminOrgTable: React.FC<SuperAdminOrgTableProps> = ({
  organizations,
  isLoading,
  onUpdateStatus,
  onAdjustCredits,
  onUpdateFilters,
  onResetFilters,
  filterParams
}) => {
  // Format organization type for display
  const formatOrgType = (type: OrganizationType): string => {
    return type === OrganizationType.REFERRING_PRACTICE
      ? 'Referring Practice'
      : 'Radiology Group';
  };
  
  // Render loading state
  if (isLoading) {
    return <div className="text-center py-8">Loading organizations...</div>;
  }
  
  // Render empty state
  if (!organizations || organizations.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No organizations found.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <OrgFilters
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
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Credit Balance</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {organizations.map((org) => (
              <TableRow key={org.id}>
                <TableCell>{org.id}</TableCell>
                <TableCell className="font-medium">
                  <Link
                    href={`/superadmin/organizations/${org.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    {org.name}
                  </Link>
                </TableCell>
                <TableCell>{formatOrgType(org.type)}</TableCell>
                <TableCell>
                  <OrgStatusBadge status={org.status} />
                </TableCell>
                <TableCell className="text-right">{org.creditBalance}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newStatus = org.status === OrganizationStatus.ACTIVE
                          ? OrganizationStatus.ON_HOLD
                          : OrganizationStatus.ACTIVE;
                        onUpdateStatus(org.id, newStatus);
                      }}
                    >
                      {org.status === OrganizationStatus.ACTIVE ? 'Suspend' : 'Activate'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onAdjustCredits(org.id, 100, 'Manual adjustment')}
                    >
                      Add Credits
                    </Button>
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