
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

// Define the base user schema
const baseUserSchema = {
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  role: z.enum(['admin', 'internal', 'external']),
  isActive: z.boolean().default(true),
};

// For new users, require password
const newUserSchema = z.object({
  ...baseUserSchema,
  password: z.string().min(8, { message: 'Password must be at least 8 characters' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' }),
});

// For existing users, password is optional
const existingUserSchema = z.object({
  ...baseUserSchema,
  password: z.string()
    .refine(
      (val) => val === '' || (val.length >= 8 && /[A-Z]/.test(val) && /[a-z]/.test(val) && /[0-9]/.test(val)),
      {
        message: 'If provided, password must be at least 8 characters with uppercase, lowercase, and numbers',
      }
    )
    .optional(),
});

type UserFormValues = z.infer<typeof newUserSchema>;

interface UserFormProps {
  initialData?: Partial<UserFormValues>;
  onSubmit: (data: UserFormValues) => void;
  isLoading?: boolean;
}

const UserForm = ({ initialData, onSubmit, isLoading = false }: UserFormProps) => {
  const isEditMode = Boolean(initialData?.email);
  
  const form = useForm<UserFormValues>({
    resolver: zodResolver(isEditMode ? existingUserSchema : newUserSchema),
    defaultValues: {
      name: initialData?.name || '',
      email: initialData?.email || '',
      password: initialData?.password || '',
      role: initialData?.role || 'internal',
      isActive: initialData?.isActive !== undefined ? initialData.isActive : true,
    },
  });

  // Update form schema when editing mode changes
  useEffect(() => {
    if (isEditMode) {
      form.setValue('password', '');
    }
  }, [isEditMode, form]);

  const handleSubmit = async (data: UserFormValues) => {
    // For existing users with empty password, remove it from the payload
    if (isEditMode && data.password === '') {
      const { password, ...dataWithoutPassword } = data;
      onSubmit(dataWithoutPassword as UserFormValues);
    } else {
      onSubmit(data);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter user's name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter user's email address" 
                  type="email" 
                  {...field} 
                  disabled={isEditMode} // Can't change email for existing users
                />
              </FormControl>
              <FormDescription>
                {isEditMode 
                  ? "Email addresses cannot be changed after user creation." 
                  : "@westcon.com and @broadcom.com domains will automatically be assigned internal role permissions."}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{isEditMode ? 'New Password (leave blank to keep current)' : 'Password'}</FormLabel>
              <FormControl>
                <Input 
                  placeholder={isEditMode ? "Enter new password (optional)" : "Create a password"} 
                  type="password" 
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                Password must be at least 8 characters with uppercase, lowercase, and numbers.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>User Role</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="internal">Internal User</SelectItem>
                  <SelectItem value="external">External User</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Active User</FormLabel>
                <FormDescription>
                  Inactive users cannot log in to the system.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : initialData?.name ? 'Update User' : 'Create User'}
        </Button>
      </form>
    </Form>
  );
};

export default UserForm;
