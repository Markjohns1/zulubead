import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, ShoppingCart } from 'lucide-react';
import { useState } from 'react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  featured: boolean;
  colors: string[];
  inStock: boolean;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onProductClick: (product: Product) => void;
}

const ProductCard = ({ product, onAddToCart, onProductClick }: ProductCardProps) => {
  const [isWishlist, setIsWishlist] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsWishlist(!isWishlist);
  };

  return (
    <Card 
      className="group cursor-pointer transition-all duration-300 hover:shadow-elegant hover:-translate-y-1 overflow-hidden"
      onClick={() => onProductClick(product)}
    >
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Overlay with actions */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="flex space-x-2">
            <Button
              size="sm"
              onClick={handleAddToCart}
              className="bg-zulu-orange hover:bg-zulu-red text-white"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add to Cart
            </Button>
          </div>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col space-y-2">
          {product.featured && (
            <Badge className="bg-zulu-gold text-primary shadow-sm">
              Featured
            </Badge>
          )}
          {!product.inStock && (
            <Badge variant="destructive">
              Out of Stock
            </Badge>
          )}
        </div>

        {/* Wishlist button */}
        <Button
          size="sm"
          variant="ghost"
          className="absolute top-3 right-3 w-8 h-8 p-0 bg-white/90 hover:bg-white"
          onClick={handleWishlistToggle}
        >
          <Heart 
            className={`w-4 h-4 ${isWishlist ? 'fill-zulu-red text-zulu-red' : 'text-gray-600'}`} 
          />
        </Button>
      </div>

      <CardContent className="p-4">
        <div className="space-y-2">
          <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {product.description}
          </p>
          
          {/* Color indicators */}
          <div className="flex space-x-1">
            {product.colors.map((color, index) => (
              <div
                key={index}
                className={`w-4 h-4 rounded-full border-2 border-white shadow-sm ${
                  color === 'red' ? 'bg-zulu-red' :
                  color === 'orange' ? 'bg-zulu-orange' :
                  color === 'gold' ? 'bg-zulu-gold' :
                  color === 'blue' ? 'bg-zulu-blue' :
                  color === 'green' ? 'bg-zulu-green' :
                  color === 'black' ? 'bg-black' :
                  color === 'white' ? 'bg-white border-gray-300' :
                  color === 'brown' ? 'bg-earth-clay' :
                  'bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div className="text-2xl font-bold text-primary">
          ${product.price}
        </div>
        <Badge variant="secondary" className="text-xs">
          {product.category}
        </Badge>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;