
import { Brand } from "@/types";
import { Card, CardContent } from "./ui/card";
import { Rating } from "./ui/rating";
import { Link } from "react-router-dom";

interface BrandCardProps {
  brand: Brand;
  compact?: boolean;
}

export function BrandCard({ brand, compact = false }: BrandCardProps) {
  return (
    <Link to={`/brand/${brand.brand_id}`}>
      <Card className={`overflow-hidden transition-all hover:shadow-md ${compact ? 'h-40' : 'h-60'}`}>
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
            <h3 className="font-semibold text-foreground truncate">{brand.brand_name}</h3>
            
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
