
import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function SitemapXML() {
  useEffect(() => {
    const generateAndServeSitemap = async () => {
      try {
        // Fetch all brands with their slugs and update dates
        const { data: brands } = await supabase
          .from('brands')
          .select('slug, updated_at, brand_name')
          .not('slug', 'is', null)
          .order('updated_at', { ascending: false });

        // Fetch categories for category pages
        const { data: categories } = await supabase
          .from('brand_categories')
          .select('category');

        const baseUrl = 'https://brandthropic.com';
        const currentDate = new Date().toISOString().split('T')[0];

        let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/brands</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/login</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${baseUrl}/register</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>`;

        // Add category pages
        categories?.forEach(cat => {
          sitemap += `
  <url>
    <loc>${baseUrl}/category/${encodeURIComponent(cat.category)}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
        });

        // Add brand pages
        brands?.forEach(brand => {
          if (brand.slug) {
            const lastmod = brand.updated_at ? new Date(brand.updated_at).toISOString().split('T')[0] : currentDate;
            sitemap += `
  <url>
    <loc>${baseUrl}/brand/${encodeURIComponent(brand.slug)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
          }
        });

        sitemap += `
</urlset>`;

        // Replace current page content with XML
        document.open();
        document.write(sitemap);
        document.close();
        
      } catch (error) {
        console.error('Error generating sitemap:', error);
        document.open();
        document.write('<?xml version="1.0" encoding="UTF-8"?><error>Sitemap generation failed</error>');
        document.close();
      }
    };

    generateAndServeSitemap();
  }, []);

  return null; // This component doesn't render anything
}
