import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { FAQ, FAQCategory } from '@/types/faq';
import { PageLayout } from '@/components/layout/page-layout';
import { EnhancedSEOHead } from '@/components/seo/enhanced-seo-head';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { JsonLdSchema } from '@/components/seo/json-ld-schema';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Search, HelpCircle } from 'lucide-react';

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Fetch FAQ categories
  const { data: categories = [] } = useQuery({
    queryKey: ['faq-categories'],
    queryFn: async (): Promise<FAQCategory[]> => {
      const { data, error } = await supabase
        .from('faq_categories')
        .select('*')
        .order('category');
      
      if (error) throw error;
      return data || [];
    },
  });

  // Fetch FAQs
  const { data: faqs = [], isLoading } = useQuery({
    queryKey: ['faqs', selectedCategory, searchTerm],
    queryFn: async (): Promise<FAQ[]> => {
      let query = supabase
        .from('faqs')
        .select('*')
        .eq('is_active', true)
        .order('display_order');

      if (selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory);
      }

      if (searchTerm) {
        query = query.or(`question.ilike.%${searchTerm}%,answer.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
  });

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'FAQ', url: '/faq' }
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <PageLayout>
      <EnhancedSEOHead
        title="Frequently Asked Questions - Brandthropic"
        description="Find answers to common questions about Brandthropic, brand reviews, complaint resolution, and customer support across different industries."
        keywords={["FAQ", "frequently asked questions", "brand support", "customer service", "help", "brandthropic"]}
        canonical="/faq"
      />
      
      <JsonLdSchema type="website" data={structuredData} />
      
      <main className="container mx-auto px-4 py-8">
        <Breadcrumbs items={breadcrumbs} />
        
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <HelpCircle className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Find quick answers to common questions about Brandthropic, our services, and how we help resolve your brand-related concerns.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search FAQs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
            <TabsList className="grid w-full grid-cols-auto gap-2 h-auto p-1">
              <TabsTrigger value="all" className="text-sm">
                All <Badge variant="secondary" className="ml-1">
                  {faqs.length}
                </Badge>
              </TabsTrigger>
              {categories.map((category) => (
                <TabsTrigger key={category.category} value={category.category} className="text-sm">
                  {category.category} <Badge variant="secondary" className="ml-1">
                    {category.faq_count}
                  </Badge>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* FAQ Content */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="h-6 bg-muted rounded animate-pulse"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-20 bg-muted rounded animate-pulse"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : faqs.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <HelpCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No FAQs Found</h3>
              <p className="text-muted-foreground">
                {searchTerm
                  ? `No FAQs match your search for "${searchTerm}"`
                  : 'No FAQs available for this category'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="max-w-4xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq) => (
                <AccordionItem
                  key={faq.faq_id}
                  value={faq.faq_id}
                  className="border rounded-lg bg-card px-6"
                >
                  <AccordionTrigger className="text-left hover:no-underline">
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-foreground">
                          {faq.question}
                        </h3>
                        {faq.category && (
                          <Badge variant="outline" className="mt-2">
                            {faq.category}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    <div className="pt-4 pb-2">
                      {faq.answer.split('\n').map((paragraph, index) => (
                        <p key={index} className="mb-3 last:mb-0">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        )}

        {/* Help Section */}
        <Card className="mt-12 bg-primary/5 border-primary/20">
          <CardContent className="text-center py-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Still Need Help?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Can't find what you're looking for? Our support team is here to help you with any questions or concerns you may have.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Contact Support
              </a>
              <a
                href="/brands"
                className="inline-flex items-center justify-center px-6 py-3 bg-background text-foreground border border-border rounded-lg hover:bg-muted transition-colors"
              >
                Browse Brands
              </a>
            </div>
          </CardContent>
        </Card>
      </main>
    </PageLayout>
  );
}