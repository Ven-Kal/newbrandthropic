
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { ContactInfo } from "@/components/brand/contact-info";
import { EnhancedSEOHead } from "@/components/seo/enhanced-seo-head";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { SimilarBrands } from "@/components/similar-brands";
import { Brand } from "@/types";
import { toast } from "@/components/ui/use-toast";

export default function BrandPage() {
  const { slugOrId } = useParams<{ slugOrId: string }>();
  const navigate = useNavigate();
  const [brand, setBrand] = useState<Brand | null>(null);

  // Fetch brand data - try by slug first, then by ID
  const { data: brandData, isLoading, error } = useQuery({
    queryKey: ['brand', slugOrId],
    queryFn: async () => {
      if (!slugOrId) return null;
      
      console.log("Fetching brand with slug/ID:", slugOrId);
      
      // First try to fetch by slug (case-insensitive)
      let { data, error } = await supabase
        .from('brands')
        .select(`
          *,
          meta_title,
          meta_description,
          slug,
          keywords,
          logo_alt,
          og_image_url,
          canonical_url,
          additional_phone_numbers,
          additional_emails,
          support_hours,
          escalation_phone,
          escalation_email,
          escalation_contact_name,
          head_office_address
        `)
        .ilike('slug', slugOrId)
        .maybeSingle();
      
      // If not found by slug, try by brand_id
      if (!data && !error) {
        console.log("Not found by slug, trying by ID");
        const result = await supabase
          .from('brands')
          .select(`
            *,
            meta_title,
            meta_description,
            slug,
            keywords,
            logo_alt,
            og_image_url,
            canonical_url,
            additional_phone_numbers,
            additional_emails,
            support_hours,
            escalation_phone,
            escalation_email,
            escalation_contact_name,
            head_office_address
          `)
          .eq('brand_id', slugOrId)
          .maybeSingle();
        
        data = result.data;
        error = result.error;
      }
      
      if (error) {
        console.error('Error fetching brand:', error);
        throw error;
      }
      
      console.log("Brand data found:", data);
      return data;
    },
    enabled: !!slugOrId,
  });

  useEffect(() => {
    if (brandData) {
      setBrand(brandData);
    } else if (!isLoading && !brandData && slugOrId) {
      toast({
        title: "Brand not found",
        description: "The brand you're looking for doesn't exist.",
        variant: "destructive"
      });
      navigate('/brands');
    }
  }, [brandData, isLoading, slugOrId, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-lg text-gray-600 mt-4">Loading brand information...</p>
        </div>
      </div>
    );
  }

  if (!brand) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Brand Not Found</h1>
          <p className="text-gray-600 mb-4">The brand you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/brands')}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90"
          >
            Browse All Brands
          </button>
        </div>
      </div>
    );
  }

  const breadcrumbs = [
    { name: "Brands", url: "/brands" },
    { name: brand.brand_name, url: `/brand/${brand.slug || brand.brand_id}` }
  ];

  return (
    <>
      <EnhancedSEOHead 
        title={brand.meta_title || `${brand.brand_name} - Customer Service Contact Information`}
        description={brand.meta_description || `Find customer service contact information for ${brand.brand_name}. Get support numbers, complaint procedures, and escalation details.`}
        keywords={brand.keywords || ['customer service', brand.brand_name, brand.category]}
        brand={brand}
        breadcrumbs={breadcrumbs}
      />
      
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <Breadcrumbs items={breadcrumbs} />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <ContactInfo brand={brand} />
            </div>
            
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <SimilarBrands currentBrand={brand} />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
