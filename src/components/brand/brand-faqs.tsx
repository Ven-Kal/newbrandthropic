import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { FAQ } from '@/types/faq';
import { Brand } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HelpCircle } from 'lucide-react';

interface BrandFAQsProps {
  brand: Brand;
}

export function BrandFAQs({ brand }: BrandFAQsProps) {
  const { data: faqs = [], isLoading } = useQuery({
    queryKey: ['brand-faqs', brand.category],
    queryFn: async (): Promise<FAQ[]> => {
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .eq('category', brand.category)
        .eq('is_active', true)
        .order('display_order');
      
      if (error) throw error;
      return data || [];
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Frequently Asked Questions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-6 bg-muted rounded animate-pulse"></div>
                <div className="h-16 bg-muted rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (faqs.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-primary" />
          Frequently Asked Questions - {brand.category}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Common questions and answers for {brand.category.toLowerCase()} services
        </p>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="space-y-2">
          {faqs.map((faq) => (
            <AccordionItem
              key={faq.faq_id}
              value={faq.faq_id}
              className="border rounded-lg px-4"
            >
              <AccordionTrigger className="text-left hover:no-underline">
                <h3 className="text-base font-medium text-foreground">
                  {faq.question}
                </h3>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                <div className="pt-2 pb-4">
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
        
        <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
          <p className="text-sm text-muted-foreground text-center">
            Have a specific question about {brand.brand_name}? 
            <a href="/faq" className="text-primary hover:underline ml-1">
              View all FAQs
            </a>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}