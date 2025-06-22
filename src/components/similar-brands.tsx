
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { BrandCard } from "./brand-card";
import { Brand } from "@/types";

interface SimilarBrandsProps {
  currentBrand: Brand;
  searchQuery?: string;
  selectedCategory?: string;
  filteredBrands?: Brand[];
  viewMode?: "grid" | "list";
}

export function SimilarBrands({ 
  currentBrand, 
  searchQuery = "", 
  selectedCategory = "all",
  filteredBrands,
  viewMode = "grid"
}: SimilarBrandsProps) {
  // Fetch similar brands if no filtered brands provided
  const { data: brands = [], isLoading } = useQuery({
    queryKey: ['similar-brands', currentBrand.brand_id, currentBrand.category],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('brands')
        .select('*')
        .eq('category', currentBrand.category)
        .neq('brand_id', currentBrand.brand_id)
        .order('rating_avg', { ascending: false })
        .limit(8);
        
      if (error) {
        console.error('Error fetching similar brands:', error);
        return [];
      }
      
      return data || [];
    },
    enabled: !filteredBrands,
  });

  // Use filtered brands if provided, otherwise use fetched brands
  const displayBrands = filteredBrands || brands;

  if (isLoading && !filteredBrands) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="text-gray-500 mt-2">Loading similar brands...</p>
      </div>
    );
  }

  if (displayBrands.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <span className="text-2xl">🔍</span>
          </div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            {searchQuery || selectedCategory !== "all" 
              ? "No brands found" 
              : "No similar brands found"}
          </h3>
          <p className="text-gray-500">
            {searchQuery || selectedCategory !== "all"
              ? "Try adjusting your search or category filter."
              : `We couldn't find any brands similar to ${currentBrand.brand_name}.`}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`grid gap-6 ${
      viewMode === "grid" 
        ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
        : "grid-cols-1 md:grid-cols-2"
    }`}>
      {displayBrands.map((brand, index) => (
        <div 
          key={brand.brand_id} 
          className="animate-fade-in"
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          <BrandCard brand={brand} />
        </div>
      ))}
    </div>
  );
}
