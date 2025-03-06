
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import UserForm from '@/components/forms/UserForm';
import { UserProfile } from '@/services/userService';

interface UserDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentUser: UserProfile | null;
  onSubmit: (data: any) => void;
  isLoading: boolean;
}

const UserDialog: React.FC<UserDialogProps> = ({
  isOpen,
  onOpenChange,
  currentUser,
  onSubmit,
  isLoading,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {currentUser ? 'Edit User' : 'Create New User'}
          </DialogTitle>
          <DialogDescription>
            {currentUser
              ? 'Update the user details and permissions.'
              : 'Fill in the details to create a new user.'}
          </DialogDescription>
        </DialogHeader>
        
        <UserForm 
          initialData={currentUser}
          onSubmit={onSubmit}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
};

export default UserDialog;
