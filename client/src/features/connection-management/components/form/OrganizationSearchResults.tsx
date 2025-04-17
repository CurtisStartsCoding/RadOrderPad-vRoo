/**
 * OrganizationSearchResults Component
 * 
 * Displays search results for organizations.
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
import { OrganizationSearchResult } from '../../types';

interface OrganizationSearchResultsProps {
  results: OrganizationSearchResult[] | undefined;
  onSelectOrganization: (organization: OrganizationSearchResult) => void;
}

export const OrganizationSearchResults: React.FC<OrganizationSearchResultsProps> = ({
  results,
  onSelectOrganization
}) => {
  if (!results) {
    return null;
  }
  
  if (results.length === 0) {
    return (
      <div className="text-center py-4">
        No organizations found. Try different search criteria.
      </div>
    );
  }
  
  return (
    <div className="rounded-md border mt-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Organization</TableHead>
            <TableHead>NPI</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {results.map((org) => (
            <TableRow key={org.id}>
              <TableCell className="font-medium">{org.name}</TableCell>
              <TableCell>{org.npi || 'N/A'}</TableCell>
              <TableCell>
                {org.city && org.state 
                  ? `${org.city}, ${org.state}`
                  : org.city || org.state || 'N/A'}
              </TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onSelectOrganization(org)}
                >
                  Select
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};