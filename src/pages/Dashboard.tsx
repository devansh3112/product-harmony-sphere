import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import ViewConfig from '@/components/ViewConfig';
import { 
  Users, 
  Package, 
  Settings, 
  BarChart3, 
  ArrowUpRight, 
  Plus,
  UserPlus,
  Activity,
  TrendingUp,
  Clock,
  Search,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';

// Add TypeScript interfaces for our data structures
interface DashboardStats {
  totalProducts: number;
  totalUsers: number;
  pageViews: number;
  productCategories: number;
  categoryDistribution: CategoryStat[];
  recentActivity: ActivityItem[];
  searchAnalytics: SearchQuery[];
  performanceMetrics: PerformanceMetric[];
}

interface CategoryStat {
  name: string;
  count: number;
  percentage: number;
}

interface ActivityItem {
  id: number;
  type: 'product' | 'user' | 'security';
  action: string;
  item: string;
  user: string;
  time: string;
  created_at: string;
}

interface SearchQuery {
  query: string;
  count: number;
}

interface PerformanceMetric {
  label: string;
  value: string;
  percentage: number;
}

interface SecurityMetric {
  label: string;
  value: string;
  status: 'good' | 'warning' | 'error';
  percentage: number;
}

// Sample analytics data
const analyticsData = [
  { name: 'Jan', views: 4000, users: 2400 },
  { name: 'Feb', views: 3000, users: 1398 },
  { name: 'Mar', views: 2000, users: 9800 },
  { name: 'Apr', views: 2780, users: 3908 },
  { name: 'May', views: 1890, users: 4800 },
  { name: 'Jun', views: 2390, users: 3800 },
];

// Sample activity data
const activityData = [
  {
    id: 1,
    type: 'product',
    action: 'added',
    item: 'Carbon Black EDR',
    user: 'John Smith',
    time: '2 hours ago',
    icon: Plus,
  },
  {
    id: 2,
    type: 'user',
    action: 'modified',
    item: 'User Permissions',
    user: 'Sarah Johnson',
    time: '4 hours ago',
    icon: Settings,
  },
  {
    id: 3,
    type: 'security',
    action: 'alert',
    item: 'Unusual Access Pattern',
    user: 'System',
    time: '5 hours ago',
    icon: AlertCircle,
  },
];

const Dashboard = () => {
  const [internalViewConfig, setInternalViewConfig] = useState([
    { id: 'prod-details', label: 'Product Details', description: 'Full product specifications and details', enabled: true },
    { id: 'prod-pricing', label: 'Pricing Information', description: 'Detailed pricing and discount information', enabled: true },
    { id: 'prod-stats', label: 'Product Statistics', description: 'Usage and performance statistics', enabled: true },
    { id: 'prod-docs', label: 'Documentation', description: 'Technical documentation and guides', enabled: true },
    { id: 'prod-roadmap', label: 'Product Roadmap', description: 'Future development plans and timelines', enabled: true },
  ]);
  
  const [externalViewConfig, setExternalViewConfig] = useState([
    { id: 'prod-details', label: 'Product Details', description: 'Full product specifications and details', enabled: true },
    { id: 'prod-pricing', label: 'Pricing Information', description: 'Detailed pricing and discount information', enabled: false },
    { id: 'prod-stats', label: 'Product Statistics', description: 'Usage and performance statistics', enabled: false },
    { id: 'prod-docs', label: 'Documentation', description: 'Technical documentation and guides', enabled: true },
    { id: 'prod-roadmap', label: 'Product Roadmap', description: 'Future development plans and timelines', enabled: false },
  ]);
  
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    pageViews: 0,
    productCategories: 0,
    categoryDistribution: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const checkAccess = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('role')
          .eq('email', session.user.email)
          .single();
        
        if (profile?.role !== 'admin') {
          navigate('/unauthorized');
        }
      } else {
        navigate('/login');
      }
    };
    
    checkAccess();
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // First check if we can connect to Supabase
        const { error: connectionError } = await supabase
          .from('categories')
          .select('count');

        if (connectionError) {
          throw new Error('Could not connect to database. Please check your connection.');
        }

        // Fetch products with proper error handling
        const { data: products, error: productsError } = await supabase
          .from('products')
          .select('*');

        if (productsError) {
          console.error('Error fetching products:', productsError);
          throw productsError;
        }

        // Fetch users with proper error handling
        const { data: users, error: usersError } = await supabase
          .from('user_profiles')
          .select('*');

        if (usersError) {
          console.error('Error fetching users:', usersError);
          throw usersError;
        }

        // Calculate category distribution safely
        const categoryCount = products?.reduce((acc: Record<string, number>, product) => {
          const category = product.category || 'Uncategorized';
          acc[category] = (acc[category] || 0) + 1;
          return acc;
        }, {});

        const totalProducts = products?.length || 0;
        const categoryDistribution = Object.entries(categoryCount || {}).map(([name, count]) => ({
          name,
          count: Number(count),
          percentage: totalProducts > 0 ? Math.round((Number(count) / totalProducts) * 100) : 0
        }));

        setStats({
          totalProducts,
          totalUsers: users?.length || 0,
          pageViews: 0,
          productCategories: Object.keys(categoryCount || {}).length,
          categoryDistribution,
        });

        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err instanceof Error ? err.message : 'An error occurred while fetching data');
        setLoading(false);
      }
    };

    fetchDashboardData();
    
    // Set up real-time subscription for products
    const productSubscription = supabase
      .channel('products-channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => {
        console.log('Products table changed, refreshing data...');
        fetchDashboardData();
      })
      .subscribe();

    // Refresh dashboard data every 5 minutes
    const refreshInterval = setInterval(fetchDashboardData, 5 * 60 * 1000);

    return () => {
      productSubscription.unsubscribe();
      clearInterval(refreshInterval);
    };
  }, []);

  // Show error state if there's an error
  if (error) {
    return (
      <div className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl font-semibold text-red-600">Error Loading Dashboard</h2>
          <p className="mt-2 text-gray-600">{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        {/* Header section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-semibold">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-1">Real-time overview of your system</p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-2">
            <Button onClick={() => window.location.href = '/products/new'}>
              <Plus size={16} className="mr-1" />
              New Product
            </Button>
            <Button variant="outline" onClick={() => window.location.href = '/users/new'}>
              <UserPlus size={16} className="mr-1" />
              New User
            </Button>
          </div>
        </div>
        
        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {overviewCards.map((card, index) => (
            <Card key={index} className="overflow-hidden border-border/40">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-md bg-primary/10 text-primary">
                    <card.icon size={20} />
                  </div>
                  <ArrowUpRight size={16} className="text-primary animate-float" />
                </div>
                <CardTitle className="text-lg mt-2">{card.title}</CardTitle>
                <CardDescription>{card.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">
                  {loading ? (
                    <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
                  ) : (
                    stats[card.statKey]
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Product Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="border-border/40">
              <CardHeader>
              <CardTitle>Product Categories</CardTitle>
              <CardDescription>Distribution by category</CardDescription>
              </CardHeader>
              <CardContent>
              <div className="space-y-4">
                {loading ? (
                  Array(5).fill(0).map((_, i) => (
                    <div key={i} className="space-y-2">
                      <div className="animate-pulse bg-gray-200 h-4 w-full rounded"></div>
                      <div className="animate-pulse bg-gray-200 h-2 w-full rounded"></div>
                    </div>
                  ))
                ) : stats.categoryDistribution.length > 0 ? (
                  stats.categoryDistribution.map((category) => (
                    <div key={category.name} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{category.name}</span>
                        <span className="font-medium">{category.count}</span>
                      </div>
                      <Progress value={category.percentage} />
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground">No categories found</p>
                )}
                </div>
              </CardContent>
            </Card>
          
            <Card className="border-border/40">
              <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
              <CardDescription>Key product metrics</CardDescription>
              </CardHeader>
              <CardContent>
              <div className="space-y-4">
                {quickStats.map((stat) => (
                  <div key={stat.label} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="p-2 rounded-full bg-primary/10">
                        <stat.icon size={14} className="text-primary" />
                      </div>
                      <span className="text-sm">{stat.label}</span>
                    </div>
                    <span className="font-medium">
                      {loading ? (
                        <div className="animate-pulse bg-gray-200 h-4 w-12 rounded"></div>
                      ) : (
                        stat.getValue(stats)
                      )}
                    </span>
                  </div>
                ))}
              </div>
              </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
};

// Overview cards data
const overviewCards = [
  {
    icon: Package,
    title: 'Total Products',
    description: 'Active products in catalog',
    statKey: 'totalProducts',
  },
  {
    icon: Users,
    title: 'Total Users',
    description: 'Active user accounts',
    statKey: 'totalUsers',
  },
  {
    icon: Settings,
    title: 'Categories',
    description: 'Product categories',
    statKey: 'productCategories',
  },
];

// Quick stats data with dynamic values
const quickStats = [
  { 
    icon: Activity, 
    label: 'Active Products', 
    getValue: (stats) => `${stats.totalProducts} total`
  },
  { 
    icon: Package, 
    label: 'Categories', 
    getValue: (stats) => `${stats.productCategories} total`
  },
  { 
    icon: Users, 
    label: 'Active Users', 
    getValue: (stats) => `${stats.totalUsers} users`
  },
];

export default Dashboard;
