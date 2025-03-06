
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ViewConfig from '@/components/ViewConfig';
import { 
  Users, 
  Package, 
  Settings, 
  BarChart3, 
  ArrowUpRight, 
  Plus,
  UserPlus 
} from 'lucide-react';

const Dashboard = () => {
  // Sample data for view configuration
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
  
  const handleSaveViewConfig = (newInternalConfig: any[], newExternalConfig: any[]) => {
    setInternalViewConfig(newInternalConfig);
    setExternalViewConfig(newExternalConfig);
  };
  
  return (
    <div className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-semibold">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-1">Manage your products, users, and view settings</p>
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
                <div className="text-2xl font-semibold">{card.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Dashboard Tabs */}
        <Tabs defaultValue="view-config" className="mb-8">
          <TabsList className="mb-6">
            <TabsTrigger value="view-config">View Configuration</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="view-config" className="p-0 border-none">
            <ViewConfig 
              internalConfig={internalViewConfig}
              externalConfig={externalViewConfig}
              onSave={handleSaveViewConfig}
            />
          </TabsContent>
          
          <TabsContent value="products" className="p-0 border-none">
            <Card className="border-border/40">
              <CardHeader>
                <CardTitle>Product Management</CardTitle>
                <CardDescription>View and manage your product catalog</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center py-12">
                  Product management interface will be displayed here.
                  <br />
                  Navigate to the Products page for full management capabilities.
                </p>
                <div className="flex justify-center">
                  <Button onClick={() => window.location.href = '/products'}>
                    Go to Products
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="users" className="p-0 border-none">
            <Card className="border-border/40">
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Control user access and permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center py-12">
                  User management interface will be displayed here.
                  <br />
                  This includes adding, editing, and managing user permissions.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="analytics" className="p-0 border-none">
            <Card className="border-border/40">
              <CardHeader>
                <CardTitle>Analytics Dashboard</CardTitle>
                <CardDescription>View product and user statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center py-12">
                  Analytics dashboard will be displayed here.
                  <br />
                  Including charts, metrics, and key performance indicators.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
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
    value: '24',
  },
  {
    icon: Users,
    title: 'Total Users',
    description: 'Active user accounts',
    value: '156',
  },
  {
    icon: BarChart3,
    title: 'Page Views',
    description: 'Last 30 days',
    value: '2.4K',
  },
  {
    icon: Settings,
    title: 'View Configs',
    description: 'Active view configurations',
    value: '2',
  },
];

export default Dashboard;
