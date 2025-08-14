
import { PageLayout } from "@/components/layout/page-layout";
import { EnhancedSEOHead } from "@/components/seo/enhanced-seo-head";
import { BrandBenefitsGuide } from "@/components/admin/brand-benefits-guide";

export default function ForBrandsPage() {
  return (
    <PageLayout>
      <EnhancedSEOHead
        title="For Brands - Brandthropic | Enhance Your Brand Reputation"
        description="Discover how brands can benefit from Brandthropic's platform. Build customer trust, get valuable insights, manage your reputation, and connect with your audience effectively."
        keywords={[
          "brand benefits",
          "brand reputation management",
          "customer feedback platform",
          "brand visibility",
          "customer insights",
          "brand marketing",
          "customer trust",
          "brand reviews"
        ]}
        canonical="https://brandthropic.com/for-brands"
      />
      <div className="container mx-auto px-4 py-8">
        <BrandBenefitsGuide />
      </div>
    </PageLayout>
  );
}
