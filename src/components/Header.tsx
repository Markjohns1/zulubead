import { useState } from 'react';
import { Search, ShoppingCart, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface HeaderProps {
  cartCount: number;
  onSearchChange: (query: string) => void;
  onCartClick: () => void;
}

const Header = ({ cartCount, onSearchChange, onCartClick }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearchChange(query);
  };

  return (
    <header className="bg-card shadow-warm border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 gradient-zulu rounded-full"></div>
            <h1 className="text-xl font-display font-bold text-primary">
              Zulu Beaded Arts
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-foreground hover:text-primary transition-colors">Home</a>
            <a href="#necklaces" className="text-foreground hover:text-primary transition-colors">Necklaces</a>
            <a href="#bracelets" className="text-foreground hover:text-primary transition-colors">Bracelets</a>
            <a href="#accessories" className="text-foreground hover:text-primary transition-colors">Accessories</a>
            <a href="#ceremonial" className="text-foreground hover:text-primary transition-colors">Ceremonial</a>
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex items-center space-x-4 flex-1 max-w-md mx-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                placeholder="Search artworks..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-10 bg-muted/50"
              />
            </div>
          </div>

          {/* Cart and Mobile Menu */}
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onCartClick}
              className="relative hover:bg-accent/20"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <Badge 
                  className="absolute -top-2 -right-2 bg-zulu-red text-primary-foreground min-w-[20px] h-5 flex items-center justify-center text-xs"
                >
                  {cartCount}
                </Badge>
              )}
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border py-4">
            <div className="flex flex-col space-y-4">
              {/* Mobile Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search artworks..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="pl-10 bg-muted/50"
                />
              </div>
              
              {/* Mobile Navigation */}
              <nav className="flex flex-col space-y-2">
                <a href="#" className="text-foreground hover:text-primary transition-colors py-2">Home</a>
                <a href="#necklaces" className="text-foreground hover:text-primary transition-colors py-2">Necklaces</a>
                <a href="#bracelets" className="text-foreground hover:text-primary transition-colors py-2">Bracelets</a>
                <a href="#accessories" className="text-foreground hover:text-primary transition-colors py-2">Accessories</a>
                <a href="#ceremonial" className="text-foreground hover:text-primary transition-colors py-2">Ceremonial</a>
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;