
import { PageLayout } from "@/components/layout/page-layout";
import { EnhancedSEOHead } from "@/components/seo/enhanced-seo-head";
import { ConsumerBenefitsGuide } from "@/components/admin/consumer-benefits-guide";

export default function ForConsumersPage() {
  return (
    <PageLayout>
      <EnhancedSEOHead
        title="For Consumers - Brandthropic | Find Authentic Brand Reviews"
        description="Discover how consumers benefit from Brandthropic. Find authentic reviews, compare brands, resolve complaints effectively, and make informed purchasing decisions."
        keywords={[
          "consumer benefits",
          "authentic reviews",
          "brand comparison",
          "customer reviews",
          "complaint resolution",
          "consumer rights",
          "product reviews",
          "service reviews"
        ]}
        canonical="https://brandthropic.com/for-consumers"
      />
      <div className="container mx-auto px-4 py-8">
        <ConsumerBenefitsGuide />
      </div>
    </PageLayout>
  );
}
