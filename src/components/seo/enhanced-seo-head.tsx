
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { JsonLdSchema } from './json-ld-schema';
import { Brand } from '@/types';

interface EnhancedSEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string[];
  url?: string;
  image?: string;
  brand?: Brand;
  breadcrumbs?: Array<{ name: string; url: string }>;
  reviews?: Array<{ rating: number; text: string; author: string; date: string }>;
  noIndex?: boolean;
  canonical?: string;
}

export function EnhancedSEOHead({
  title = "Brandthropic - Find Customer Service Contacts & Reviews",
  description = "Find customer service contact information, reviews, and ratings for thousands of brands. Get help and share your experience on Brandthropic.",
  keywords = ["customer service", "brand reviews", "contact information", "customer support"],
  url = window.location.href,
  image = "/meta/brandthropic-default.png",
  brand,
  breadcrumbs,
  reviews,
  noIndex = false,
  canonical
}: EnhancedSEOHeadProps) {
  const location = useLocation();

  useEffect(() => {
    // Update title with category-specific keywords
    const pageTitle = brand?.meta_title || title;
    document.title = pageTitle;

    // Clear existing meta tags
    const existingMetas = document.querySelectorAll('meta[data-seo="true"]');
    existingMetas.forEach(meta => meta.remove());

    // Update meta description
    const metaDescription = document.createElement('meta');
    metaDescription.setAttribute('name', 'description');
    metaDescription.setAttribute('content', brand?.meta_description || description);
    metaDescription.setAttribute('data-seo', 'true');
    document.head.appendChild(metaDescription);

    // Update keywords with category-specific terms
    let seoKeywords = brand?.keywords || keywords;
    if (brand?.category) {
      const categoryKeywords = {
        'airlines': ['flight support', 'cancellation', 'baggage claim', 'airline customer service'],
        'telecom': ['internet support', 'billing complaints', 'network issues', 'telecom customer care'],
        'ecommerce': ['returns', 'refunds', 'order support', 'online shopping help'],
        'banking': ['account support', 'loan queries', 'banking customer service'],
        'healthcare': ['patient care', 'medical support', 'hospital services'],
        'hospitals': ['patient care', 'medical support', 'hospital services']
      };
      
      const additionalKeywords = categoryKeywords[brand.category as keyof typeof categoryKeywords] || [];
      seoKeywords = [...seoKeywords, ...additionalKeywords, brand.brand_name];
    }

    const metaKeywords = document.createElement('meta');
    metaKeywords.setAttribute('name', 'keywords');
    metaKeywords.setAttribute('content', seoKeywords.join(', '));
    metaKeywords.setAttribute('data-seo', 'true');
    document.head.appendChild(metaKeywords);

    // Robots meta
    const metaRobots = document.createElement('meta');
    metaRobots.setAttribute('name', 'robots');
    metaRobots.setAttribute('content', noIndex ? 'noindex, nofollow' : 'index, follow');
    metaRobots.setAttribute('data-seo', 'true');
    document.head.appendChild(metaRobots);

    // Open Graph tags
    const ogTags = [
      { property: 'og:title', content: pageTitle },
      { property: 'og:description', content: brand?.meta_description || description },
      { property: 'og:url', content: url },
      { property: 'og:image', content: brand?.og_image_url || image },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: 'Brandthropic' }
    ];

    ogTags.forEach(({ property, content }) => {
      const tag = document.createElement('meta');
      tag.setAttribute('property', property);
      tag.setAttribute('content', content);
      tag.setAttribute('data-seo', 'true');
      document.head.appendChild(tag);
    });

    // Twitter Card tags
    const twitterTags = [
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:site', content: '@brandthropic' },
      { name: 'twitter:title', content: pageTitle },
      { name: 'twitter:description', content: brand?.meta_description || description },
      { name: 'twitter:image', content: brand?.og_image_url || image }
    ];

    twitterTags.forEach(({ name, content }) => {
      const tag = document.createElement('meta');
      tag.setAttribute('name', name);
      tag.setAttribute('content', content);
      tag.setAttribute('data-seo', 'true');
      document.head.appendChild(tag);
    });

    // Dynamic canonical URL - generate based on current route and brand slug
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    
    let canonicalUrl = canonical || brand?.canonical_url || url;
    
    // For brand pages, use the slug to create proper canonical URL
    if (brand?.slug && location.pathname.includes('/brand/')) {
      canonicalUrl = `https://brandthropic.com/brand/${brand.slug}`;
    }
    
    canonicalLink.setAttribute('href', canonicalUrl);

    // Performance hints
    const preconnectLinks = [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
      'https://www.googletagmanager.com'
    ];

    preconnectLinks.forEach(href => {
      const link = document.createElement('link');
      link.setAttribute('rel', 'preconnect');
      link.setAttribute('href', href);
      link.setAttribute('data-seo', 'true');
      document.head.appendChild(link);
    });

  }, [title, description, keywords, url, image, brand, canonical, noIndex, location.pathname]);

  return (
    <>
      <JsonLdSchema type="organization" />
      <JsonLdSchema type="website" />
      {breadcrumbs && <JsonLdSchema type="breadcrumb" breadcrumbs={breadcrumbs} />}
      {brand && <JsonLdSchema type="brand" brand={brand} />}
      {reviews && brand && <JsonLdSchema type="review" reviews={reviews} brand={brand} />}
    </>
  );
}
