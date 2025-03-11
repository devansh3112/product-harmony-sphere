import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  LayoutDashboard, 
  Package, 
  Settings, 
  User, 
  Menu, 
  X,
  ChevronRight,
  LogOut 
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Navigation items
  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Products', path: '/products', icon: Package }
    // { name: 'Settings', path: '/settings', icon: Settings },
  ];
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    // Close mobile menu when route changes
    setIsMobileMenuOpen(false);
  }, [location]);
  
  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setIsAuthenticated(!!data.session);
    };
    
    checkAuth();
    
    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });
    
    return () => {
      if (authListener?.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);
  
  useEffect(() => {
    const checkRole = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('role')
          .eq('email', session.user.email)
          .single();
        
        setUserRole(profile?.role || null);
      }
    };
    checkRole();
  }, []);
  
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };
  
  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled 
          ? "bg-white/80 backdrop-blur-md border-b border-border shadow-sm py-3" 
          : "bg-transparent py-5"
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-md flex items-center justify-center">
            <img 
              src="/images__1_-removebg-preview.png" 
              alt="Westcon-Comstor Logo" 
              className="h-8 w-8 object-contain"
            />
          </div>
          <span className="font-medium text-lg hidden sm:inline-block">Westcon-Comstor</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => (
            <Link 
              key={item.name} 
              to={item.path}
              className={cn(
                "px-3 py-2 rounded-md flex items-center space-x-2 transition-colors",
                location.pathname === item.path 
                  ? "bg-secondary text-foreground" 
                  : "text-foreground/70 hover:text-foreground hover:bg-secondary/50"
              )}
            >
              <item.icon size={18} />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
        
        {/* User button & Mobile toggle */}
        <div className="flex items-center space-x-2">
          {isAuthenticated ? (
            <>
              <Button variant="ghost" size="icon" className="rounded-full">
                <User size={20} />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleSignOut}
                title="Sign Out"
              >
                <LogOut size={20} />
              </Button>
            </>
          ) : (
            <Button 
              variant="ghost" 
              onClick={() => navigate('/auth')}
            >
              Sign In
            </Button>
          )}
          
          {userRole === 'internal' && (
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
              Internal Access
            </span>
          )}
          
          {userRole === 'admin' && (
            <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full">
              Admin Access
            </span>
          )}
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div 
        className={cn(
          "fixed inset-0 bg-background z-40 transition-transform transform duration-300 ease-in-out pt-16 md:hidden",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <nav className="container mx-auto px-4 py-6 flex flex-col space-y-2">
          {navItems.map((item) => (
            <Link 
              key={item.name} 
              to={item.path}
              className={cn(
                "p-3 rounded-md flex items-center justify-between transition-colors",
                location.pathname === item.path 
                  ? "bg-secondary text-foreground font-medium" 
                  : "text-foreground/70 hover:text-foreground hover:bg-secondary/50"
              )}
            >
              <div className="flex items-center space-x-3">
                <item.icon size={20} />
                <span>{item.name}</span>
              </div>
              <ChevronRight size={18} className="text-foreground/30" />
            </Link>
          ))}
          
          {isAuthenticated && (
            <button
              onClick={handleSignOut}
              className="p-3 rounded-md flex items-center justify-between transition-colors text-foreground/70 hover:text-foreground hover:bg-secondary/50 w-full"
            >
              <div className="flex items-center space-x-3">
                <LogOut size={20} />
                <span>Sign Out</span>
              </div>
              <ChevronRight size={18} className="text-foreground/30" />
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
