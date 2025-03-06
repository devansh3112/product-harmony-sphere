
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { UserPlus } from 'lucide-react';
import UserList from '@/components/users/UserList';
import UserFilters from '@/components/users/UserFilters';
import UserDialog from '@/components/users/UserDialog';
import { fetchUsers, deleteUser, saveUser, UserProfile } from '@/services/userService';

const Users = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const queryClient = useQueryClient();
  
  const { data: users = [], isLoading: isFetchingUsers } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers
  });
  
  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      toast.success('User deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error: any) => {
      toast.error(`Failed to delete user: ${error.message}`);
      console.error('Error deleting user:', error);
    }
  });
  
  const saveUserMutation = useMutation({
    mutationFn: saveUser,
    onSuccess: () => {
      toast.success(currentUser ? 'User updated successfully' : 'User created successfully');
      setIsDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error: any) => {
      toast.error(`Failed to save user: ${error.message}`);
      console.error('Error saving user:', error);
    }
  });
  
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && user.isActive) || 
      (statusFilter === 'inactive' && !user.isActive);
    
    return matchesSearch && matchesRole && matchesStatus;
  });
  
  const handleCreateUser = () => {
    setCurrentUser(null);
    setIsDialogOpen(true);
  };
  
  const handleEditUser = (user: UserProfile) => {
    const userWithoutPassword = { ...user, password: '' };
    setCurrentUser(userWithoutPassword);
    setIsDialogOpen(true);
  };
  
  const handleDeleteUser = (id: string) => {
    deleteUserMutation.mutate(id);
  };
  
  const handleSubmit = (data: any) => {
    const userData = currentUser ? { ...data, id: currentUser.id } : data;
    saveUserMutation.mutate(userData);
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };
  
  const clearFilters = () => {
    setSearchTerm('');
    setRoleFilter('all');
    setStatusFilter('all');
  };
  
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold">Users</h1>
          <p className="text-muted-foreground mt-1">
            Manage user accounts and permissions
          </p>
        </div>
        <Button 
          onClick={handleCreateUser}
          className="mt-4 sm:mt-0"
        >
          <UserPlus size={16} className="mr-2" />
          New User
        </Button>
      </div>
      
      <UserFilters
        searchTerm={searchTerm}
        roleFilter={roleFilter}
        statusFilter={statusFilter}
        onSearchChange={setSearchTerm}
        onRoleFilterChange={setRoleFilter}
        onStatusFilterChange={setStatusFilter}
        onClearFilters={clearFilters}
      />
      
      <div className="bg-white/80 backdrop-blur-sm border border-border/40 rounded-lg shadow-sm overflow-hidden">
        <UserList
          users={filteredUsers}
          isLoading={isFetchingUsers}
          onEdit={handleEditUser}
          onDelete={handleDeleteUser}
          formatDate={formatDate}
        />
      </div>
      
      <UserDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        currentUser={currentUser}
        onSubmit={handleSubmit}
        isLoading={saveUserMutation.isPending}
      />
    </div>
  );
};

export default Users;
