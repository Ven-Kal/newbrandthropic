
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { ContactInfo } from "@/components/brand/contact-info";
import { BrandReviews } from "@/components/brand/brand-reviews";
import { EnhancedSEOHead } from "@/components/seo/enhanced-seo-head";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { SimilarBrands } from "@/components/similar-brands";
import { Button } from "@/components/ui/button";
import { Brand } from "@/types";
import { toast } from "@/components/ui/use-toast";
import { Star, Edit, Facebook, Twitter, Instagram, Linkedin, Phone, Mail, Globe, AlertTriangle } from "lucide-react";

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
      // Scroll to top when brand page loads
      window.scrollTo(0, 0);
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
          <p className="text-gray-600 mt-4">Loading brand information...</p>
        </div>
      </div>
    );
  }

  if (!brand) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">Brand Not Found</h1>
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
          
          {/* Brand Header with Key Info Above Fold */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mt-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-6">
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                  <img
                    src={brand.logo_url}
                    alt={brand.logo_alt || `${brand.brand_name} logo`}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder.svg";
                    }}
                  />
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{brand.brand_name}</h1>
                  <p className="text-gray-600 capitalize mb-3">{brand.category}</p>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.floor(brand.rating_avg)
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-lg font-medium text-gray-900">{brand.rating_avg.toFixed(1)}</span>
                    <span className="text-gray-600">({brand.total_reviews} reviews)</span>
                  </div>
                </div>
              </div>
              
              {/* Write Review Button */}
              <Button 
                onClick={() => navigate(`/write-review/${brand.brand_id}`)}
                className="flex items-center space-x-2"
              >
                <Edit className="w-4 h-4" />
                <span>Write Review</span>
              </Button>
            </div>

            {/* Key Contact Info Above Fold */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {/* Primary Phone */}
              {brand.toll_free_number && (
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Phone className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-1">Phone</p>
                  <a 
                    href={`tel:${brand.toll_free_number}`}
                    className="text-lg font-semibold text-gray-900 hover:text-green-600"
                  >
                    {brand.toll_free_number}
                  </a>
                </div>
              )}

              {/* Email */}
              {brand.support_email && (
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Mail className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-1">Email</p>
                  <a 
                    href={`mailto:${brand.support_email}`}
                    className="text-lg font-semibold text-gray-900 hover:text-blue-600 break-all"
                  >
                    {brand.support_email}
                  </a>
                </div>
              )}

              {/* Website */}
              {brand.website_url && (
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Globe className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-1">Website</p>
                  <a 
                    href={brand.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg font-semibold text-gray-900 hover:text-purple-600"
                  >
                    {brand.website_url.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              )}

              {/* Complaint Page */}
              {brand.complaint_page_url && (
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-1">Complaints</p>
                  <a 
                    href={brand.complaint_page_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg font-semibold text-gray-900 hover:text-orange-600"
                  >
                    File Complaint
                  </a>
                </div>
              )}
            </div>

            {/* Social Media Links */}
            {(brand.facebook_url || brand.twitter_url || brand.instagram_url || brand.linkedin_url) && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Follow Us</h3>
                <div className="flex items-center space-x-4">
                  {brand.facebook_url && (
                    <a 
                      href={brand.facebook_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      <Facebook className="w-8 h-8" />
                    </a>
                  )}
                  {brand.twitter_url && (
                    <a 
                      href={brand.twitter_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-500 transition-colors"
                    >
                      <Twitter className="w-8 h-8" />
                    </a>
                  )}
                  {brand.instagram_url && (
                    <a 
                      href={brand.instagram_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-pink-600 hover:text-pink-700 transition-colors"
                    >
                      <Instagram className="w-8 h-8" />
                    </a>
                  )}
                  {brand.linkedin_url && (
                    <a 
                      href={brand.linkedin_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-700 hover:text-blue-800 transition-colors"
                    >
                      <Linkedin className="w-8 h-8" />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {/* Reviews Section */}
          <div className="mb-8">
            <BrandReviews brand={brand} />
          </div>
          
          {/* Additional Contact Information */}
          <div className="mb-8">
            <ContactInfo brand={brand} />
          </div>
          
          {/* Similar Brands Section */}
          <SimilarBrands currentBrand={brand} />
        </div>
      </main>
    </>
  );
}
