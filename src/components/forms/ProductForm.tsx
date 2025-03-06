
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Plus, Trash2 } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const productSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  shortDescription: z.string().min(10, { message: 'Short description must be at least 10 characters' }),
  fullDescription: z.string().min(50, { message: 'Full description must be at least 50 characters' }),
  category: z.string().min(1, { message: 'Category is required' }),
  subscriptionType: z.string().min(1, { message: 'Subscription type is required' }),
  isActive: z.boolean().default(true),
  images: z.array(z.string()).min(1, { message: 'At least one image is required' }),
  features: z.array(z.string()).min(1, { message: 'At least one feature is required' }),
  competition: z.array(z.string()).optional(),
  useCases: z.array(z.string()).min(1, { message: 'At least one use case is required' }),
  clients: z.array(z.string()).optional(),
  whitepaperLinks: z.array(
    z.object({
      title: z.string().min(1, { message: 'Title is required' }),
      url: z.string().url({ message: 'Please enter a valid URL' }),
    })
  ).optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  initialData?: ProductFormValues;
  onSubmit: (data: ProductFormValues) => void;
  isLoading?: boolean;
  categories: { id: string; title: string }[];
}

const ProductForm = ({ initialData, onSubmit, isLoading = false, categories }: ProductFormProps) => {
  const [activeTab, setActiveTab] = useState('basic');
  
  // List field handling states
  const [newFeature, setNewFeature] = useState('');
  const [newCompetitor, setNewCompetitor] = useState('');
  const [newUseCase, setNewUseCase] = useState('');
  const [newClient, setNewClient] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newWhitepaperTitle, setNewWhitepaperTitle] = useState('');
  const [newWhitepaperUrl, setNewWhitepaperUrl] = useState('');

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: initialData || {
      name: '',
      shortDescription: '',
      fullDescription: '',
      category: '',
      subscriptionType: 'Subscription',
      isActive: true,
      images: [''],
      features: [''],
      competition: [],
      useCases: [''],
      clients: [],
      whitepaperLinks: [],
    },
  });

  const handleSubmit = async (data: ProductFormValues) => {
    try {
      onSubmit(data);
    } catch (error) {
      toast.error('Failed to save product');
      console.error('Error saving product:', error);
    }
  };

  // Handlers for list fields
  const addListItem = (fieldName: keyof ProductFormValues, value: string, setState: React.Dispatch<React.SetStateAction<string>>) => {
    if (value.trim()) {
      const currentValues = form.getValues(fieldName) as string[];
      form.setValue(fieldName as any, [...currentValues, value]);
      setState('');
    }
  };

  const removeListItem = (fieldName: keyof ProductFormValues, index: number) => {
    const currentValues = form.getValues(fieldName) as string[];
    form.setValue(fieldName as any, currentValues.filter((_, i) => i !== index));
  };

  const addWhitepaper = () => {
    if (newWhitepaperTitle.trim() && newWhitepaperUrl.trim()) {
      const currentLinks = form.getValues('whitepaperLinks') || [];
      form.setValue('whitepaperLinks', [
        ...currentLinks, 
        { title: newWhitepaperTitle, url: newWhitepaperUrl }
      ]);
      setNewWhitepaperTitle('');
      setNewWhitepaperUrl('');
    }
  };

  const removeWhitepaper = (index: number) => {
    const currentLinks = form.getValues('whitepaperLinks') || [];
    form.setValue('whitepaperLinks', currentLinks.filter((_, i) => i !== index));
  };

  const addImage = () => {
    if (newImageUrl.trim()) {
      const currentImages = form.getValues('images');
      form.setValue('images', [...currentImages, newImageUrl]);
      setNewImageUrl('');
    }
  };

  const removeImage = (index: number) => {
    const currentImages = form.getValues('images');
    if (currentImages.length > 1) {
      form.setValue('images', currentImages.filter((_, i) => i !== index));
    } else {
      toast.error('You must have at least one image');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter product name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="shortDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Short Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter a brief description"
                      rows={2}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fullDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter detailed description"
                      rows={6}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="subscriptionType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subscription Type</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Subscription">Subscription</SelectItem>
                        <SelectItem value="Hardware">Hardware</SelectItem>
                        <SelectItem value="Permanent">Permanent</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="details" className="space-y-6">
            {/* Features */}
            <FormItem>
              <FormLabel>Features</FormLabel>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a feature"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                  />
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => addListItem('features', newFeature, setNewFeature)}
                  >
                    <Plus size={16} />
                  </Button>
                </div>
                
                <div className="space-y-2">
                  {form.watch('features')?.map((feature, index) => (
                    <div key={index} className="flex items-center justify-between bg-muted/50 px-3 py-2 rounded-md">
                      <span>{feature}</span>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm"
                        onClick={() => removeListItem('features', index)}
                      >
                        <Trash2 size={16} className="text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
                {form.formState.errors.features && (
                  <p className="text-sm font-medium text-destructive">{form.formState.errors.features.message}</p>
                )}
              </div>
            </FormItem>

            {/* Use Cases */}
            <FormItem>
              <FormLabel>Use Cases</FormLabel>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a use case"
                    value={newUseCase}
                    onChange={(e) => setNewUseCase(e.target.value)}
                  />
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => addListItem('useCases', newUseCase, setNewUseCase)}
                  >
                    <Plus size={16} />
                  </Button>
                </div>
                
                <div className="space-y-2">
                  {form.watch('useCases')?.map((useCase, index) => (
                    <div key={index} className="flex items-center justify-between bg-muted/50 px-3 py-2 rounded-md">
                      <span>{useCase}</span>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm"
                        onClick={() => removeListItem('useCases', index)}
                      >
                        <Trash2 size={16} className="text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
                {form.formState.errors.useCases && (
                  <p className="text-sm font-medium text-destructive">{form.formState.errors.useCases.message}</p>
                )}
              </div>
            </FormItem>

            {/* Competition */}
            <FormItem>
              <FormLabel>Competition (Optional)</FormLabel>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a competitor"
                    value={newCompetitor}
                    onChange={(e) => setNewCompetitor(e.target.value)}
                  />
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => addListItem('competition', newCompetitor, setNewCompetitor)}
                  >
                    <Plus size={16} />
                  </Button>
                </div>
                
                <div className="space-y-2">
                  {form.watch('competition')?.map((competitor, index) => (
                    <div key={index} className="flex items-center justify-between bg-muted/50 px-3 py-2 rounded-md">
                      <span>{competitor}</span>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm"
                        onClick={() => removeListItem('competition', index)}
                      >
                        <Trash2 size={16} className="text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </FormItem>

            {/* Clients */}
            <FormItem>
              <FormLabel>Clients (Optional)</FormLabel>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a client"
                    value={newClient}
                    onChange={(e) => setNewClient(e.target.value)}
                  />
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => addListItem('clients', newClient, setNewClient)}
                  >
                    <Plus size={16} />
                  </Button>
                </div>
                
                <div className="space-y-2">
                  {form.watch('clients')?.map((client, index) => (
                    <div key={index} className="flex items-center justify-between bg-muted/50 px-3 py-2 rounded-md">
                      <span>{client}</span>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm"
                        onClick={() => removeListItem('clients', index)}
                      >
                        <Trash2 size={16} className="text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </FormItem>
          </TabsContent>
          
          <TabsContent value="images" className="space-y-6">
            <FormItem>
              <FormLabel>Product Images</FormLabel>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add image URL"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                  />
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={addImage}
                  >
                    <Plus size={16} />
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {form.watch('images')?.map((image, index) => (
                    <div key={index} className="relative group">
                      <img 
                        src={image || '/placeholder.svg'} 
                        alt={`Product image ${index + 1}`}
                        className="w-full aspect-square object-cover rounded-md border border-border"
                      />
                      <Button 
                        type="button" 
                        variant="destructive" 
                        size="sm"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeImage(index)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  ))}
                </div>
                {form.formState.errors.images && (
                  <p className="text-sm font-medium text-destructive">{form.formState.errors.images.message}</p>
                )}
              </div>
            </FormItem>
          </TabsContent>
          
          <TabsContent value="resources" className="space-y-6">
            <FormItem>
              <FormLabel>Whitepapers & Resources (Optional)</FormLabel>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <Input
                    placeholder="Resource title"
                    value={newWhitepaperTitle}
                    onChange={(e) => setNewWhitepaperTitle(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <Input
                      placeholder="Resource URL"
                      value={newWhitepaperUrl}
                      onChange={(e) => setNewWhitepaperUrl(e.target.value)}
                    />
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={addWhitepaper}
                    >
                      <Plus size={16} />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {form.watch('whitepaperLinks')?.map((whitepaper, index) => (
                    <div key={index} className="flex items-center justify-between bg-muted/50 px-3 py-2 rounded-md">
                      <div>
                        <p className="font-medium">{whitepaper.title}</p>
                        <p className="text-sm text-muted-foreground break-all">{whitepaper.url}</p>
                      </div>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm"
                        onClick={() => removeWhitepaper(index)}
                      >
                        <Trash2 size={16} className="text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </FormItem>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between pt-6 border-t">
          <Button 
            type="button" 
            variant="outline"
            onClick={() => {
              const tabs = ['basic', 'details', 'images', 'resources'];
              const currentIndex = tabs.indexOf(activeTab);
              if (currentIndex > 0) {
                setActiveTab(tabs[currentIndex - 1]);
              }
            }}
            disabled={activeTab === 'basic'}
          >
            Previous
          </Button>
          
          {activeTab !== 'resources' ? (
            <Button 
              type="button"
              onClick={() => {
                const tabs = ['basic', 'details', 'images', 'resources'];
                const currentIndex = tabs.indexOf(activeTab);
                if (currentIndex < tabs.length - 1) {
                  setActiveTab(tabs[currentIndex + 1]);
                }
              }}
            >
              Next
            </Button>
          ) : (
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : initialData ? 'Update Product' : 'Create Product'}
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
};

export default ProductForm;
