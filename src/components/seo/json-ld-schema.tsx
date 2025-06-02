
import { Brand } from "@/types";

interface JsonLdSchemaProps {
  type: 'organization' | 'website' | 'breadcrumb' | 'review' | 'brand';
  data?: any;
  brand?: Brand;
  breadcrumbs?: Array<{ name: string; url: string }>;
  reviews?: Array<{ rating: number; text: string; author: string; date: string }>;
}

export function JsonLdSchema({ type, data, brand, breadcrumbs, reviews }: JsonLdSchemaProps) {
  const generateSchema = () => {
    switch (type) {
      case 'organization':
        return {
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Brandthropic",
          "url": "https://brandthropic.com",
          "logo": "https://brandthropic.com/logo-brand.png",
          "description": "Find customer service contact information, reviews, and ratings for thousands of brands.",
          "sameAs": [
            "https://twitter.com/brandthropic",
            "https://facebook.com/brandthropic",
            "https://linkedin.com/company/brandthropic"
          ],
          "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "customer service",
            "email": "support@brandthropic.com"
          }
        };

      case 'website':
        return {
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Brandthropic",
          "url": "https://brandthropic.com",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://brandthropic.com/brands?search={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        };

      case 'breadcrumb':
        return {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": breadcrumbs?.map((crumb, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": crumb.name,
            "item": crumb.url
          }))
        };

      case 'brand':
        if (!brand) return null;
        return {
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": brand.brand_name,
          "url": brand.website_url,
          "logo": brand.logo_url,
          "description": brand.meta_description || `Customer service information for ${brand.brand_name}`,
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": brand.rating_avg,
            "reviewCount": brand.total_reviews
          },
          "contactPoint": [
            brand.toll_free_number && {
              "@type": "ContactPoint",
              "telephone": brand.toll_free_number,
              "contactType": "customer service"
            },
            brand.support_email && {
              "@type": "ContactPoint",
              "email": brand.support_email,
              "contactType": "customer service"
            }
          ].filter(Boolean),
          "address": brand.head_office_address && {
            "@type": "PostalAddress",
            "streetAddress": brand.head_office_address.street,
            "addressLocality": brand.head_office_address.city,
            "addressRegion": brand.head_office_address.state,
            "postalCode": brand.head_office_address.zip,
            "addressCountry": brand.head_office_address.country
          }
        };

      case 'review':
        if (!reviews || !brand) return null;
        return {
          "@context": "https://schema.org",
          "@type": "Product",
          "name": brand.brand_name,
          "review": reviews.map(review => ({
            "@type": "Review",
            "reviewRating": {
              "@type": "Rating",
              "ratingValue": review.rating
            },
            "reviewBody": review.text,
            "author": {
              "@type": "Person",
              "name": review.author
            },
            "datePublished": review.date
          }))
        };

      default:
        return null;
    }
  };

  const schema = generateSchema();
  if (!schema) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
