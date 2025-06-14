
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
  // Generate slug from brand name if slug is missing
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim();
  };

  // Use slug if available, otherwise generate one from brand name, fallback to brand_id
  const brandUrl = brand.slug 
    ? `/brand/${brand.slug}` 
    : brand.brand_name 
      ? `/brand/${generateSlug(brand.brand_name)}`
      : `/brand/${brand.brand_id}`;
  
  return (
    <Link to={brandUrl} onClick={() => window.scrollTo(0, 0)}>
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
          <h3 className="font-semibold text-lg text-gray-900 text-center mb-3 group-hover:text-primary transition-colors">
            {brand.brand_name}
          </h3>

          {/* Rating */}
          <div className="flex items-center justify-center mb-4">
            <Rating value={brand.rating_avg} size="sm" className="mr-2" />
            <span className="text-sm font-medium text-gray-700">
              {brand.rating_avg.toFixed(1)}
            </span>
            <span className="text-sm text-gray-500 ml-1">
              ({brand.total_reviews})
            </span>
          </div>

          {/* Tags */}
          <div className="flex flex-col gap-2 mt-auto">
            <Badge variant="secondary" className="text-xs text-center">
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
