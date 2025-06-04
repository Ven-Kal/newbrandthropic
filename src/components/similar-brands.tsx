
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Brand } from "@/types";
import { BrandCard } from "./brand-card";

interface SimilarBrandsProps {
  currentBrand: Brand;
}

export function SimilarBrands({ currentBrand }: SimilarBrandsProps) {
  const { data: similarBrands = [], isLoading } = useQuery({
    queryKey: ['similar-brands', currentBrand.brand_id, currentBrand.category],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('brands')
        .select('*')
        .eq('category', currentBrand.category)
        .neq('brand_id', currentBrand.brand_id)
        .limit(6);
        
      if (error) {
        console.error('Error fetching similar brands:', error);
        return [];
      }
      
      return data || [];
    },
  });

  if (isLoading) {
    return (
      <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Similar {currentBrand.category} Brands
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-48 rounded-lg"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (similarBrands.length === 0) {
    return null;
  }

  return (
    <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
          Similar {currentBrand.category} Brands
        </h2>
        <p className="text-gray-600 text-lg">
          Explore other brands in the {currentBrand.category} category
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {similarBrands.map((brand) => (
          <BrandCard key={brand.brand_id} brand={brand} />
        ))}
      </div>
    </section>
  );
}
