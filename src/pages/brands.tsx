
import { useState } from "react";
import { Link } from "react-router-dom";
import { BrandCard } from "@/components/brand-card";
import { Brand, BrandCategory } from "@/types";
import { brandCategories, mockBrands } from "@/data/mockData";
import { SearchInput } from "@/components/ui/search-input";
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";

export default function BrandsListPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<BrandCategory | "all">("all");
  
  // Fetch brands from Supabase
  const { data: brands, isLoading } = useQuery({
    queryKey: ['brands'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('brands')
        .select('*')
        .order('brand_name');
        
      if (error) {
        console.error('Error fetching brands:', error);
        // Fallback to mock data if there's an error
        return mockBrands;
      }
      
      return data.length > 0 ? data : mockBrands;
    },
  });
  
  // Filter brands based on search query and category
  const filteredBrands = brands?.filter((brand) => {
    const matchesSearch = brand.brand_name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || brand.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }) || [];

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="bg-brandblue-800 text-white rounded-lg p-8 mb-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            All Brands
          </h1>
          <p className="text-lg mb-6 opacity-90">
            Browse and review brands across different categories
          </p>
          
          <div className="max-w-xl mx-auto">
            <SearchInput
              placeholder="Search for a brand..."
              value={searchQuery}
              onChange={setSearchQuery}
              className="bg-white rounded-lg"
            />
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Filter by Category</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`p-4 rounded-lg text-center transition-colors ${
              selectedCategory === "all"
                ? "bg-brandblue-100 border-2 border-brandblue-500"
                : "bg-gray-50 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            <span className="font-medium">All</span>
          </button>
          
          {brandCategories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`p-4 rounded-lg text-center transition-colors ${
                selectedCategory === category
                  ? "bg-brandblue-100 border-2 border-brandblue-500"
                  : "bg-gray-50 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              <span className="font-medium">{category}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Brands Listing */}
      <section>
        <h2 className="text-2xl font-bold mb-6">
          {searchQuery
            ? `Search Results for "${searchQuery}"`
            : selectedCategory !== "all"
            ? `${selectedCategory} Brands`
            : "All Brands"}
        </h2>
        
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-500">Loading brands...</p>
          </div>
        ) : filteredBrands.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-500">
              No brands found. Try adjusting your search or category filter.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredBrands.map((brand) => (
              <BrandCard key={brand.brand_id} brand={brand} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
