
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, ExternalLink, Upload, Database, Search, Globe } from 'lucide-react';
import { SitemapGenerator } from '@/components/seo/sitemap-generator';

export function SEOGuide() {
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  const toggleStep = (stepId: string) => {
    setCompletedSteps(prev => 
      prev.includes(stepId) 
        ? prev.filter(id => id !== stepId)
        : [...prev, stepId]
    );
  };

  const StepItem = ({ id, title, children, isCompleted }: {
    id: string;
    title: string;
    children: React.ReactNode;
    isCompleted?: boolean;
  }) => (
    <div className="border rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-semibold">{title}</h4>
        <Button
          variant={completedSteps.includes(id) || isCompleted ? "default" : "outline"}
          size="sm"
          onClick={() => toggleStep(id)}
        >
          <CheckCircle className="h-4 w-4 mr-1" />
          {completedSteps.includes(id) || isCompleted ? "Done" : "Mark Done"}
        </Button>
      </div>
      <div className="text-sm text-gray-600">{children}</div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Complete SEO Implementation Guide
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="files" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="files">Files & Assets</TabsTrigger>
              <TabsTrigger value="database">Database Updates</TabsTrigger>
              <TabsTrigger value="console">Search Console</TabsTrigger>
              <TabsTrigger value="tools">SEO Tools</TabsTrigger>
            </TabsList>

            <TabsContent value="files" className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">1. Upload Files & Assets</h3>
              
              <StepItem id="favicon" title="Upload Favicon">
                <p><strong>Issue:</strong> Your favicon isn't reflecting because of caching or incorrect file format.</p>
                <p><strong>Solution:</strong></p>
                <ol className="list-decimal list-inside mt-2 space-y-1">
                  <li>Upload your favicon as <code>favicon.ico</code> or <code>favicon.png</code> to the <code>public/</code> folder</li>
                  <li>Ensure the file is named exactly <code>favicon.ico</code> or <code>favicon.png</code></li>
                  <li>Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)</li>
                  <li>Check if the file loads at: <code>https://yourdomain.com/favicon.ico</code></li>
                </ol>
                <div className="mt-2 p-2 bg-yellow-50 rounded">
                  <p><strong>Note:</strong> Lovable currently doesn't support .ico favicons well. Use PNG format instead.</p>
                </div>
              </StepItem>

              <StepItem id="logo" title="Upload Brand Logo">
                <p>Upload your main brand logo to <code>public/logo-brand.png</code></p>
                <p>This will be used in:</p>
                <ul className="list-disc list-inside mt-2">
                  <li>Header/Navigation</li>
                  <li>Social media sharing (OG images)</li>
                  <li>JSON-LD schema</li>
                </ul>
              </StepItem>

              <StepItem id="sitemap" title="Generate & Upload Sitemap">
                <p>Use the sitemap generator below to create your sitemap.xml:</p>
                <div className="mt-2">
                  <SitemapGenerator />
                </div>
                <p className="mt-2">After generating, upload the sitemap.xml to your website's root directory.</p>
              </StepItem>
            </TabsContent>

            <TabsContent value="database" className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">2. Update SEO Data in Database</h3>
              
              <StepItem id="meta-titles" title="Update Meta Titles & Descriptions">
                <p>You can update these through:</p>
                <p><strong>Option A: Admin Dashboard</strong></p>
                <ol className="list-decimal list-inside mt-2 space-y-1">
                  <li>Go to your admin panel (/admin/brands)</li>
                  <li>Edit each brand</li>
                  <li>Add meta_title and meta_description</li>
                </ol>
                <p className="mt-2"><strong>Option B: Direct Database Update</strong></p>
                <pre className="bg-gray-100 p-2 rounded text-xs mt-2">
{`UPDATE brands SET 
  meta_title = brand_name || ' Customer Service | Contact Info & Reviews',
  meta_description = 'Find ' || brand_name || ' customer service contact information, reviews, and ratings. Get help and share your experience.'
WHERE meta_title IS NULL;`}
                </pre>
              </StepItem>

              <StepItem id="alt-text" title="Update Alt Text for Images">
                <p>Alt text has been automatically generated for existing brands. For new brands:</p>
                <pre className="bg-gray-100 p-2 rounded text-xs mt-2">
{`UPDATE brands SET 
  alt_text = brand_name || ' logo - Customer service contact information and reviews'
WHERE alt_text IS NULL;`}
                </pre>
              </StepItem>

              <StepItem id="canonical" title="Set Canonical URLs">
                <p>Canonical URLs help prevent duplicate content issues:</p>
                <pre className="bg-gray-100 p-2 rounded text-xs mt-2">
{`UPDATE brands SET 
  canonical_url = 'https://brandthropic.com/brand/' || slug
WHERE canonical_url IS NULL AND slug IS NOT NULL;`}
                </pre>
              </StepItem>

              <StepItem id="contact-info" title="Add Enhanced Contact Information">
                <p>Add support hours, multiple phone numbers, emails, and office address:</p>
                <pre className="bg-gray-100 p-2 rounded text-xs mt-2">
{`-- Example: Add support hours
UPDATE brands SET 
  support_hours = '{
    "monday": {"open": "09:00", "close": "17:00", "timezone": "EST"},
    "tuesday": {"open": "09:00", "close": "17:00", "timezone": "EST"},
    "wednesday": {"open": "09:00", "close": "17:00", "timezone": "EST"},
    "thursday": {"open": "09:00", "close": "17:00", "timezone": "EST"},
    "friday": {"open": "09:00", "close": "17:00", "timezone": "EST"},
    "saturday": "closed",
    "sunday": "closed"
  }'::jsonb
WHERE brand_id = 'your-brand-id';

-- Example: Add multiple phone numbers
UPDATE brands SET 
  additional_phone_numbers = '{"+1-800-555-0123", "+1-800-555-0124"}'
WHERE brand_id = 'your-brand-id';

-- Example: Add office address
UPDATE brands SET 
  head_office_address = '{
    "street": "123 Main Street",
    "city": "New York",
    "state": "NY",
    "zip": "10001",
    "country": "USA"
  }'::jsonb
WHERE brand_id = 'your-brand-id';`}
                </pre>
              </StepItem>
            </TabsContent>

            <TabsContent value="console" className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">3. Google Search Console Setup</h3>
              
              <StepItem id="verify-site" title="Verify Your Website">
                <p>1. Go to <a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline inline-flex items-center">Google Search Console <ExternalLink className="h-3 w-3 ml-1" /></a></p>
                <p>2. Click "Add Property" and enter your domain</p>
                <p>3. Verify ownership using one of these methods:</p>
                <ul className="list-disc list-inside mt-2 ml-4">
                  <li>HTML file upload</li>
                  <li>HTML tag (add to your site's head)</li>
                  <li>DNS record</li>
                  <li>Google Analytics</li>
                </ul>
              </StepItem>

              <StepItem id="submit-sitemap" title="Submit Sitemap">
                <p>1. In Search Console, go to "Sitemaps" in the left sidebar</p>
                <p>2. Enter your sitemap URL: <code>https://yourdomain.com/sitemap.xml</code></p>
                <p>3. Click "Submit"</p>
                <p>4. Monitor for any errors or warnings</p>
              </StepItem>

              <StepItem id="test-robots" title="Test Robots.txt">
                <p>1. In Search Console, go to "robots.txt Tester" (under Legacy tools)</p>
                <p>2. Test your robots.txt file: <code>https://yourdomain.com/robots.txt</code></p>
                <p>3. Ensure it allows crawling of important pages</p>
              </StepItem>

              <StepItem id="request-indexing" title="Request Indexing">
                <p>1. Use the "URL Inspection" tool</p>
                <p>2. Enter important URLs (homepage, main category pages)</p>
                <p>3. Click "Request Indexing" for each URL</p>
                <p>4. This helps Google discover your content faster</p>
              </StepItem>
            </TabsContent>

            <TabsContent value="tools" className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">4. SEO Monitoring Tools</h3>
              
              <StepItem id="lighthouse" title="Setup Lighthouse Monitoring">
                <p>Monitor Core Web Vitals (LCP, FID, CLS) for SEO performance:</p>
                <ol className="list-decimal list-inside mt-2 space-y-1">
                  <li>Open Chrome DevTools (F12)</li>
                  <li>Go to "Lighthouse" tab</li>
                  <li>Run audit with "Performance" and "SEO" checked</li>
                  <li>Monitor scores and fix issues</li>
                </ol>
                <p className="mt-2">Your app already includes performance monitoring - check browser console for metrics!</p>
              </StepItem>

              <StepItem id="structured-data" title="Test Structured Data">
                <p>1. Go to <a href="https://search.google.com/test/rich-results" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline inline-flex items-center">Rich Results Test <ExternalLink className="h-3 w-3 ml-1" /></a></p>
                <p>2. Enter your brand page URLs</p>
                <p>3. Verify that JSON-LD schema is detected correctly</p>
                <p>4. Fix any errors or warnings</p>
              </StepItem>

              <StepItem id="page-speed" title="Monitor Page Speed">
                <p>1. Use <a href="https://pagespeed.web.dev/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline inline-flex items-center">PageSpeed Insights <ExternalLink className="h-3 w-3 ml-1" /></a></p>
                <p>2. Test both mobile and desktop versions</p>
                <p>3. Focus on Core Web Vitals scores</p>
                <p>4. Implement suggested optimizations</p>
              </StepItem>

              <StepItem id="analytics" title="Setup Analytics">
                <p>Consider adding these tracking tools:</p>
                <ul className="list-disc list-inside mt-2">
                  <li>Google Analytics 4</li>
                  <li>Google Tag Manager</li>
                  <li>Hotjar or similar for user behavior</li>
                  <li>Search Console integration with Analytics</li>
                </ul>
              </StepItem>
            </TabsContent>
          </Tabs>

          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-2">✅ What's Already Implemented</h4>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Enhanced SEO Head component with dynamic meta tags</li>
              <li>• JSON-LD structured data for organizations, websites, breadcrumbs, and reviews</li>
              <li>• Optimized image component with lazy loading</li>
              <li>• Performance monitoring for Core Web Vitals</li>
              <li>• Proper semantic HTML structure with H1-H6 hierarchy</li>
              <li>• 404 page with intelligent redirects</li>
              <li>• Robots.txt file</li>
              <li>• Canonical URL support</li>
              <li>• Dynamic OG images for social sharing</li>
              <li>• Breadcrumb navigation</li>
              <li>• Database schema for enhanced contact information</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
