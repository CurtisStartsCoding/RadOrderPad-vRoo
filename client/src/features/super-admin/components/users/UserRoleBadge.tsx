/**
 * UserRoleBadge Component
 * 
 * Badge for displaying user role.
 */

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { UserRole } from '../../types';

interface UserRoleBadgeProps {
  role: UserRole;
}

export const UserRoleBadge: React.FC<UserRoleBadgeProps> = ({ role }) => {
  // Determine badge variant based on role
  const getBadgeVariant = () => {
    switch (role) {
      case UserRole.SUPER_ADMIN:
        return 'destructive';
      case UserRole.ADMIN_REFERRING:
      case UserRole.ADMIN_RADIOLOGY:
        return 'default';
      case UserRole.PHYSICIAN:
        return 'secondary';
      case UserRole.RADIOLOGIST:
        return 'secondary';
      case UserRole.ADMIN_STAFF:
        return 'outline';
      case UserRole.SCHEDULER:
        return 'outline';
      default:
        return 'default';
    }
  };
  
  // Format role for display
  const formatRole = (role: UserRole): string => {
    switch (role) {
      case UserRole.SUPER_ADMIN:
        return 'Super Admin';
      case UserRole.ADMIN_REFERRING:
        return 'Referring Admin';
      case UserRole.ADMIN_RADIOLOGY:
        return 'Radiology Admin';
      case UserRole.PHYSICIAN:
        return 'Physician';
      case UserRole.RADIOLOGIST:
        return 'Radiologist';
      case UserRole.ADMIN_STAFF:
        return 'Admin Staff';
      case UserRole.SCHEDULER:
        return 'Scheduler';
      default:
        return role;
    }
  };
  
  return (
    <Badge variant={getBadgeVariant()}>
      {formatRole(role)}
    </Badge>
  );
};