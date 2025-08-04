import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import CategorySection from '@/components/CategorySection';
import FeaturedProducts from '@/components/FeaturedProducts';
import ProductGrid from '@/components/ProductGrid';
import ShoppingCart from '@/components/ShoppingCart';
import productsData from '@/data/products.json';
import { generateProducts } from '@/utils/generateProducts';

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

interface CartItem extends Product {
  quantity: number;
}

const Index = () => {
  const [products] = useState<Product[]>(() => {
    // Combine initial products with generated ones to reach 100+
    const generatedProducts = generateProducts(11, 95);
    return [...productsData.products, ...generatedProducts];
  });
  
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeView, setActiveView] = useState<'home' | 'products'>('home');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const { toast } = useToast();

  const handleAddToCart = (product: Product) => {
    if (!product.inStock) {
      toast({
        title: "Out of Stock",
        description: "This item is currently out of stock.",
        variant: "destructive"
      });
      return;
    }

    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        toast({
          title: "Cart Updated",
          description: `${product.name} quantity increased.`
        });
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        toast({
          title: "Added to Cart",
          description: `${product.name} has been added to your cart.`
        });
        return [...prev, { ...product, quantity: 1 }];
      }
    });
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity === 0) {
      handleRemoveFromCart(id);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
    toast({
      title: "Removed from Cart",
      description: "Item has been removed from your cart."
    });
  };

  const handleProductClick = (product: Product) => {
    toast({
      title: product.name,
      description: "Product details page coming soon!"
    });
  };

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setActiveView('products');
    setSearchQuery('');
    // Scroll to products section
    setTimeout(() => {
      const element = document.getElementById('products');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      setActiveView('products');
      setSelectedCategory(null);
      // Scroll to products section
      setTimeout(() => {
        const element = document.getElementById('products');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  const handleCheckout = () => {
    toast({
      title: "Checkout",
      description: "Redirecting to checkout page... (Feature coming soon!)"
    });
    setIsCartOpen(false);
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Filter products if category is selected
  const filteredProducts = selectedCategory 
    ? products.filter(product => product.category === selectedCategory)
    : products;

  return (
    <div className="min-h-screen bg-background">
      <Header
        cartCount={cartCount}
        onSearchChange={handleSearchChange}
        onCartClick={() => setIsCartOpen(true)}
      />

      {activeView === 'home' && (
        <>
          <HeroSection />
          <CategorySection
            categories={productsData.categories}
            onCategoryClick={handleCategoryClick}
          />
          <FeaturedProducts
            products={products}
            onAddToCart={handleAddToCart}
            onProductClick={handleProductClick}
          />
        </>
      )}

      <div id="products">
        {(activeView === 'products' || searchQuery.trim()) && (
          <div className="py-8">
            <div className="container mx-auto px-4 mb-8">
              <h2 className="text-3xl font-display font-bold text-center mb-4">
                {selectedCategory 
                  ? `${productsData.categories.find(c => c.id === selectedCategory)?.name || 'Products'}`
                  : searchQuery 
                    ? `Search Results`
                    : 'All Products'
                }
              </h2>
              {selectedCategory && (
                <p className="text-center text-muted-foreground max-w-2xl mx-auto">
                  {productsData.categories.find(c => c.id === selectedCategory)?.description}
                </p>
              )}
            </div>
            <ProductGrid
              products={filteredProducts}
              categories={productsData.categories}
              searchQuery={searchQuery}
              onAddToCart={handleAddToCart}
              onProductClick={handleProductClick}
            />
          </div>
        )}
      </div>

      <ShoppingCart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onCheckout={handleCheckout}
      />

      {/* Floating action to return to home */}
      {activeView === 'products' && (
        <button
          onClick={() => {
            setActiveView('home');
            setSelectedCategory(null);
            setSearchQuery('');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="fixed bottom-6 right-6 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center shadow-elegant z-40 transition-all duration-300 hover:scale-110"
        >
          🏠
        </button>
      )}
    </div>
  );
};

export default Index;