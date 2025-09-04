
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { Rating } from "@/components/ui/rating";
import { Link } from "react-router-dom";
import { Brand } from "@/types";

interface BrandCardProps {
  brand: Brand;
}

export function BrandCard({ brand }: BrandCardProps) {
  // Use slug from database only, fallback to brand_id if no slug
  const brandSlug = brand.slug || brand.brand_id;
  const brandUrl = `/brand/${brandSlug}`;
  
  return (
    <Link 
      to={brandUrl} 
      className="block h-full" 
      onClick={() => {
        console.log("Navigating to:", brandUrl);
        window.scrollTo(0, 0);
      }}
    >
      <Card className="group hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer h-full flex flex-col">
        <CardContent className="p-6 flex-grow flex flex-col">
          {/* Logo */}
          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden mx-auto mb-4">
            <OptimizedImage
              src={brand.logo_url}
              alt={brand.logo_alt || `${brand.brand_name} logo`}
              className="w-full h-full object-contain"
              width={64}
              height={64}
              loading="lazy"
            />
          </div>

          {/* Brand Name */}
          <h3 className="font-semibold text-lg text-gray-900 text-center mb-3 group-hover:text-primary transition-colors line-clamp-2">
            {brand.brand_name}
          </h3>

          {/* Rating - Only show if there are actual reviews */}
          {Number(brand.total_reviews || 0) > 0 ? (
            <div className="flex items-center justify-center mb-4">
              <Rating value={Number(brand.rating_avg || 0)} size="sm" className="mr-2" />
              <span className="text-sm font-medium text-gray-700">
                {Number(brand.rating_avg || 0).toFixed(1)}
              </span>
              <span className="text-sm text-gray-500 ml-1">
                ({brand.total_reviews} {Number(brand.total_reviews || 0) === 1 ? 'review' : 'reviews'})
              </span>
            </div>
          ) : (
            <div className="flex items-center justify-center mb-4">
              <span className="text-sm text-gray-500">No reviews yet</span>
            </div>
          )}

          {/* Tags */}
          <div className="flex flex-col gap-2 mt-auto">
            <Badge variant="secondary" className="text-xs text-center capitalize">
              {brand.category}
            </Badge>
            {brand.special_tags && (
              <Badge variant="outline" className="text-xs text-center">
                {brand.special_tags.split(',')[0]?.trim()}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
