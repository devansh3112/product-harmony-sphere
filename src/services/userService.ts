
import { supabase } from '@/lib/supabase';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'internal' | 'external';
  isActive: boolean;
  created_at?: string;
  password?: string;
}

export const fetchUsers = async (): Promise<UserProfile[]> => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .order('name');
    
  if (error) {
    throw error;
  }
  
  return data || [];
};

export const deleteUser = async (id: string): Promise<{ success: boolean }> => {
  const { error: profileError } = await supabase
    .from('user_profiles')
    .delete()
    .eq('id', id);
    
  if (profileError) {
    throw profileError;
  }
  
  return { success: true };
};

export const saveUser = async (userData: UserProfile): Promise<UserProfile> => {
  const { id, password, ...userDataWithoutId } = userData;
  
  if (id) {
    const { data, error } = await supabase
      .from('user_profiles')
      .update(userDataWithoutId)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  } else {
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: userData.email,
      password: password || '',
      email_confirm: true,
    });
    
    if (authError) throw authError;
    
    const { data, error } = await supabase
      .from('user_profiles')
      .insert([userDataWithoutId])
      .select()
      .single();
      
    if (error) throw error;
    return data;
  }
};
