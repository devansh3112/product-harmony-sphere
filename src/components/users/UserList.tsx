
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { UserProfile } from '@/services/userService';

interface UserListProps {
  users: UserProfile[];
  isLoading: boolean;
  onEdit: (user: UserProfile) => void;
  onDelete: (id: string) => void;
  formatDate: (dateString: string) => string;
}

const UserList: React.FC<UserListProps> = ({
  users,
  isLoading,
  onEdit,
  onDelete,
  formatDate,
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-8">
              Loading users...
            </TableCell>
          </TableRow>
        ) : users.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-8">
              No users found matching your criteria.
            </TableCell>
          </TableRow>
        ) : (
          users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Badge variant={
                  user.role === 'admin' ? 'default' : 
                  user.role === 'internal' ? 'secondary' : 
                  'outline'
                }>
                  {user.role}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={user.isActive ? "secondary" : "destructive"}>
                  {user.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </TableCell>
              <TableCell>{user.created_at ? formatDate(user.created_at) : '-'}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => onEdit(user)}
                  >
                    <Pencil size={14} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => onDelete(user.id)}
                    disabled={user.role === 'admin'}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default UserList;
