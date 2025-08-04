import { Button } from '@/components/ui/button';
import heroBanner from '@/assets/hero-banner.jpg';

const HeroSection = () => {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBanner})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent"></div>
      </div>
      
      {/* African Pattern Overlay */}
      <div className="absolute inset-0 zulu-pattern opacity-20"></div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 leading-tight">
            Authentic Zulu
            <span className="block gradient-zulu bg-clip-text text-transparent">
              Beaded Artworks
            </span>
          </h1>
          
          <p className="text-lg md:text-xl mb-8 text-gray-200 leading-relaxed">
            Discover the rich heritage of traditional Zulu beadwork. Each piece tells a story, 
            handcrafted by skilled artisans using techniques passed down through generations.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-zulu-orange hover:bg-zulu-red text-white shadow-elegant"
            >
              Shop Collection
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-primary"
            >
              Learn Our Story
            </Button>
          </div>
        </div>
      </div>
      
      {/* Decorative Beads */}
      <div className="absolute bottom-10 left-10 w-16 h-16 gradient-zulu rounded-full opacity-60 animate-pulse"></div>
      <div className="absolute top-20 right-20 w-12 h-12 bg-zulu-gold rounded-full opacity-40 animate-pulse delay-300"></div>
      <div className="absolute bottom-20 right-40 w-8 h-8 bg-zulu-blue rounded-full opacity-50 animate-pulse delay-700"></div>
    </section>
  );
};

export default HeroSection;