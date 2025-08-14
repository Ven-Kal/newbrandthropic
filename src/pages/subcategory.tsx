
import { useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { BrandCard } from "@/components/brand-card";
import { SearchInput } from "@/components/ui/search-input";
import { PageLayout } from "@/components/layout/page-layout";
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";

export default function SubcategoryPage() {
  const { category } = useParams<{ category: string }>();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("all");
  const brandsRef = useRef<HTMLElement>(null);
  
  // Fetch subcategories for this category
  const { data: subcategories = [] } = useQuery({
    queryKey: ['subcategories', category],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('brand_subcategories')
        .select('*')
        .eq('category', category);
        
      if (error) {
        console.error('Error fetching subcategories:', error);
        return [];
      }
      
      return data || [];
    },
  });

  // Fetch brands for this category
  const { data: brands = [], isLoading } = useQuery({
    queryKey: ['brands-by-category', category, selectedSubcategory],
    queryFn: async () => {
      let query = supabase
        .from('brands')
        .select('*')
        .eq('category', category)
        .order('brand_name');
        
      if (selectedSubcategory !== "all") {
        query = query.eq('subcategory', selectedSubcategory);
      }
        
      const { data, error } = await query;
        
      if (error) {
        console.error('Error fetching brands:', error);
        return [];
      }
      
      return data || [];
    },
  });
  
  // Filter brands based on search query
  const filteredBrands = brands.filter((brand) =>
    brand.brand_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubcategorySelect = (subcategory: string) => {
    setSelectedSubcategory(subcategory);
    setTimeout(() => {
      brandsRef.current?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  };

  // Define feature cards based on category
  const getFeatureCards = () => {
    switch (category) {
      case 'airlines':
        return [
          { title: 'On-time Performance', desc: 'Punctuality matters' },
          { title: 'Customer Service', desc: 'Support quality' },
          { title: 'Baggage Handling', desc: 'Safe & secure' },
          { title: 'In-flight Experience', desc: 'Comfort & amenities' },
          { title: 'Value for Money', desc: 'Price vs service' }
        ];
      case 'technology':
        return [
          { title: 'Performance', desc: 'Speed & reliability' },
          { title: 'User Experience', desc: 'Ease of use' },
          { title: 'Innovation', desc: 'Latest features' },
          { title: 'Support', desc: 'Customer assistance' },
          { title: 'Value', desc: 'Price vs features' }
        ];
      case 'banking':
        return [
          { title: 'Interest Rates', desc: 'Competitive rates' },
          { title: 'Customer Service', desc: 'Support quality' },
          { title: 'Digital Banking', desc: 'Online experience' },
          { title: 'Branch Network', desc: 'Accessibility' },
          { title: 'Fees & Charges', desc: 'Transparent pricing' }
        ];
      default:
        return [
          { title: 'Quality', desc: 'Product excellence' },
          { title: 'Service', desc: 'Customer support' },
          { title: 'Value', desc: 'Price worthiness' },
          { title: 'Experience', desc: 'User satisfaction' },
          { title: 'Trust', desc: 'Brand reliability' }
        ];
    }
  };

  const featureCards = getFeatureCards();

  return (
    <PageLayout>
      <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 capitalize">
              {category} Subcategories
            </h1>
            <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
              Explore different subcategories in {category}
            </p>
            
            <div className="max-w-xl mx-auto">
              <SearchInput
                placeholder="Search for a brand..."
                value={searchQuery}
                onChange={setSearchQuery}
                className="bg-white rounded-xl shadow-xl text-gray-900"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4 text-gray-900">
            Key Decision Factors
          </h2>
          <p className="text-center text-gray-600 mb-12">
            Top parameters to consider when choosing in this category
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
            {featureCards.map((card, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
                <h3 className="font-semibold text-gray-900 mb-2">{card.title}</h3>
                <p className="text-sm text-gray-600">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subcategories Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-900">
            Choose Subcategory
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 max-w-6xl mx-auto">
            <button
              onClick={() => handleSubcategorySelect("all")}
              className={`group p-6 rounded-xl text-center transition-all duration-300 transform hover:scale-105 ${
                selectedSubcategory === "all"
                  ? "bg-slate-900 text-white shadow-lg"
                  : "bg-white hover:bg-gray-100 border border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-slate-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">All</span>
              </div>
              <span className="font-semibold">All {category}</span>
            </button>
            
            {subcategories.map((subcat) => (
              <button
                key={subcat.subcategory}
                onClick={() => handleSubcategorySelect(subcat.subcategory)}
                className={`group p-6 rounded-xl text-center transition-all duration-300 transform hover:scale-105 ${
                  selectedSubcategory === subcat.subcategory
                    ? "bg-slate-900 text-white shadow-lg"
                    : "bg-white hover:bg-gray-100 border border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-slate-600 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {subcat.subcategory.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="font-semibold capitalize text-sm">
                  {subcat.subcategory.replace('-', ' ')}
                </span>
                <div className={`text-xs mt-1 ${selectedSubcategory === subcat.subcategory ? 'text-white/80' : 'text-gray-500'}`}>
                  ({subcat.brand_count})
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Brands Listing */}
      <section ref={brandsRef} className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-900">
            {searchQuery
              ? `Search Results for "${searchQuery}"`
              : selectedSubcategory !== "all"
              ? `${selectedSubcategory.replace('-', ' ')} Brands`
              : `All ${category} Brands`}
          </h2>
          
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
              <p className="text-lg text-gray-500 mt-4">Loading brands...</p>
            </div>
          ) : filteredBrands.length === 0 ? (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 mx-auto mb-6 bg-slate-900 rounded-full flex items-center justify-center">
                  <span className="text-4xl">🔍</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No brands found</h3>
                <p className="text-gray-500">
                  Try adjusting your search or subcategory filter.
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
      </div>
    </PageLayout>
  );
}
