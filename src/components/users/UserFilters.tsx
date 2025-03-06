
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface UserFiltersProps {
  searchTerm: string;
  roleFilter: string;
  statusFilter: string;
  onSearchChange: (value: string) => void;
  onRoleFilterChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
  onClearFilters: () => void;
}

const UserFilters: React.FC<UserFiltersProps> = ({
  searchTerm,
  roleFilter,
  statusFilter,
  onSearchChange,
  onRoleFilterChange,
  onStatusFilterChange,
  onClearFilters,
}) => {
  return (
    <div className="mb-8 p-4 bg-white/60 backdrop-blur-sm border border-border/40 rounded-lg shadow-sm">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-2.5 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-4 sm:w-auto w-full">
          <Select value={roleFilter} onValueChange={onRoleFilterChange}>
            <SelectTrigger className="sm:w-40 w-full">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="internal">Internal</SelectItem>
              <SelectItem value="external">External</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={statusFilter} onValueChange={onStatusFilterChange}>
            <SelectTrigger className="sm:w-40 w-full">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {(searchTerm || roleFilter !== 'all' || statusFilter !== 'all') && (
        <div className="mt-4 flex flex-wrap gap-2">
          {searchTerm && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Search: {searchTerm}
              <button 
                onClick={() => onSearchChange('')}
                className="ml-1 text-muted-foreground hover:text-foreground"
              >
                ×
              </button>
            </Badge>
          )}
          
          {roleFilter !== 'all' && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Role: {roleFilter}
              <button 
                onClick={() => onRoleFilterChange('all')}
                className="ml-1 text-muted-foreground hover:text-foreground"
              >
                ×
              </button>
            </Badge>
          )}
          
          {statusFilter !== 'all' && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Status: {statusFilter === 'active' ? 'Active' : 'Inactive'}
              <button 
                onClick={() => onStatusFilterChange('all')}
                className="ml-1 text-muted-foreground hover:text-foreground"
              >
                ×
              </button>
            </Badge>
          )}
          
          {(searchTerm || roleFilter !== 'all' || statusFilter !== 'all') && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClearFilters}
              className="h-7 text-xs"
            >
              Clear all
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default UserFilters;
