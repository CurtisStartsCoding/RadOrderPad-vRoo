/**
 * UserFilters Component
 * 
 * Filters for the user table in the Super Admin feature.
 */

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  UserFilterParams,
  UserRole
} from '../../types';

interface UserFiltersProps {
  filters: UserFilterParams;
  onUpdateFilters: (filters: UserFilterParams) => void;
  onResetFilters: () => void;
}

export const UserFilters: React.FC<UserFiltersProps> = ({
  filters,
  onUpdateFilters,
  onResetFilters
}) => {
  // Local state for form values
  const [email, setEmail] = useState(filters.email || '');
  const [name, setName] = useState(filters.name || '');
  const [organizationId, setOrganizationId] = useState<number | undefined>(filters.organizationId);
  const [role, setRole] = useState<UserRole | undefined>(filters.role);
  const [isActive, setIsActive] = useState<boolean | undefined>(filters.isActive);
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newFilters: UserFilterParams = {
      email: email || undefined,
      name: name || undefined,
      organizationId,
      role,
      isActive
    };
    
    onUpdateFilters(newFilters);
  };
  
  // Handle reset
  const handleReset = () => {
    setEmail('');
    setName('');
    setOrganizationId(undefined);
    setRole(undefined);
    setIsActive(undefined);
    onResetFilters();
  };
  
  return (
    <div className="bg-white p-4 rounded-md border mb-4">
      <h3 className="text-lg font-medium mb-4">Filters</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Email Filter */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Search by email"
            />
          </div>
          
          {/* Name Filter */}
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Search by name"
            />
          </div>
          
          {/* Role Filter */}
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select
              value={role}
              onValueChange={(value) => setRole(value as UserRole)}
            >
              <SelectTrigger id="role">
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={UserRole.SUPER_ADMIN}>Super Admin</SelectItem>
                <SelectItem value={UserRole.ADMIN_REFERRING}>Referring Admin</SelectItem>
                <SelectItem value={UserRole.ADMIN_RADIOLOGY}>Radiology Admin</SelectItem>
                <SelectItem value={UserRole.PHYSICIAN}>Physician</SelectItem>
                <SelectItem value={UserRole.RADIOLOGIST}>Radiologist</SelectItem>
                <SelectItem value={UserRole.ADMIN_STAFF}>Admin Staff</SelectItem>
                <SelectItem value={UserRole.SCHEDULER}>Scheduler</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Status Filter */}
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={isActive !== undefined ? isActive.toString() : undefined}
              onValueChange={(value) => {
                if (value === 'true') setIsActive(true);
                else if (value === 'false') setIsActive(false);
                else setIsActive(undefined);
              }}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Active</SelectItem>
                <SelectItem value="false">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={handleReset}>
            Reset
          </Button>
          <Button type="submit">Apply Filters</Button>
        </div>
      </form>
    </div>
  );
};