/**
 * UserDetailDialog Component
 * 
 * A dialog/modal for viewing and editing user details.
 */

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../../../components/ui/select';
import { Label } from '../../../components/ui/label';
import { User, UserRole, UserStatus, UpdateUserRequest } from '../types/user-types';
import { 
  formatRole, 
  formatDateWithTime, 
  getStatusBadgeVariant, 
  getAvailableRoles, 
  getAvailableStatuses 
} from '../utils/format-utils';

interface UserDetailDialogProps {
  open: boolean;
  onClose: () => void;
  user: User | null;
  onUpdateUser: (data: UpdateUserRequest) => void;
  isSubmitting: boolean;
  currentUserRole: string;
}

export const UserDetailDialog: React.FC<UserDetailDialogProps> = ({
  open,
  onClose,
  user,
  onUpdateUser,
  isSubmitting,
  currentUserRole
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole | undefined>(undefined);
  const [selectedStatus, setSelectedStatus] = useState<UserStatus | undefined>(undefined);
  const [hasChanges, setHasChanges] = useState(false);

  // Reset state when dialog opens/closes or user changes
  useEffect(() => {
    if (user) {
      setSelectedRole(user.role);
      setSelectedStatus(user.status);
      setHasChanges(false);
    } else {
      setSelectedRole(undefined);
      setSelectedStatus(undefined);
      setHasChanges(false);
    }
  }, [user, open]);

  // Check if there are changes
  useEffect(() => {
    if (user) {
      setHasChanges(
        selectedRole !== user.role || selectedStatus !== user.status
      );
    }
  }, [selectedRole, selectedStatus, user]);

  const handleSave = () => {
    if (user && hasChanges) {
      const updateData: UpdateUserRequest = {
        id: user.id
      };

      if (selectedRole !== user.role && selectedRole !== undefined) {
        updateData.role = selectedRole;
      }

      if (selectedStatus !== user.status && selectedStatus !== undefined) {
        updateData.status = selectedStatus;
      }

      onUpdateUser(updateData);
    }
  };

  if (!user) {
    return null;
  }

  const availableRoles = getAvailableRoles(currentUserRole);
  const availableStatuses = getAvailableStatuses(user.status);

  return (
    <Dialog open={open} onOpenChange={(isOpen: boolean) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right font-medium">Name</Label>
            <div className="col-span-3">
              {user.firstName} {user.lastName}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right font-medium">Email</Label>
            <div className="col-span-3">{user.email}</div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right font-medium">Organization</Label>
            <div className="col-span-3">{user.organizationName || '-'}</div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right font-medium">Created</Label>
            <div className="col-span-3">{formatDateWithTime(user.createdAt)}</div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right font-medium">Last Updated</Label>
            <div className="col-span-3">{formatDateWithTime(user.updatedAt)}</div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="role" className="text-right font-medium">
              Role
            </Label>
            <div className="col-span-3">
              <Select
                value={selectedRole}
                onValueChange={(value: string) => setSelectedRole(value as UserRole)}
                disabled={isSubmitting}
              >
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {availableRoles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {formatRole(role)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right font-medium">
              Status
            </Label>
            <div className="col-span-3">
              <div className="flex items-center space-x-2">
                <Select
                  value={selectedStatus}
                  onValueChange={(value: string) => setSelectedStatus(value as UserStatus)}
                  disabled={isSubmitting}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableStatuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedStatus && (
                  <Badge variant={getStatusBadgeVariant(selectedStatus)}>
                    {selectedStatus}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={isSubmitting || !hasChanges}
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};