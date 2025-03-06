
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
        
        if (!data.session && !isAuthPage) {
          // Redirect to auth page if not authenticated and not already on auth page
          navigate('/auth');
        } else if (data.session && isAuthPage) {
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
      if (event === 'SIGNED_OUT' && !isAuthPage) {
        navigate('/auth');
      } else if (event === 'SIGNED_IN' && isAuthPage) {
        navigate('/dashboard');
      }
    });
    
    return () => {
      if (authListener?.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, [navigate, isAuthPage, location.pathname]);
  
  if (isLoading && !isAuthPage) {
    // Show a loading state while checking authentication
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {!isAuthPage && <Navbar />}
      <main className="flex-1 w-full max-w-[1920px] mx-auto">
        <div className="h-full w-full animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
