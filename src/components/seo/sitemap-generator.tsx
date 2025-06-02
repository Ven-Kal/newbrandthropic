
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Brand } from '@/types';

export function SitemapGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateSitemap = async () => {
    setIsGenerating(true);
    try {
      // Fetch all brands
      const { data: brands } = await supabase
        .from('brands')
        .select('slug, updated_at, category')
        .order('updated_at', { ascending: false });

      // Fetch all categories
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
        const lastmod = brand.updated_at ? new Date(brand.updated_at).toISOString().split('T')[0] : currentDate;
        sitemap += `
  <url>
    <loc>${baseUrl}/brand/${brand.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
      });

      sitemap += `
</urlset>`;

      // Create and download sitemap
      const blob = new Blob([sitemap], { type: 'application/xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'sitemap.xml';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      console.log('Sitemap generated successfully');
    } catch (error) {
      console.error('Error generating sitemap:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateRobotsTxt = () => {
    const robotsContent = `User-agent: *
Allow: /

User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Twitterbot
Allow: /

User-agent: facebookexternalhit
Allow: /

Sitemap: https://brandthropic.com/sitemap.xml
`;

    const blob = new Blob([robotsContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'robots.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">SEO Tools</h3>
      <div className="space-y-2">
        <button
          onClick={generateSitemap}
          disabled={isGenerating}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 mr-2"
        >
          {isGenerating ? 'Generating...' : 'Generate Sitemap.xml'}
        </button>
        <button
          onClick={generateRobotsTxt}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Generate Robots.txt
        </button>
      </div>
    </div>
  );
}
