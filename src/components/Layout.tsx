import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const isAuthPage = location.pathname === '/auth';
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        
        // Only redirect if authenticated and on auth page
        if (data.session && isAuthPage) {
          // Redirect to dashboard if authenticated and on auth page
          navigate('/dashboard');
        }
      } catch (error) {
        console.error('Auth check error:', error);
        // Don't redirect on error, just show the current page
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
    
    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      // Only redirect when signed in and on auth page
      if (event === 'SIGNED_IN' && isAuthPage) {
        navigate('/dashboard');
      }
    });
    
    return () => {
      if (authListener?.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, [navigate, isAuthPage]);
  
  // Show loading state
  if (isLoading && isAuthPage) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16">
        {children}
      </main>
    </div>
  );
};

export default Layout;
