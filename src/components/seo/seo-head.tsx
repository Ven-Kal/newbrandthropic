
import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  url?: string;
  image?: string;
}

export function SEOHead({ 
  title = "Brandthropic | Find Customer Care, Compliants & Helplines",
  description = "Search Customer care numbers, brand support emails, and complaint tools. Brandthropic helps you contact, rate & review companies easily.",
  keywords = ["customer care number, customer service", "brand reviews", "contact information", "customer support", "Customer Complaint" Grievance Portal"],
  url = window.location.href,
  image = "https://lovable.dev/opengraph-image-p98pqg.png"
}: SEOProps) {
  
  useEffect(() => {
    // Update title
    document.title = title;

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    }

    // Update keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', keywords.join(', '));

    // Update Open Graph tags
    const updateOrCreateMetaTag = (property: string, content: string) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    updateOrCreateMetaTag('og:title', title);
    updateOrCreateMetaTag('og:description', description);
    updateOrCreateMetaTag('og:url', url);
    updateOrCreateMetaTag('og:image', image);

    // Update Twitter Card tags
    const updateOrCreateTwitterTag = (name: string, content: string) => {
      let tag = document.querySelector(`meta[name="${name}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('name', name);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    updateOrCreateTwitterTag('twitter:title', title);
    updateOrCreateTwitterTag('twitter:description', description);
    updateOrCreateTwitterTag('twitter:image', image);

    // Update canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);

  }, [title, description, keywords, url, image]);

  return null; // This component doesn't render anything visible
}
