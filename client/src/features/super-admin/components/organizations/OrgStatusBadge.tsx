/**
 * OrgStatusBadge Component
 * 
 * Badge for displaying organization status.
 */

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { OrganizationStatus } from '../../types';

interface OrgStatusBadgeProps {
  status: OrganizationStatus;
}

export const OrgStatusBadge: React.FC<OrgStatusBadgeProps> = ({ status }) => {
  // Determine badge variant based on status
  const getBadgeVariant = () => {
    switch (status) {
      case OrganizationStatus.ACTIVE:
        return 'default';
      case OrganizationStatus.ON_HOLD:
        return 'secondary';
      case OrganizationStatus.PURGATORY:
        return 'destructive';
      case OrganizationStatus.TERMINATED:
        return 'outline';
      default:
        return 'default';
    }
  };
  
  // Format status for display
  const formatStatus = (status: OrganizationStatus): string => {
    return status
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };
  
  return (
    <Badge variant={getBadgeVariant()}>
      {formatStatus(status)}
    </Badge>
  );
};