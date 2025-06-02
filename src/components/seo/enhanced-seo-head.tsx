
import { useEffect } from 'react';
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
  image = "https://lovable.dev/opengraph-image-p98pqg.png",
  brand,
  breadcrumbs,
  reviews,
  noIndex = false,
  canonical
}: EnhancedSEOHeadProps) {

  useEffect(() => {
    // Update title
    document.title = title;

    // Clear existing meta tags
    const existingMetas = document.querySelectorAll('meta[data-seo="true"]');
    existingMetas.forEach(meta => meta.remove());

    // Update meta description
    const metaDescription = document.createElement('meta');
    metaDescription.setAttribute('name', 'description');
    metaDescription.setAttribute('content', description);
    metaDescription.setAttribute('data-seo', 'true');
    document.head.appendChild(metaDescription);

    // Update keywords
    const metaKeywords = document.createElement('meta');
    metaKeywords.setAttribute('name', 'keywords');
    metaKeywords.setAttribute('content', keywords.join(', '));
    metaKeywords.setAttribute('data-seo', 'true');
    document.head.appendChild(metaKeywords);

    // Robots meta
    const metaRobots = document.createElement('meta');
    metaRobots.setAttribute('name', 'robots');
    metaRobots.setAttribute('content', noIndex ? 'noindex, nofollow' : 'index, follow');
    metaRobots.setAttribute('data-seo', 'true');
    document.head.appendChild(metaRobots);

    // Viewport meta
    const metaViewport = document.createElement('meta');
    metaViewport.setAttribute('name', 'viewport');
    metaViewport.setAttribute('content', 'width=device-width, initial-scale=1');
    metaViewport.setAttribute('data-seo', 'true');
    document.head.appendChild(metaViewport);

    // Open Graph tags
    const ogTags = [
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
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
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: brand?.og_image_url || image },
      { name: 'twitter:site', content: '@brandthropic' }
    ];

    twitterTags.forEach(({ name, content }) => {
      const tag = document.createElement('meta');
      tag.setAttribute('name', name);
      tag.setAttribute('content', content);
      tag.setAttribute('data-seo', 'true');
      document.head.appendChild(tag);
    });

    // Canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonical || brand?.canonical_url || url);

    // Performance hints
    const preconnectLinks = [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com'
    ];

    preconnectLinks.forEach(href => {
      const link = document.createElement('link');
      link.setAttribute('rel', 'preconnect');
      link.setAttribute('href', href);
      link.setAttribute('data-seo', 'true');
      document.head.appendChild(link);
    });

  }, [title, description, keywords, url, image, brand, canonical, noIndex]);

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
