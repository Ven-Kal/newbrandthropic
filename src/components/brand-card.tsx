
import { Brand } from "@/types";
import { Card, CardContent } from "./ui/card";
import { Rating } from "./ui/rating";
import { Link } from "react-router-dom";
import { Zap, Award, Star, Verified } from "lucide-react";

interface BrandCardProps {
  brand: Brand;
  compact?: boolean;
}

export function BrandCard({ brand, compact = false }: BrandCardProps) {
  // Extract special tags from brand_name or add tag field in database
  const hasSharkTankTag = brand.brand_name.toLowerCase().includes("shark tank") || 
                          (brand.special_tags && brand.special_tags.includes("shark tank"));
  
  const hasRelianceTag = brand.brand_name.toLowerCase().includes("reliance") || 
                         (brand.special_tags && brand.special_tags.includes("reliance"));
                        
  const hasCelebrityTag = brand.special_tags && brand.special_tags.includes("celebrity");
                         
  const isFeatured = brand.rating_avg >= 4.5 || 
                    (brand.special_tags && brand.special_tags.includes("featured"));

  return (
    <Link to={`/brand/${brand.brand_id}`}>
      <Card className={`overflow-hidden transition-all hover:shadow-md ${compact ? 'h-40' : ''}`}>
        <div className="relative h-full flex flex-col">
          {!compact && (
            <div className="absolute top-2 right-2 px-2 py-1 bg-brandblue-800 text-white text-xs font-medium rounded">
              {brand.category}
            </div>
          )}
          
          <div className={`${compact ? 'h-20 p-4' : 'h-32 p-6'} flex items-center justify-center bg-white border-b`}>
            <img 
              src={brand.logo_url} 
              alt={brand.brand_name} 
              className={`max-h-full max-w-full object-contain`} 
            />
          </div>
          
          <CardContent className={`flex flex-col ${compact ? 'p-3' : 'pt-4'}`}>
            <div className="flex justify-between items-start">
              <h3 className="font-semibold text-foreground truncate">{brand.brand_name}</h3>
              
              {isFeatured && !compact && (
                <span className="flex items-center text-amber-500 ml-1">
                  <Star className="h-4 w-4 fill-amber-500" />
                </span>
              )}
            </div>
            
            {/* Special tags */}
            {!compact && (hasSharkTankTag || hasRelianceTag || hasCelebrityTag) && (
              <div className="flex flex-wrap gap-2 mt-1">
                {hasSharkTankTag && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                    <Zap className="h-3 w-3 mr-1" />
                    Shark Tank
                  </span>
                )}
                
                {hasRelianceTag && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                    <Award className="h-3 w-3 mr-1" />
                    Reliance Group
                  </span>
                )}
                
                {hasCelebrityTag && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-pink-100 text-pink-800">
                    <Verified className="h-3 w-3 mr-1" />
                    Celebrity Backed
                  </span>
                )}
              </div>
            )}
            
            <div className="flex items-center justify-between mt-2">
              <Rating value={brand.rating_avg} size={compact ? "sm" : "md"} />
              <span className="text-xs text-muted-foreground">
                {brand.total_reviews} reviews
              </span>
            </div>
            
            {!compact && (
              <div className="mt-2 text-xs text-muted-foreground truncate">
                {brand.support_email}
              </div>
            )}
          </CardContent>
        </div>
      </Card>
    </Link>
  );
}
