import React, { useState, useEffect, useCallback } from 'react';
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
  LogOut,
  Search
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import SearchCommand from '@/components/SearchCommand';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Navigation items - base items that are always shown
  const baseNavItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Products', path: '/products', icon: Package }
  ];
  
  // Dashboard item that requires authentication
  const dashboardItem = { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard };
  
  // Get the appropriate nav items based on authentication status
  const getNavItems = () => {
    if (isAuthenticated) {
      return [...baseNavItems.slice(0, 1), dashboardItem, ...baseNavItems.slice(1)];
    }
    return baseNavItems;
  };
  
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
  
  // Memoize the search toggle function to prevent recreating it on each render
  const toggleSearch = useCallback((open: boolean) => {
    setSearchOpen(open);
  }, []);
  
  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip if the search dialog is already open
      if (searchOpen) return;
      
      // Open search with Ctrl+K or Cmd+K (Mac)
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        toggleSearch(true);
      }
      
      // Also open with / key when not in an input field
      if (e.key === '/' && 
          document.activeElement?.tagName !== 'INPUT' && 
          document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        toggleSearch(true);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchOpen, toggleSearch]);
  
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };
  
  // Get the current nav items
  const navItems = getNavItems();
  
  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between relative">
          {/* Logo on the left */}
          <Link to="/" className="flex items-center">
            <div className="h-10 w-auto flex items-center justify-center">
              <img 
                src="/images__2_-removebg-preview.png" 
                alt="Broadcom Logo" 
                className="h-10 w-auto object-contain"
              />
            </div>
          </Link>
          
          {/* Desktop Navigation - centered */}
          <nav className="hidden md:flex items-center space-x-1 absolute left-1/2 transform -translate-x-1/2">
            {navItems.map((item) => (
              <Link 
                key={item.name} 
                to={item.path}
                className={cn(
                  "px-3 py-2 rounded-md flex items-center space-x-2 transition-colors text-slate-600",
                  location.pathname === item.path 
                    ? "bg-slate-100 text-[#5C3E79] font-medium" 
                    : "hover:text-[#5C3E79] hover:bg-slate-50"
                )}
              >
                <item.icon size={18} />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
          
          {/* Search button, User button & Mobile toggle - on the right */}
          <div className="flex items-center space-x-2">
            {/* Google-style search button */}
            <Button
              variant="outline"
              onClick={() => toggleSearch(true)}
              className="hidden sm:flex items-center h-10 px-4 bg-white border border-slate-200 rounded-full hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
            >
              <Search size={18} className="text-slate-500 mr-2" />
              <span className="text-slate-600 font-normal">Search products...</span>
              <div className="ml-6 flex items-center border rounded border-slate-200 bg-slate-100 px-1.5 py-0.5 text-xs text-slate-500">
                <span className="mr-0.5">⌘</span>K
              </div>
            </Button>
            
            {/* Mobile search button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => toggleSearch(true)}
              className="sm:hidden text-slate-600 hover:text-[#5C3E79] hover:bg-slate-100"
            >
              <Search size={20} />
            </Button>
            
            {isAuthenticated ? (
              <>
                <Button variant="ghost" size="icon" className="rounded-full text-slate-600 hover:text-[#5C3E79] hover:bg-slate-100">
                  <User size={20} />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleSignOut}
                  title="Sign Out"
                  className="text-slate-600 hover:text-[#5C3E79] hover:bg-slate-100"
                >
                  <LogOut size={20} />
                </Button>
              </>
            ) : (
              <></>
            )}
            
            {userRole === 'internal' && (
              <span className="bg-[#E0A4C4]/20 text-[#5C3E79] px-3 py-1 rounded-full text-sm">
                Internal Access
              </span>
            )}
            
            {userRole === 'admin' && (
              <span className="bg-[#B86CA5]/20 text-[#5C3E79] px-3 py-1 rounded-full text-sm">
                Admin Access
              </span>
            )}
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden text-slate-600 hover:text-[#5C3E79] hover:bg-slate-100" 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>
        
        {/* Mobile menu */}
        <div 
          className={cn(
            "fixed inset-0 bg-white z-40 transition-transform transform duration-300 ease-in-out pt-16 md:hidden",
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <nav className="container mx-auto px-4 py-6 flex flex-col space-y-2">
            <Button
              variant="outline"
              onClick={() => {
                toggleSearch(true);
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center justify-start mb-4 h-12 px-4 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all"
            >
              <Search size={18} className="text-slate-500 mr-2" />
              <span className="text-slate-600 font-normal">Search products...</span>
            </Button>
            
            {navItems.map((item) => (
              <Link 
                key={item.name} 
                to={item.path}
                className={cn(
                  "p-3 rounded-md flex items-center justify-between transition-colors",
                  location.pathname === item.path 
                    ? "bg-slate-100 text-[#5C3E79] font-medium" 
                    : "text-slate-600 hover:text-[#5C3E79] hover:bg-slate-50"
                )}
              >
                <div className="flex items-center space-x-3">
                  <item.icon size={20} />
                  <span>{item.name}</span>
                </div>
                <ChevronRight size={18} className="text-slate-400" />
              </Link>
            ))}
            
            {isAuthenticated && (
              <button
                onClick={handleSignOut}
                className="p-3 rounded-md flex items-center justify-between transition-colors text-slate-600 hover:text-[#5C3E79] hover:bg-slate-50 w-full"
              >
                <div className="flex items-center space-x-3">
                  <LogOut size={20} />
                  <span>Sign Out</span>
                </div>
                <ChevronRight size={18} className="text-slate-400" />
              </button>
            )}
          </nav>
        </div>
      </header>
      
      {/* Search Command Dialog */}
      <SearchCommand open={searchOpen} onOpenChange={toggleSearch} />
    </>
  );
};

export default Navbar;
