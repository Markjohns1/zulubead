import ProductCard from './ProductCard';

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

interface FeaturedProductsProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onProductClick: (product: Product) => void;
}

const FeaturedProducts = ({ products, onAddToCart, onProductClick }: FeaturedProductsProps) => {
  const featuredProducts = products.filter(product => product.featured).slice(0, 4);

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Featured Artworks
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our most treasured pieces, handpicked for their exceptional 
            craftsmanship and cultural significance.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              onProductClick={onProductClick}
            />
          ))}
        </div>

        {featuredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 gradient-earth rounded-full mx-auto mb-4 opacity-20"></div>
            <h3 className="text-xl font-semibold mb-2">No featured products available</h3>
            <p className="text-muted-foreground">
              Check back soon for our curated selection of featured artworks.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;