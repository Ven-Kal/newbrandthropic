
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { Link } from "react-router-dom";
import { Brand } from "@/types";
import { Building2, Users, Handshake, Target } from "lucide-react";

interface BrandRelationship {
  id: string;
  brand_id: string;
  related_brand_id: string;
  relationship_type: string;
  description?: string;
  related_brand: Brand;
}

interface BrandRelationshipsProps {
  brand: Brand;
}

const relationshipIcons = {
  parent_company: Building2,
  subsidiary: Building2,
  sister_concern: Users,
  affiliate: Handshake,
  partner: Handshake,
  competitor: Target,
  other: Building2
};

const relationshipLabels = {
  parent_company: "Parent Company",
  subsidiary: "Subsidiary",
  sister_concern: "Sister Concern",
  affiliate: "Affiliate",
  partner: "Partner",
  competitor: "Competitor",
  other: "Related Brand"
};

export function BrandRelationships({ brand }: BrandRelationshipsProps) {
  const { data: relationships = [], isLoading } = useQuery({
    queryKey: ['brand-relationships', brand.brand_id],
    queryFn: async (): Promise<BrandRelationship[]> => {
      const { data, error } = await supabase
        .from('brand_relationships')
        .select(`
          *,
          related_brand:related_brand_id (
            brand_id,
            brand_name,
            logo_url,
            logo_alt,
            category,
            slug,
            rating_avg,
            total_reviews
          )
        `)
        .eq('brand_id', brand.brand_id);
        
      if (error) {
        console.error('Error fetching brand relationships:', error);
        return [];
      }
      
      return (data as BrandRelationship[]) || [];
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">Related Brands</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (relationships.length === 0) {
    return null;
  }

  // Group relationships by type
  const groupedRelationships = relationships.reduce((acc, rel) => {
    if (!acc[rel.relationship_type]) {
      acc[rel.relationship_type] = [];
    }
    acc[rel.relationship_type].push(rel);
    return acc;
  }, {} as Record<string, BrandRelationship[]>);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold">Related Brands</CardTitle>
        <p className="text-gray-600">
          Discover brands connected to {brand.brand_name}
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {Object.entries(groupedRelationships).map(([type, relatedBrands]) => {
            const IconComponent = relationshipIcons[type as keyof typeof relationshipIcons] || Building2;
            const label = relationshipLabels[type as keyof typeof relationshipLabels] || "Related Brand";
            
            return (
              <div key={type} className="space-y-3">
                <div className="flex items-center gap-2">
                  <IconComponent className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-gray-900">{label}</h3>
                  <Badge variant="outline" className="text-xs">
                    {relatedBrands.length}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {relatedBrands.map((relationship) => {
                    const relatedBrand = relationship.related_brand;
                    const brandSlug = relatedBrand.slug || 
                      relatedBrand.brand_name
                        .toLowerCase()
                        .replace(/[^a-z0-9\s-]/g, '')
                        .replace(/\s+/g, '-')
                        .replace(/-+/g, '-')
                        .trim() || 
                      relatedBrand.brand_id;
                    
                    return (
                      <Link 
                        key={relationship.id}
                        to={`/brand/${brandSlug}`}
                        className="block"
                        onClick={() => window.scrollTo(0, 0)}
                      >
                        <Card className="hover:shadow-md transition-shadow cursor-pointer">
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                                <OptimizedImage
                                  src={relatedBrand.logo_url}
                                  alt={relatedBrand.logo_alt || `${relatedBrand.brand_name} logo`}
                                  className="w-full h-full object-contain"
                                  width={48}
                                  height={48}
                                  loading="lazy"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-gray-900 truncate">
                                  {relatedBrand.brand_name}
                                </h4>
                                <p className="text-sm text-gray-600 capitalize">
                                  {relatedBrand.category}
                                </p>
                                {relatedBrand.total_reviews > 0 && (
                                  <div className="flex items-center gap-1 mt-1">
                                    <span className="text-xs text-yellow-600">★</span>
                                    <span className="text-xs text-gray-600">
                                      {Number(relatedBrand.rating_avg || 0).toFixed(1)} ({relatedBrand.total_reviews})
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                            {relationship.description && (
                              <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                                {relationship.description}
                              </p>
                            )}
                          </CardContent>
                        </Card>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
