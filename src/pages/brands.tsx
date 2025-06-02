
import { useState, useRef } from "react";
import { BrandCard } from "@/components/brand-card";
import { SmartSearch } from "@/components/ui/smart-search";
import { EnhancedSEOHead } from "@/components/seo/enhanced-seo-head";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { PageHeader } from "@/components/seo/page-header";
import { PerformanceMonitor } from "@/components/seo/performance-monitor";
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export default function BrandsListPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const navigate = useNavigate();
  const brandsRef = useRef<HTMLElement>(null);

  // Fetch brands from Supabase with SEO data
  const { data: brands = [], isLoading } = useQuery({
    queryKey: ['all-brands'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('brands')
        .select('*, meta_title, meta_description, slug, keywords, alt_text, og_image_url, canonical_url')
        .order('brand_name');
        
      if (error) {
        console.error('Error fetching brands:', error);
        return [];
      }
      
      return data || [];
    },
  });

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

  const filteredBrands = brands.filter((brand) => {
    const matchesSearch = brand.brand_name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || brand.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setTimeout(() => {
      brandsRef.current?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  };

  const handleSearchResultSelect = (result: any) => {
    if (result.type === 'brand') {
      navigate(`/brand/${result.id}`);
    } else if (result.type === 'category') {
      setSelectedCategory(result.name);
      setTimeout(() => {
        brandsRef.current?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);
    }
  };

  // Generate SEO data for the page
  const seoTitle = searchQuery 
    ? `${searchQuery} Brands - Customer Service & Reviews | Brandthropic`
    : selectedCategory !== "all"
    ? `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Brands - Customer Service & Reviews | Brandthropic`
    : "All Brands - Customer Service & Reviews | Brandthropic";

  const seoDescription = searchQuery
    ? `Find customer service information and reviews for brands matching "${searchQuery}". Get contact details and read user experiences.`
    : selectedCategory !== "all"
    ? `Browse ${selectedCategory} brands and find their customer service information, reviews, and contact details on Brandthropic.`
    : "Browse all brands and find customer service contact information, reviews, and ratings. Discover the best ways to reach customer support for thousands of companies.";

  const seoKeywords = [
    "customer service",
    "brand reviews",
    "contact information", 
    "customer support",
    ...(searchQuery ? [searchQuery] : []),
    ...(selectedCategory !== "all" ? [selectedCategory] : []),
    "toll free numbers",
    "support email",
    "complaint resolution"
  ];

  const breadcrumbs = [
    { name: "Brands", url: "/brands" }
  ];

  return (
    <>
      <EnhancedSEOHead 
        title={seoTitle}
        description={seoDescription}
        keywords={seoKeywords}
        breadcrumbs={breadcrumbs}
      />
      <PerformanceMonitor />
      
      <main className="min-h-screen bg-white">
        <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-4xl mx-auto text-center">
              <div className="mb-8">
                <PageHeader 
                  title="All Brands"
                  description="Find any brand's customer service information"
                  className="text-white"
                />
              </div>
              
              <div className="max-w-2xl mx-auto">
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

        <section ref={brandsRef} className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <Breadcrumbs items={breadcrumbs} />
            
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
    </>
  );
}
