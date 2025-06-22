
import { useState, useRef } from "react";
import { SmartSearch } from "@/components/ui/smart-search";
import { Brand } from "@/types";
import { BrandCard } from "@/components/brand-card";
import { FeatureCards } from "@/components/feature-cards";
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const navigate = useNavigate();
  const brandsRef = useRef<HTMLElement>(null);

  // Fetch brands from Supabase
  const { data: brands = [], isLoading } = useQuery({
    queryKey: ['all-brands'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('brands')
        .select('*')
        .order('brand_name');
        
      if (error) {
        console.error('Error fetching brands:', error);
        return [];
      }
      
      return data || [];
    },
  });

  // Fetch categories dynamically from the database
  const { data: categories = [] } = useQuery({
    queryKey: ['brand-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('brand_categories')
        .select('*');
        
      if (error) {
        console.error('Error fetching categories:', error);
        return [];
      }
      
      return data || [];
    },
  });

  // Filter brands based on search query and category
  const filteredBrands = brands.filter((brand) => {
    const matchesSearch = brand.brand_name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || brand.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get popular brands (highest rated)
  const popularBrands = [...brands]
    .sort((a, b) => b.rating_avg - a.rating_avg)
    .slice(0, 4);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    // Smooth scroll to brands section
    setTimeout(() => {
      brandsRef.current?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  };

  const handleSearchResultSelect = (result: any) => {
    if (result.type === 'brand') {
      navigate(`/brand/${result.slug || result.id}`);
    } else if (result.type === 'category') {
      setSelectedCategory(result.category);
      setTimeout(() => {
        brandsRef.current?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            {/* Logo and Tagline */}
            <div className="mb-8">
              <h1 className="text-4xl md:text-6xl font-bold mb-3 animate-fade-in">
                Brandthropic
              </h1>
              <p className="text-xl md:text-2xl opacity-90 animate-fade-in font-light italic">
                You're well Heard here
              </p>
            </div>
            
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 animate-fade-in">
              Find Customer Service Information for Any Brand
            </h2>
            <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto animate-fade-in">
              Get contact details, submit reviews, and connect with customer service all in one place
            </p>
            
            <div className="max-w-2xl mx-auto animate-bounce-in">
              <SmartSearch
                placeholder="Search for brands, categories, or products..."
                value={searchQuery}
                onChange={setSearchQuery}
                onResultSelect={handleSearchResultSelect}
                className="bg-white rounded-xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <FeatureCards />

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
            Browse by Category
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 max-w-6xl mx-auto">
            <button
              onClick={() => handleCategorySelect("all")}
              className={`group p-6 rounded-xl text-center transition-all duration-300 transform hover:scale-105 ${
                selectedCategory === "all"
                  ? "bg-primary text-white shadow-lg"
                  : "bg-white hover:bg-gray-100 border border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-secondary flex items-center justify-center">
                <span className="text-white font-bold text-lg">All</span>
              </div>
              <span className="font-semibold">All Brands</span>
            </button>
            
            {categories.map((cat) => (
              <button
                key={cat.category}
                onClick={() => handleCategorySelect(cat.category)}
                className={`group p-6 rounded-xl text-center transition-all duration-300 transform hover:scale-105 ${
                  selectedCategory === cat.category
                    ? "bg-primary text-white shadow-lg"
                    : "bg-white hover:bg-gray-100 border border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-accent flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {cat.category.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="font-semibold capitalize">{cat.category}</span>
                <div className={`text-xs mt-1 ${selectedCategory === cat.category ? 'text-white/80' : 'text-gray-500'}`}>
                  ({cat.brand_count})
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Brands Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
            Popular Brands
          </h2>
          
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="text-lg text-gray-500 mt-4">Loading popular brands...</p>
            </div>
          ) : popularBrands.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-gray-500">No brands found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {popularBrands.map((brand) => (
                <div key={brand.brand_id} className="animate-fade-in">
                  <BrandCard brand={brand} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* All Brands Section (filtered) */}
      <section ref={brandsRef} className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
            {searchQuery
              ? `Search Results for "${searchQuery}"`
              : selectedCategory !== "all"
              ? `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Brands`
              : "All Brands"}
          </h2>
          
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="text-lg text-gray-500 mt-4">Loading brands...</p>
            </div>
          ) : filteredBrands.length === 0 ? (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 mx-auto mb-6 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-4xl">🔍</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No brands found</h3>
                <p className="text-gray-500">
                  Try adjusting your search or category filter.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {filteredBrands.map((brand, index) => (
                <div 
                  key={brand.brand_id} 
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <BrandCard brand={brand} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
