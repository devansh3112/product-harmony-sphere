
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from 'react';

import Layout from "./components/Layout";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Categories from "./pages/Categories";
import Users from "./pages/Users";
import Settings from "./pages/Settings";
import ProductDetails from "./components/ProductDetails";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  const [isError, setIsError] = useState(false);
  const [errorInfo, setErrorInfo] = useState<string>("");

  useEffect(() => {
    // Add global error handler
    const handleError = (event: ErrorEvent) => {
      console.error("Global error caught:", event.error);
      setIsError(true);
      setErrorInfo(event.error?.message || "An unexpected error occurred");
    };

    window.addEventListener('error', handleError);
    
    return () => {
      window.removeEventListener('error', handleError);
    };
  }, []);

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-red-50">
        <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-lg border border-red-200">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
          <p className="text-gray-700 mb-4">{errorInfo || "An unexpected error occurred in the application."}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary/90"
          >
            Reload Application
          </button>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/new" element={<ProductDetails />} />
              <Route path="/products/:id" element={<ProductDetails />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/users" element={<Users />} />
              <Route path="/settings" element={<Settings />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
