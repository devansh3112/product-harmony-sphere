import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import ProductCard from '@/components/ProductCard';
import { Plus, Filter, Search, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { calculateRelevanceScore } from '@/lib/search-utils';

// Sample categories data
const sampleCategories = [
  /* Commented out Networking category
  {
    id: '1',
    name: 'Networking',
    description: 'Network equipment and solutions',
    products: [
      {
        id: '1',
        name: 'Premium Router X500',
        description: 'High-performance router with advanced security features and long-range coverage.',
        isActive: true,
        category: 'Networking',
      },
      {
        id: '2',
        name: 'Network Switch Pro',
        description: 'Enterprise-grade network switch with 24 ports and power-over-ethernet capabilities.',
        isActive: true,
        category: 'Networking',
      },
    ]
  },
  */
  /* Commented out Cloud Services category
  {
    id: '2',
    name: 'Cloud Services',
    description: 'Cloud storage and computing solutions',
    products: [
      {
        id: '3',
        name: 'Cloud Storage Solution',
        description: 'Secure and scalable cloud storage solution for businesses of all sizes.',
        isActive: true,
        category: 'Cloud Services',
      },
      {
        id: '5',
        name: 'VPN Service Premium',
        description: 'Enterprise VPN solution with global server coverage and high encryption standards.',
        isActive: true,
        category: 'Cloud Services',
      },
    ]
  },
  */
  /* Commented out Security category
  {
    id: '3',
    name: 'Security',
    description: 'Network security solutions',
    products: [
      {
        id: '4',
        name: 'Security Gateway',
        description: 'Advanced security gateway to protect your network from threats and intrusions.',
        isActive: false,
        category: 'Security',
      },
      {
        id: '6',
        name: 'Network Monitoring Tool',
        description: 'Comprehensive monitoring solution for network performance and security.',
        isActive: true,
        category: 'Security',
      },
    ]
  },
  */
  {
    id: '4',
    name: 'Carbon Black',
    description: 'Advanced endpoint security and protection solutions',
    products: [
      {
        id: '7',
        name: 'Carbon Black App Control',
        description: 'Trusted software enforcement with flexible deployment',
        isActive: true,
        category: 'Carbon Black',
      },
      {
        id: '8',
        name: 'Carbon Black EDR',
        description: 'Comprehensive threat detection and response platform',
        isActive: true,
        category: 'Carbon Black',
      },
      {
        id: '9',
        name: 'Carbon Black Endpoint Foundation',
        description: 'Next-gen antivirus and endpoint protection',
        isActive: true,
        category: 'Carbon Black',
      },
      {
        id: '10',
        name: 'Carbon Black Endpoint Advanced',
        description: 'Advanced endpoint protection with live query and vulnerability management',
        isActive: true,
        category: 'Carbon Black',
      },
      {
        id: '11',
        name: 'Carbon Black Endpoint Enterprise',
        description: 'Enterprise-grade endpoint protection with advanced features',
        isActive: true,
        category: 'Carbon Black',
      },
      {
        id: '12',
        name: 'Carbon Black Workload Enterprise',
        description: 'Enterprise-grade workload protection',
        isActive: true,
        category: 'Carbon Black',
      },
      {
        id: '13',
        name: 'Carbon Black eNDR/XDR',
        description: 'Extended detection and response',
        isActive: true,
        category: 'Carbon Black',
      },
      {
        id: '14',
        name: 'Carbon Black Host Based Firewall',
        description: 'Host-based firewall management',
        isActive: true,
        category: 'Carbon Black',
      }
    ]
  },
  {
    id: '5',
    name: 'DLP',
    description: 'Comprehensive data loss prevention solutions',
    products: [
      {
        id: '30',
        name: 'Endpoint DLP',
        description: 'Endpoint Prevent and Endpoint Discover for comprehensive endpoint data protection',
        isActive: true,
        category: 'DLP',
      },
      {
        id: '31',
        name: 'Network DLP',
        description: 'Network Monitor, Network Prevent for Email and Web traffic monitoring and control',
        isActive: true,
        category: 'DLP',
      },
      {
        id: '32',
        name: 'Storage DLP',
        description: 'Endpoint Discover and Network Discover for data storage protection',
        isActive: true,
        category: 'DLP',
      },
      {
        id: '33',
        name: 'Cloud DLP',
        description: 'CASB DLP and Cloud Detection Services for cloud data protection',
        isActive: true,
        category: 'DLP',
      }
    ]
  },
  {
    id: '6',
    name: 'Endpoint',
    description: 'Comprehensive endpoint security solutions',
    products: [
      {
        id: '34',
        name: 'SEP-SES',
        description: 'Symantec Endpoint Security - Comprehensive endpoint protection suite',
        isActive: true,
        category: 'Endpoint',
      },
      {
        id: '35',
        name: 'Adaptive Protection',
        description: 'Advanced protection against sophisticated attacks',
        isActive: true,
        category: 'Endpoint',
      },
      {
        id: '36',
        name: 'AD Threat Defense',
        description: 'Active Directory threat defense and breach assessment',
        isActive: true,
        category: 'Endpoint',
      },
      {
        id: '37',
        name: 'Host Integrity',
        description: 'Endpoint compliance and integrity monitoring',
        isActive: true,
        category: 'Endpoint',
      },
      {
        id: '38',
        name: 'IPS',
        description: 'Intrusion Prevention System for network security',
        isActive: true,
        category: 'Endpoint',
      },
      {
        id: '39',
        name: 'AML',
        description: 'Advanced Machine Learning for threat detection',
        isActive: true,
        category: 'Endpoint',
      },
      {
        id: '40',
        name: 'Mobile Threat Management',
        description: 'Comprehensive mobile device security and management',
        isActive: true,
        category: 'Endpoint',
      },
      {
        id: '41',
        name: 'Generic Exploit Mitigation',
        description: 'Protection against common exploit techniques',
        isActive: true,
        category: 'Endpoint',
      },
      {
        id: '42',
        name: 'Suspicious Detection',
        description: 'Advanced suspicious activity detection',
        isActive: true,
        category: 'Endpoint',
      },
      {
        id: '43',
        name: 'Tamper Protection',
        description: 'Protection against security solution tampering',
        isActive: true,
        category: 'Endpoint',
      },
      {
        id: '44',
        name: 'Threat Hunting',
        description: 'Proactive threat hunting capabilities',
        isActive: true,
        category: 'Endpoint',
      },
      {
        id: '45',
        name: 'Targeted Attack Analytics',
        description: 'Advanced analytics for targeted attack detection',
        isActive: true,
        category: 'Endpoint',
      },
      {
        id: '46',
        name: 'Sandboxing',
        description: 'Isolated environment for threat analysis',
        isActive: true,
        category: 'Endpoint',
      },
      {
        id: '47',
        name: 'EDR',
        description: 'Endpoint Detection and Response capabilities',
        isActive: true,
        category: 'Endpoint',
      },
      {
        id: '48',
        name: 'SPE-NAS',
        description: 'Symantec Protection Engine for Network Attached Storage',
        isActive: true,
        category: 'Endpoint',
      },
      {
        id: '49',
        name: 'SPE-CS',
        description: 'Symantec Protection Engine for Cloud Storage',
        isActive: true,
        category: 'Endpoint',
      },
      {
        id: '50',
        name: 'DCS',
        description: 'Data Center Security solution',
        isActive: true,
        category: 'Endpoint',
      }
    ]
  },
  {
    id: '7',
    name: 'Proxy',
    description: 'Advanced network and web protection solutions',
    products: [
      {
        id: '51',
        name: 'CloudSOC CASB',
        description: 'Cloud Security Broker for secure cloud access',
        isActive: true,
        category: 'Proxy',
      },
      {
        id: '52',
        name: 'Network Protection Suite',
        description: 'Comprehensive network security and protection',
        isActive: true,
        category: 'Proxy',
      },
      {
        id: '53',
        name: 'Reverse Proxy',
        description: 'Secure reverse proxy for application protection',
        isActive: true,
        category: 'Proxy',
      },
      {
        id: '54',
        name: 'Cloud Firewall Service',
        description: 'Cloud-based firewall protection service',
        isActive: true,
        category: 'Proxy',
      },
      {
        id: '55',
        name: 'Deep File Inspection',
        description: 'Advanced file inspection for both on-premise and cloud environments',
        isActive: true,
        category: 'Proxy',
      },
      {
        id: '56',
        name: 'Web Isolation',
        description: 'Secure web browsing through isolation technology',
        isActive: true,
        category: 'Proxy',
      },
      {
        id: '57',
        name: 'Malware Analysis',
        description: 'Comprehensive malware analysis and detection',
        isActive: true,
        category: 'Proxy',
      },
      {
        id: '58',
        name: 'ZTNA',
        description: 'Zero Trust Network Access for secure remote access',
        isActive: true,
        category: 'Proxy',
      },
      {
        id: '59',
        name: 'SSLV',
        description: 'SSL Visibility for encrypted traffic inspection',
        isActive: true,
        category: 'Proxy',
      }
    ]
  },
  {
    id: '8',
    name: 'AOD',
    description: 'Application and optimization solutions, including network monitoring, project management, and automation',
    products: [
      {
        id: '60',
        name: 'DX NetOps',
        description: 'Network operations and monitoring solution',
        isActive: true,
        category: 'AOD',
      },
      {
        id: '61',
        name: 'AppNeta',
        description: 'Application performance monitoring and network visibility',
        isActive: true,
        category: 'AOD',
      },
      {
        id: '62',
        name: 'Clarity',
        description: 'Project Portfolio Management solution',
        isActive: true,
        category: 'AOD',
      },
      {
        id: '63',
        name: 'Rally',
        description: 'Agile Project Management platform',
        isActive: true,
        category: 'AOD',
      },
      {
        id: '64',
        name: 'Automic Automation',
        description: 'Enterprise automation and orchestration platform',
        isActive: true,
        category: 'AOD',
      },
      {
        id: '65',
        name: 'Autosys Workload Automation',
        description: 'Enterprise workload automation solution',
        isActive: true,
        category: 'AOD',
      }
    ]
  },
  {
    id: '9',
    name: 'IMS',
    description: 'Information management and security solutions, including authentication, identity management, and email security',
    products: [
      {
        id: '66',
        name: 'Security Analytics',
        description: 'Comprehensive security analytics and reporting platform',
        isActive: true,
        category: 'IMS',
      },
      {
        id: '67',
        name: 'Email Security',
        description: 'SMG/ESS - Secure email gateway and enterprise security solution',
        isActive: true,
        category: 'IMS',
      },
      {
        id: '68',
        name: 'PGP Endpoint',
        description: 'Endpoint encryption and security solution',
        isActive: true,
        category: 'IMS',
      },
      {
        id: '69',
        name: 'VIP Authentication',
        description: 'Advanced authentication and identity verification',
        isActive: true,
        category: 'IMS',
      },
      {
        id: '70',
        name: 'SiteMinder',
        description: 'Web access management and security solution',
        isActive: true,
        category: 'IMS',
      },
      {
        id: '71',
        name: 'VIP Authentication Hub',
        description: 'Centralized authentication management platform',
        isActive: true,
        category: 'IMS',
      },
      {
        id: '72',
        name: 'VIP Saas',
        description: 'Cloud-based authentication service',
        isActive: true,
        category: 'IMS',
      },
      {
        id: '73',
        name: 'Advanced Authentication',
        description: 'Multi-factor authentication solution',
        isActive: true,
        category: 'IMS',
      },
      {
        id: '74',
        name: 'Identity Suite',
        description: 'Comprehensive identity management solution',
        isActive: true,
        category: 'IMS',
      },
      {
        id: '75',
        name: 'Privileged Access Management',
        description: 'PAM solution for secure privileged access control',
        isActive: true,
        category: 'IMS',
      },
      {
        id: '76',
        name: 'CA Directory',
        description: 'Enterprise directory services solution',
        isActive: true,
        category: 'IMS',
      }
    ]
  },
  {
    id: '10',
    name: 'ITSM',
    description: 'IT service management solutions, including incident and problem management',
    products: [
      {
        id: '77',
        name: 'CA Service Desk',
        description: 'Comprehensive IT service management and help desk solution',
        isActive: true,
        category: 'ITSM',
      }
    ]
  }
];

const Products = () => {
  const [categories, setCategories] = useState(sampleCategories);
  const [filteredCategories, setFilteredCategories] = useState(sampleCategories);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'relevance' | 'name' | 'category'>('relevance');
  const [minRelevanceScore, setMinRelevanceScore] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  // Import the searchOpen state and setSearchOpen function from a context or global state
  // This would normally be done through a context provider, but for simplicity, let's access window
  const openGlobalSearch = () => {
    // Trigger the global search dialog
    const event = new KeyboardEvent('keydown', {
      key: 'k',
      ctrlKey: true
    });
    window.dispatchEvent(event);
  };
  
  // Enhanced search with relevance scoring and fuzzy matching
  const searchProduct = React.useCallback((product: any, term: string) => {
    if (!term) return { matches: true, score: 0 };
    
    const searchTerms = term.toLowerCase()
      .split(' ')
      .filter(t => t.length > 0)
      .sort((a, b) => b.length - a.length); // Process longer terms first
    
    const score = calculateRelevanceScore(product, searchTerms);
    const matches = score > minRelevanceScore;
    
    return { matches, score };
  }, [minRelevanceScore]);
  
  // Enhanced filtering with caching
  const filterCache = React.useRef(new Map());
  
  useEffect(() => {
    const cacheKey = `${searchTerm}-${selectedCategory}-${sortOrder}`;
    
    if (filterCache.current.has(cacheKey)) {
      setFilteredCategories(filterCache.current.get(cacheKey));
      return;
    }
    
    // Filter categories and their products
    const filtered = categories.map(category => {
      if (selectedCategory && category.id !== selectedCategory) {
        return { ...category, products: [] };
      }

      const filteredProducts = category.products
        .map(product => {
          const { matches, score } = searchProduct(product, searchTerm);
          return matches ? { ...product, relevanceScore: score } : null;
        })
        .filter(Boolean)
        .sort((a, b) => {
          switch (sortOrder) {
            case 'relevance':
              return b.relevanceScore - a.relevanceScore;
            case 'name':
              return a.name.localeCompare(b.name);
            case 'category':
              return a.category.localeCompare(b.category);
            default:
              return 0;
          }
        });

      return {
        ...category,
        products: filteredProducts
      };
    }).filter(category => 
      category.products.length > 0 || 
      (selectedCategory === category.id && searchTerm === '')
    );

    filterCache.current.set(cacheKey, filtered);
    setFilteredCategories(filtered);
    
    // Clear cache when it grows too large
    if (filterCache.current.size > 100) {
      filterCache.current.clear();
    }
  }, [
    categories,
    searchTerm,
    selectedCategory,
    sortOrder,
    searchProduct
  ]);

  // Reset search when changing categories
  useEffect(() => {
    setSearchTerm('');
  }, [selectedCategory]);
  
  const handleProductClick = (id: string) => {
    navigate(`/products/${id}`);
  };
  
  const handleCreateProduct = () => {
    navigate('/products/new');
  };
  
  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };
  
  const handleBackToCategories = () => {
    setSelectedCategory(null);
  };
  
  const clearFilters = () => {
    setSearchTerm('');
  };
  
  return (
    <div className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold">
              {selectedCategory 
                ? categories.find(c => c.id === selectedCategory)?.name 
                : 'Product Categories'}
            </h1>
            <p className="text-muted-foreground mt-1">
              {selectedCategory 
                ? `Browse products in the ${categories.find(c => c.id === selectedCategory)?.name} category`
                : 'Browse and manage your product catalog'}
            </p>
          </div>
        </div>
        
        {/* Back button when viewing a category */}
        {selectedCategory && (
          <Button 
            variant="outline" 
            onClick={handleBackToCategories}
            className="mb-6"
          >
            Back to Categories
          </Button>
        )}
        
        {/* Simplified filters section using global search */}
        <div className="mb-8 p-4 bg-white/60 backdrop-blur-sm border border-border/40 rounded-lg shadow-sm">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3 top-2.5 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={openGlobalSearch}
                onClick={openGlobalSearch}
                className="pl-10"
              />
            </div>
            <div className="flex items-center space-x-2 sm:w-auto w-full">
              <Select 
                value={sortOrder} 
                onValueChange={(value: 'relevance' | 'name' | 'category') => setSortOrder(value)}
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="relevance">Relevance</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="category">Category</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Active filters */}
          {searchTerm && (
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                Search: {searchTerm}
                <button 
                  onClick={() => setSearchTerm('')}
                  className="ml-1 text-muted-foreground hover:text-foreground"
                >
                  ×
                </button>
              </Badge>
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearFilters}
                className="h-7 text-xs"
              >
                Clear all
              </Button>
            </div>
          )}
        </div>
        
        {/* Display categories as clickable cards when no category is selected */}
        {!selectedCategory && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Card 
                key={category.id} 
                className="cursor-pointer hover:shadow-md transition-shadow bg-white/90 backdrop-blur-sm border border-purple-100"
                onClick={() => handleCategoryClick(category.id)}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl text-purple-800">{category.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                </CardHeader>
                <CardContent className="flex justify-end items-center">
                  <Button variant="ghost" size="sm" className="text-purple-600">
                    View <ArrowRight size={16} className="ml-1" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        
        {/* Display products when a category is selected */}
        {selectedCategory && filteredCategories.length > 0 ? (
          <div className="space-y-8">
            {filteredCategories.map((category) => (
              <Card key={category.id} className="bg-white/90 backdrop-blur-sm border border-purple-100">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl text-purple-800">{category.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {category.products.map((product) => (
                      <ProductCard 
                        key={product.id}
                        product={product}
                        onClick={handleProductClick}
                        className="bg-purple-50/80 hover:bg-purple-50"
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : selectedCategory && (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">No products found matching your criteria.</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => {
                setSearchTerm('');
              }}
            >
              Clear filters
            </Button>
          </div>
        )}

        {isLoading && (
          <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <p className="mb-2">Loading...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
