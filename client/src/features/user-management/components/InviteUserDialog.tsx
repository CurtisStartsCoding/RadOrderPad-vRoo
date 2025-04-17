/**
 * InviteUserDialog Component
 * 
 * A dialog/modal for inviting new users to the system.
 */

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../../../components/ui/select';
import { InviteUserRequest, UserRole } from '../types/user-types';
import { formatRole, getAvailableRoles } from '../utils/format-utils';

interface InviteUserDialogProps {
  open: boolean;
  onClose: () => void;
  onInvite: (data: InviteUserRequest) => void;
  isSubmitting: boolean;
  currentUserRole: string;
}

export const InviteUserDialog: React.FC<InviteUserDialogProps> = ({
  open,
  onClose,
  onInvite,
  isSubmitting,
  currentUserRole
}) => {
  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<InviteUserRequest>();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const availableRoles = getAvailableRoles(currentUserRole);

  // Reset form when dialog opens/closes
  React.useEffect(() => {
    if (open) {
      reset();
      setSelectedRole(null);
    }
  }, [open, reset]);

  const onSubmit = (data: InviteUserRequest) => {
    if (selectedRole) {
      onInvite({
        ...data,
        role: selectedRole
      });
    }
  };

  const handleRoleChange = (value: string) => {
    setSelectedRole(value as UserRole);
    setValue('role', value as UserRole);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen: boolean) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Invite New User</DialogTitle>
          <DialogDescription>
            Send an invitation email to add a new user to your organization.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <div className="col-span-3">
                <Input
                  id="email"
                  type="email"
                  placeholder="user@example.com"
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Role
              </Label>
              <div className="col-span-3">
                <Select onValueChange={handleRoleChange} value={selectedRole || undefined}>
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
                {!selectedRole && (
                  <p className="text-red-500 text-sm mt-1">Role is required</p>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !selectedRole}>
              {isSubmitting ? 'Sending Invitation...' : 'Send Invitation'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};