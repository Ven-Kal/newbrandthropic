
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function SitemapPage() {
  const [, setSitemapGenerated] = useState(false);

  useEffect(() => {
    const generateSitemap = async () => {
      try {
        // Fetch all brands with their slugs and update dates
        const { data: brands } = await supabase
          .from('brands')
          .select('slug, updated_at, brand_name')
          .order('updated_at', { ascending: false });

        // Fetch categories for category pages
        const { data: categories } = await supabase
          .from('brand_categories')
          .select('category');

        const baseUrl = 'https://brandthropic.com';
        const currentDate = new Date().toISOString();

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
            const lastmod = brand.updated_at ? new Date(brand.updated_at).toISOString() : currentDate;
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

        // Set proper XML content type and serve the sitemap
        const response = new Response(sitemap, {
          headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'Cache-Control': 'public, max-age=3600',
          },
        });

        setSitemapGenerated(true);
        return response;
      } catch (error) {
        console.error('Error generating sitemap:', error);
        return new Response('Error generating sitemap', { status: 500 });
      }
    };

    generateSitemap();
  }, []);

  return null; // This component doesn't render anything
}
