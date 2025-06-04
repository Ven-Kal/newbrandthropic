
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { Star, Phone, Mail, Globe } from "lucide-react";
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
  
  console.log("BrandCard - Brand:", brand.brand_name, "URL:", brandUrl, "Slug:", brand.slug);
  
  return (
    <Link to={brandUrl}>
      <Card className="group hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer h-full flex flex-col">
        <CardContent className="p-6 flex-grow">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
              <OptimizedImage
                src={brand.logo_url}
                alt={brand.logo_alt || `${brand.brand_name} logo`}
                className="w-full h-full object-contain"
                width={64}
                height={64}
                loading="lazy"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg text-gray-900 truncate group-hover:text-primary transition-colors">
                {brand.brand_name}
              </h3>
              <p className="text-sm text-gray-500 capitalize">{brand.category}</p>
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center space-x-2 mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(brand.rating_avg)
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-medium">{brand.rating_avg.toFixed(1)}</span>
            <span className="text-sm text-gray-500">({brand.total_reviews} reviews)</span>
          </div>

          {/* Contact Info Preview */}
          <div className="space-y-2">
            {brand.toll_free_number && (
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="w-4 h-4 mr-2 text-green-600" />
                <span className="truncate">{brand.toll_free_number}</span>
              </div>
            )}
            {brand.support_email && (
              <div className="flex items-center text-sm text-gray-600">
                <Mail className="w-4 h-4 mr-2 text-blue-600" />
                <span className="truncate">{brand.support_email}</span>
              </div>
            )}
            {brand.website_url && (
              <div className="flex items-center text-sm text-gray-600">
                <Globe className="w-4 h-4 mr-2 text-purple-600" />
                <span className="truncate">Visit Website</span>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="p-6 pt-0 flex justify-between items-center">
          <div className="flex flex-wrap gap-1">
            {brand.special_tags && (
              <Badge variant="secondary" className="text-xs">
                {brand.special_tags.split(',')[0]?.trim()}
              </Badge>
            )}
          </div>
          <span className="text-xs text-gray-500">
            Updated {new Date(brand.updated_at).toLocaleDateString()}
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
}
