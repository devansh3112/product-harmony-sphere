import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

const Index = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        console.log('Checking authentication status...');
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth check error:', error);
          setError(error.message);
          toast.error('Authentication check failed');
          return;
        }
        
        console.log('Auth session data:', data);
        setIsAuthenticated(!!data.session);
      } catch (err) {
        console.error('Unexpected error during auth check:', err);
        setError('Failed to check authentication status');
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
    
    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, !!session);
      setIsAuthenticated(!!session);
    });
    
    return () => {
      if (authListener?.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);
  
  const handleNavigateToProducts = () => {
    console.log('Navigating to products page...');
    navigate('/products');
  };

  const handleNavigateToAuth = () => {
    console.log('Navigating to auth page...');
    navigate('/auth');
  };
  
  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading application...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-red-50 p-6 rounded-lg shadow-lg border border-red-200">
          <h2 className="text-xl font-bold text-red-600 mb-4">Error Loading Page</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            variant="destructive"
            className="w-full"
          >
            Reload Page
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-4 py-16 md:py-24 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        </div>
        
        <div className="max-w-4xl z-10 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Broadcom Product Portfolio
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Explore our comprehensive catalog of products, features, and solutions designed to meet your business needs.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="text-md px-8"
              onClick={handleNavigateToProducts}
            >
              View Products
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            {!isAuthenticated && (
              <Button 
                variant="outline" 
                size="lg" 
                className="text-md"
                onClick={handleNavigateToAuth}
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
