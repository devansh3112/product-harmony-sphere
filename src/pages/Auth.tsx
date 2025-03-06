
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AuthForm from '@/components/AuthForm';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const navigate = useNavigate();
  
  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate('/dashboard');
      }
    };
    
    checkSession();
  }, [navigate]);
  
  const handleLogin = async (data: any) => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });
      
      if (error) throw error;
      
      // Get user profile after login
      const { data: userProfile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('email', data.email)
        .single();
        
      if (!profileError && userProfile) {
        // Store user profile data in localStorage for easy access
        localStorage.setItem('user', JSON.stringify(userProfile));
      }
      
      toast.success('Successfully signed in');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Failed to sign in');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRegister = async (data: any) => {
    setIsLoading(true);
    
    try {
      // Register with Supabase Auth
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
          },
        },
      });
      
      if (error) throw error;
      
      // Create a profile in our profiles table
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert([
          {
            email: data.email,
            name: data.name,
            role: 'external', // Default role for new registrations
            isActive: true,
          },
        ]);
        
      if (profileError) throw profileError;
      
      toast.success('Account created successfully. You can now sign in.');
      setActiveTab('login');
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12 relative">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      </div>
      
      <div className="w-full max-w-md z-10">
        <div className="text-center mb-8 animate-fade-in">
          <div className="h-12 w-12 rounded-xl bg-primary mx-auto flex items-center justify-center mb-4">
            <span className="text-primary-foreground font-bold text-lg">P</span>
          </div>
          <h1 className="text-3xl font-semibold">Product Sphere</h1>
          <p className="text-muted-foreground mt-2">
            Portfolio Management System
          </p>
        </div>
        
        <div className="bg-white/80 backdrop-blur-md shadow-lg rounded-xl border border-border/50 overflow-hidden animate-scale-in">
          <div className="p-6">
            <Tabs 
              defaultValue="login" 
              value={activeTab} 
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="register">Create Account</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="mt-0">
                <AuthForm 
                  type="login" 
                  onSubmit={handleLogin} 
                  isLoading={isLoading && activeTab === 'login'} 
                />
              </TabsContent>
              
              <TabsContent value="register" className="mt-0">
                <AuthForm 
                  type="register" 
                  onSubmit={handleRegister} 
                  isLoading={isLoading && activeTab === 'register'} 
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
        
        <p className="text-center text-sm text-muted-foreground mt-6">
          By using this service, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default Auth;
