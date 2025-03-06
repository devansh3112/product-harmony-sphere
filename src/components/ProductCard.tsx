
import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    description: string;
    isActive: boolean;
    category?: string;
    subscriptionType?: string;
  };
  className?: string;
  onClick?: (id: string) => void;
}

const ProductCard = ({ product, className, onClick }: ProductCardProps) => {
  const { id, name, description, isActive, category, subscriptionType } = product;
  
  const handleClick = () => {
    if (onClick) {
      onClick(id);
    }
  };
  
  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all duration-300 hover:shadow-md group cursor-pointer",
        "border border-border/40 bg-white/80 backdrop-blur-sm",
        !isActive && "opacity-70",
        className
      )}
      onClick={handleClick}
    >
      <CardContent className="pt-4">
        <h3 className="font-medium text-lg line-clamp-1">{name}</h3>
        <p className="text-muted-foreground text-sm mt-1 line-clamp-2">{description}</p>
        <div className="flex flex-wrap gap-2 mt-3">
          {category && (
            <Badge variant="outline">
              {category}
            </Badge>
          )}
          {subscriptionType && (
            <Badge variant="secondary">
              {subscriptionType}
            </Badge>
          )}
          {!isActive && (
            <Badge variant="destructive" className="ml-auto">
              Unavailable
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
