/**
 * LocationTable Component
 * 
 * Displays a table of locations with relevant information and action buttons.
 */

import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Location, LocationStatus } from '../types/location-types';
import { formatDate, formatFullAddress, formatPhoneNumber, formatStatus, getStatusBadgeVariant } from '../utils/format-utils';

interface LocationTableProps {
  locations: Location[];
  isLoading: boolean;
  onEditLocation: (locationId: string) => void;
  onDeactivateLocation: (locationId: string) => void;
}

export const LocationTable: React.FC<LocationTableProps> = ({
  locations,
  isLoading,
  onEditLocation,
  onDeactivateLocation
}) => {
  if (isLoading) {
    return <div className="flex justify-center p-4">Loading locations...</div>;
  }

  if (!locations || locations.length === 0) {
    return <div className="text-center p-4">No locations found.</div>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {locations.map((location) => (
            <TableRow key={location.id}>
              <TableCell className="font-medium">
                {location.name}
              </TableCell>
              <TableCell>
                {formatFullAddress(
                  location.address,
                  location.city,
                  location.state,
                  location.zipCode
                )}
              </TableCell>
              <TableCell>{formatPhoneNumber(location.phone)}</TableCell>
              <TableCell>
                <Badge variant={getStatusBadgeVariant(location.status)}>
                  {formatStatus(location.status)}
                </Badge>
              </TableCell>
              <TableCell>{formatDate(location.createdAt)}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="outline"
                  size="sm"
                  className="mr-2"
                  onClick={() => onEditLocation(location.id)}
                >
                  Edit
                </Button>
                {location.status === LocationStatus.ACTIVE && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDeactivateLocation(location.id)}
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