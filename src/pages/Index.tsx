import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, ExternalLink } from 'lucide-react';
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
      <div className="min-h-screen flex items-center justify-center bg-[#230d3a]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-[#E0A4C4] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-[#E0A4C4]">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#230d3a]">
        <div className="max-w-md w-full bg-black/30 backdrop-blur-md p-8 rounded-xl shadow-2xl border border-red-500/20">
          <h2 className="text-xl font-bold text-red-400 mb-4 text-center">Error Loading Page</h2>
          <p className="text-white/80 mb-6 text-center">{error}</p>
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
    <div className="h-screen fixed inset-0 overflow-hidden">
      <style>
        {`
          @keyframes slideInFromLeft {
            from {
              opacity: 0;
              transform: translateX(-20px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
        `}
      </style>
      {/* Banner Container - removed additional height that causes scrolling */}
      <div className="w-full h-full relative">
        {/* Gradient Background */}
        <div 
          className="w-full h-full"
          style={{
            background: 'linear-gradient(135deg, #9c27b0 0%, #673ab7 50%, #2196f3 100%)',
            position: 'relative'
          }}
        >
          {/* Diagonal Divide */}
          <div 
            className="absolute top-0 right-0 w-1/2 h-full bg-[#1a0933]/80"
            style={{
              clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
              transform: 'skewX(-15deg) translateX(10%)'
            }}
          ></div>
          
          {/* Light Dots SVG - Replace with the security image */}
          <div 
            className="absolute right-0 top-0 w-1/2 h-full z-[1]"
            style={{
              backgroundImage: 'url("https://www.westconcomstor.com/content/dam/wcgcom/Global/CorpSite/main/Check-point-300766742-data-security.jpeg")',
              backgroundSize: 'cover',
              backgroundPosition: 'center 80%',
              opacity: '0.7',
              mixBlendMode: 'lighten'
            }}
          ></div>
          
          {/* Title Container */}
          <div className="absolute top-1/2 left-[30px] transform -translate-y-1/2 z-[2] px-4 sm:px-6 lg:px-8 w-full max-w-[90%] md:max-w-[80%] lg:max-w-[60%]">
            {/* Title with white background */}
            <div className="inline-block" style={{ backgroundColor: 'white', padding: '4px 8px', marginBottom: '12px' }}>
              <h1 
                style={{
                  backgroundImage: 'linear-gradient(135deg, #9c27b0 0%, #673ab7 50%, #2196f3 100%)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent',
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: "clamp(40px, 6vw, 75.89px)",
                  fontWeight: "bold",
                  lineHeight: 1,
                  margin: 0,
                  padding: 0,
                  display: 'block',
                  whiteSpace: 'nowrap'
                }}
              >
                Broadcom
              </h1>
            </div>
            
            <div className="block w-full"></div>
            
            {/* Product Portfolio with white background */}
            <div className="inline-block" style={{ backgroundColor: 'white', padding: '4px 8px', marginBottom: '12px' }}>
              <h2 
                style={{
                  backgroundImage: 'linear-gradient(135deg, #9c27b0 0%, #673ab7 50%, #2196f3 100%)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent',
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: "clamp(40px, 6vw, 75.89px)",
                  fontWeight: "bold",
                  lineHeight: 1,
                  margin: 0,
                  padding: 0,
                  display: 'block',
                  whiteSpace: 'nowrap'
                }}
              >
                Product Portfolio
              </h2>
            </div>
            
            <div className="block w-full"></div>
            
            {/* New Subtitle - flowing across the gradient slash */}
            <div className="mt-4 sm:mt-6" style={{ 
                position: "relative",
                maxWidth: "100%",
                marginLeft: "0px",
                width: "100%"
              }}>
              <h3 
                className="text-white"
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: "clamp(16px, 2vw, 19px)",
                  fontWeight: 400,
                  lineHeight: 1.5,
                  textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                  textAlign: 'left',
                  paddingLeft: "5px",
                  width: "100%",
                  fontStyle: 'italic'
                }}
              >
                Empowering Businesses with Cutting-Edge Technology and Seamless Connectivity <br />Solutions for a Smarter Future
              </h3>
              
              {/* Button positioned below the subtitle */}
              <div className="mt-6 sm:mt-8">
                <Button 
                  size="lg"
                  onClick={handleNavigateToProducts}
                  className="bg-[#673ab7] hover:bg-[#5e35b1] text-white px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg shadow-lg transition-all duration-300 transform hover:translate-x-2 hover:shadow-xl w-full sm:w-auto"
                  style={{
                    borderRadius: '0px',
                    animation: 'slideInFromLeft 0.5s ease-out'
                  }}
                >
                  View Products
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
