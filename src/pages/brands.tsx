
import { useState, useRef } from "react";
import { BrandCard } from "@/components/brand-card";
import { SmartSearch } from "@/components/ui/smart-search";
import { Button } from "@/components/ui/button";
import { EnhancedSEOHead } from "@/components/seo/enhanced-seo-head";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { PageHeader } from "@/components/seo/page-header";
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import { Brand } from "@/types";
import { Filter, Grid, List } from "lucide-react";

function BrandsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const brandsRef = useRef<HTMLElement>(null);

  // Fetch brands from Supabase
  const { data: brands = [], isLoading } = useQuery({
    queryKey: ['brands'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('brands')
        .select('*')
        .order('brand_name');
        
      if (error) {
        console.error('Error fetching brands:', error);
        return [];
      }
      
      return data as Brand[] || [];
    },
  });

  // Fetch brand categories
  const { data: categories = [] } = useQuery({
    queryKey: ['brand-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('brand_categories')
        .select('*')
        .order('category');
        
      if (error) {
        console.error('Error fetching brand categories:', error);
        return [];
      }
      
      return data || [];
    },
  });

  const filteredBrands = brands.filter((brand) => {
    const matchesSearch = brand.brand_name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || brand.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
      window.location.href = `/brand/${result.slug || result.id}`;
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

  const breadcrumbs = [
    { name: "Brands", url: "/brands" }
  ];

  return (
    <>
      <EnhancedSEOHead 
        title="Browse Brands - Customer Service Reviews | Brandthropic"
        description="Discover top brands and read authentic customer service reviews. Find reliable companies with excellent customer support and service quality."
        keywords={["brand reviews", "customer service", "company ratings", "consumer feedback"]}
        breadcrumbs={breadcrumbs}
      />
      
      <main className="min-h-screen bg-white">
        <section className="bg-gradient-to-br from-primary via-secondary to-accent text-white">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-4xl mx-auto text-center">
              <PageHeader 
                title="Browse Brands"
                description="Discover top brands and read authentic customer service reviews"
                className="text-white"
              />
              
              <div className="max-w-2xl mx-auto mt-8">
                <SmartSearch
                  placeholder="Search brands..."
                  value={searchQuery}
                  onChange={setSearchQuery}
                  onResultSelect={handleSearchResultSelect}
                  className="bg-white rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
              Browse by Category
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 max-w-6xl mx-auto">
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

        <section ref={brandsRef} className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <Breadcrumbs items={breadcrumbs} />
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                {searchQuery
                  ? `Search Results for "${searchQuery}"`
                  : selectedCategory !== "all"
                  ? `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Brands`
                  : "All Brands"}
              </h2>
              
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {isLoading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <p className="text-lg text-gray-500 mt-4">Loading brands...</p>
              </div>
            ) : filteredBrands.length === 0 ? (
              <div className="text-center py-12">
                <div className="max-w-md mx-auto">
                  <div className="w-24 h-24 mx-auto mb-6 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-4xl">🏢</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No brands found</h3>
                  <p className="text-gray-500">
                    Try adjusting your search or category filter.
                  </p>
                </div>
              </div>
            ) : (
              <div className={`grid gap-6 max-w-6xl mx-auto ${
                viewMode === "grid" 
                  ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
                  : "grid-cols-1 md:grid-cols-2"
              }`}>
                {filteredBrands.map((brand, index) => (
                  <div 
                    key={brand.brand_id} 
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <BrandCard brand={brand} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}

export default BrandsPage;
