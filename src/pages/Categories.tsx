
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import CategoryForm from '@/components/forms/CategoryForm';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Pencil, Plus, Trash2 } from 'lucide-react';

// Temporary mock data - replace with actual API call
const fetchCategories = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return [
    {
      id: '1',
      title: 'Network Security',
      description: 'Products focused on securing networks and preventing unauthorized access.',
      icon: 'shield'
    },
    {
      id: '2',
      title: 'Cloud Solutions',
      description: 'Cloud-based products and services for scalable and flexible deployments.',
      icon: 'cloud'
    },
    {
      id: '3',
      title: 'Data Management',
      description: 'Solutions for managing, storing, and analyzing large amounts of data.',
      icon: 'database'
    }
  ];
};

const Categories = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<any>(null);
  
  const { data: categories = [], refetch, isLoading: isFetchingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories
  });
  
  const handleCreateCategory = () => {
    setCurrentCategory(null);
    setIsDialogOpen(true);
  };
  
  const handleEditCategory = (category: any) => {
    setCurrentCategory(category);
    setIsDialogOpen(true);
  };
  
  const handleDeleteCategory = async (id: string) => {
    try {
      // Simulate API call
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock success response
      toast.success('Category deleted successfully');
      refetch();
    } catch (error) {
      toast.error('Failed to delete category');
      console.error('Error deleting category:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock success response
      toast.success(currentCategory ? 'Category updated successfully' : 'Category created successfully');
      setIsDialogOpen(false);
      refetch();
    } catch (error) {
      toast.error(currentCategory ? 'Failed to update category' : 'Failed to create category');
      console.error('Error saving category:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold">Categories</h1>
          <p className="text-muted-foreground mt-1">
            Manage product categories for your portfolio
          </p>
        </div>
        <Button 
          onClick={handleCreateCategory}
          className="mt-4 sm:mt-0"
        >
          <Plus size={16} className="mr-2" />
          New Category
        </Button>
      </div>
      
      {isFetchingCategories ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="w-3/4 h-6 bg-muted rounded" />
              </CardHeader>
              <CardContent>
                <div className="w-full h-20 bg-muted rounded" />
              </CardContent>
              <CardFooter>
                <div className="w-full h-10 bg-muted rounded" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Card key={category.id} className="overflow-hidden">
              <CardHeader>
                <CardTitle>{category.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{category.description}</p>
              </CardContent>
              <CardFooter className="flex justify-between border-t bg-muted/20 p-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleEditCategory(category)}
                >
                  <Pencil size={14} className="mr-1" />
                  Edit
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => handleDeleteCategory(category.id)}
                  disabled={isLoading}
                >
                  <Trash2 size={14} className="mr-1" />
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {currentCategory ? 'Edit Category' : 'Create New Category'}
            </DialogTitle>
            <DialogDescription>
              {currentCategory 
                ? 'Update the details for this category.' 
                : 'Create a new category for organizing your products.'}
            </DialogDescription>
          </DialogHeader>
          
          <CategoryForm 
            initialData={currentCategory}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Categories;
