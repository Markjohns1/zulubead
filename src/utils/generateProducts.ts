// Utility to generate 100+ products for the e-commerce site

const productNames = {
  necklaces: [
    "Royal Zulu Collar", "Heritage Warrior", "Sacred Spirit", "Ancient Wisdom", "Tribal Princess",
    "Rainbow Pride Choker", "Traditional Medicine", "Sunset Celebration", "Earth Mother", "Sky Dancer",
    "Golden Harvest", "Red River", "Blue Ocean", "Green Forest", "Orange Flame",
    "Purple Mountain", "White Cloud", "Black Thunder", "Silver Moon", "Bronze Sun",
    "Emerald Dream", "Ruby Heart", "Sapphire Soul", "Diamond Spirit", "Pearl Essence"
  ],
  bracelets: [
    "Heritage Bead Set", "Warrior's Honor", "Unity Circle", "Strength Band", "Courage Wrap",
    "Desert Wind", "Mountain Spirit", "River Flow", "Fire Dance", "Earth Song",
    "Storm Cloud", "Sun Ray", "Moon Beam", "Star Light", "Dawn Break",
    "Dusk Fall", "Rain Drop", "Snow Flake", "Wind Whisper", "Thunder Roll",
    "Lightning Strike", "Rainbow Bridge", "Golden Path", "Silver Trail", "Bronze Way"
  ],
  accessories: [
    "Sunset Dreams Earrings", "Celestial Moon", "Desert Sunset Anklet", "Morning Glory", "Evening Star",
    "Crystal Clear", "Ocean Wave", "Mountain Peak", "Forest Deep", "Prairie Wide",
    "Valley Low", "Ridge High", "Canyon Deep", "Mesa Flat", "Butte Tall",
    "Creek Narrow", "River Wide", "Lake Calm", "Sea Vast", "Pond Small",
    "Spring Fresh", "Summer Warm", "Autumn Cool", "Winter Cold", "Flower Bloom"
  ],
  ceremonial: [
    "Warrior Princess Crown", "Royal Crown Headpiece", "Chief's Regalia", "Shaman's Staff", "Sacred Mask",
    "Victory Banner", "Honor Shield", "Peace Pipe", "War Paint", "Spirit Guide",
    "Ancestor Call", "Elder Wisdom", "Youth Energy", "Mother Earth", "Father Sky",
    "Sister Moon", "Brother Sun", "Child Star", "Grandparent Tree", "Family Circle",
    "Tribe Unity", "Clan Honor", "Nation Pride", "Heritage Strong", "Legacy Eternal"
  ]
};

const descriptions = [
  "Handcrafted with traditional techniques passed down through generations.",
  "Features authentic Zulu patterns and vibrant color combinations.",
  "Made by skilled artisans using premium quality beads and materials.",
  "Perfect for special occasions or meaningful everyday wear.",
  "Each piece tells a unique story of African heritage and culture.",
  "Inspired by ancient Zulu traditions and modern artistic vision.",
  "Carefully designed to honor the rich cultural legacy of the Zulu people.",
  "Combines traditional craftsmanship with contemporary style elements.",
  "A timeless piece that celebrates the beauty of African beadwork.",
  "Reflects the spiritual and cultural significance of Zulu art."
];

const colorCombinations = [
  ["red", "gold", "blue"], ["orange", "black", "white"], ["green", "brown", "white"],
  ["blue", "white", "gold"], ["red", "orange", "yellow"], ["purple", "pink", "white"],
  ["black", "red", "gold"], ["green", "yellow", "brown"], ["blue", "silver", "white"],
  ["orange", "brown", "gold"], ["red", "black", "white"], ["green", "blue", "yellow"]
];

const unsplashImages = [
  "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=800&h=800&fit=crop",
  "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=800&h=800&fit=crop",
  "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=800&h=800&fit=crop",
  "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=800&h=800&fit=crop",
  "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?w=800&h=800&fit=crop",
  "https://images.unsplash.com/photo-1500673922987-e212871fec22?w=800&h=800&fit=crop",
  "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=800&h=800&fit=crop",
  "https://images.unsplash.com/photo-1486718448742-163732cd1544?w=800&h=800&fit=crop"
];

export const generateProducts = (startId: number = 11, count: number = 90) => {
  const products = [];
  const categories = Object.keys(productNames);
  
  for (let i = 0; i < count; i++) {
    const category = categories[i % categories.length];
    const nameIndex = Math.floor(i / categories.length) % productNames[category as keyof typeof productNames].length;
    const name = productNames[category as keyof typeof productNames][nameIndex];
    
    const basePrice = category === 'ceremonial' ? 150 : 
                     category === 'necklaces' ? 60 :
                     category === 'bracelets' ? 40 : 30;
    
    const priceVariation = Math.random() * 50 - 25; // -25 to +25
    const price = Math.max(15, basePrice + priceVariation);
    
    products.push({
      id: (startId + i).toString(),
      name: `${name} ${category === 'necklaces' ? 'Necklace' : 
                     category === 'bracelets' ? 'Bracelet' :
                     category === 'accessories' ? 'Accessory' : 'Piece'}`,
      description: descriptions[i % descriptions.length],
      price: Math.round(price * 100) / 100,
      category,
      image: unsplashImages[i % unsplashImages.length],
      featured: Math.random() < 0.1, // 10% chance of being featured
      colors: colorCombinations[i % colorCombinations.length],
      inStock: Math.random() < 0.95 // 95% chance of being in stock
    });
  }
  
  return products;
};