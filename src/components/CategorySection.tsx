import { Card, CardContent } from '@/components/ui/card';

interface Category {
  id: string;
  name: string;
  description: string;
}

interface CategorySectionProps {
  categories: Category[];
  onCategoryClick: (categoryId: string) => void;
}

const CategorySection = ({ categories, onCategoryClick }: CategorySectionProps) => {
  const categoryImages = {
    necklaces: 'linear-gradient(135deg, hsl(var(--zulu-red)), hsl(var(--zulu-orange)))',
    bracelets: 'linear-gradient(135deg, hsl(var(--zulu-orange)), hsl(var(--zulu-gold)))',
    accessories: 'linear-gradient(135deg, hsl(var(--zulu-blue)), hsl(var(--zulu-green)))',
    ceremonial: 'linear-gradient(135deg, hsl(var(--earth-clay)), hsl(var(--earth-terracotta)))'
  };

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Shop by Category
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our curated collections of traditional Zulu beadwork, 
            each piece crafted with care and cultural significance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map(category => (
            <Card 
              key={category.id}
              className="group cursor-pointer transition-all duration-300 hover:shadow-elegant hover:-translate-y-2 overflow-hidden"
              onClick={() => onCategoryClick(category.id)}
            >
              <div 
                className="h-32 relative overflow-hidden"
                style={{ background: categoryImages[category.id as keyof typeof categoryImages] }}
              >
                <div className="absolute inset-0 zulu-pattern opacity-30"></div>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
              </div>
              
              <CardContent className="p-6 text-center">
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {category.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;