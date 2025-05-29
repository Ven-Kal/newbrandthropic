
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
        .limit(8);
        
      if (error) {
        console.error('Error fetching similar brands:', error);
        return [];
      }
      
      return data || [];
    },
  });

  if (isLoading || similarBrands.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-4 text-gray-900">
          Similar {currentBrand.category} Brands
        </h2>
        <p className="text-center text-gray-600 mb-12">
          Explore other brands in the {currentBrand.category} category
        </p>
        
        <div className="overflow-x-auto">
          <div className="flex gap-6 pb-4" style={{ width: 'max-content' }}>
            {similarBrands.map((brand) => (
              <div key={brand.brand_id} className="w-80 flex-shrink-0">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 h-40 flex items-center">
                  <div className="w-20 h-20 flex-shrink-0 mr-4">
                    <img 
                      src={brand.logo_url} 
                      alt={brand.brand_name} 
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder.svg";
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">{brand.brand_name}</h3>
                    <div className="flex items-center mb-2">
                      <div className="flex text-amber-400 text-sm">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={i < Math.floor(brand.rating_avg) ? 'text-amber-400' : 'text-gray-300'}>
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="text-sm text-gray-600 ml-2">
                        {brand.rating_avg.toFixed(1)} ({brand.total_reviews})
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">
                      {brand.support_email}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
