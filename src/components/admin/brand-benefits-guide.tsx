
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Building, 
  Star, 
  TrendingUp, 
  Shield, 
  Users, 
  Search, 
  MessageSquare, 
  CheckCircle,
  Globe,
  Eye,
  Award,
  Megaphone,
  BarChart3,
  Phone
} from "lucide-react";

export function BrandBenefitsGuide() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="w-6 h-6" />
            Benefits for Brands on BrandThropic
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 text-lg">
            Discover how your brand can benefit from being listed on BrandThropic - 
            the leading platform for authentic customer reviews and brand transparency.
          </p>
        </CardContent>
      </Card>

      {/* Key Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Enhanced Visibility */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-blue-600" />
              Enhanced Online Visibility
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                <span>Dedicated brand page with comprehensive information</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                <span>SEO-optimized content for better search rankings</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                <span>Featured in category listings and search results</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                <span>Mobile-optimized presence for on-the-go customers</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Customer Trust */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-600" />
              Build Customer Trust
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                <span>Authentic customer reviews with verification system</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                <span>Transparent rating system based on real experiences</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                <span>Professional escalation pathways for customer issues</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                <span>Verified brand status with official recognition</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Customer Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-purple-600" />
              Valuable Customer Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                <span>Real-time feedback on products and services</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                <span>Trend analysis and customer sentiment tracking</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                <span>Competitive analysis and market positioning</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                <span>Customer demographics and behavior patterns</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Reputation Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-orange-600" />
              Reputation Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                <span>Monitor and respond to customer feedback</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                <span>Showcase positive customer experiences</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                <span>Address concerns proactively and transparently</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                <span>Improve overall brand perception and loyalty</span>
              </li>
            </ul>
          </CardContent>
        </Card>

      </div>

      {/* How to Claim Your Brand Page */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="w-5 h-5" />
            How to Claim Your Brand Page
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Current Status</h4>
              <p className="text-sm text-blue-800">
                Brand page claiming is currently managed through our admin team. 
                A self-service claiming system is in development.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Step 1: Verification</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Submit official business documents</li>
                  <li>• Provide authorized contact information</li>
                  <li>• Verify domain ownership</li>
                  <li>• Complete identity verification</li>
                </ul>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Step 2: Page Setup</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Upload official brand logo</li>
                  <li>• Configure contact information</li>
                  <li>• Set up escalation procedures</li>
                  <li>• Optimize SEO settings</li>
                </ul>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-2">Benefits After Claiming</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• <strong>Verified Badge:</strong> Official verification status</li>
                  <li>• <strong>Content Control:</strong> Manage brand information</li>
                  <li>• <strong>Response System:</strong> Reply to customer reviews</li>
                  <li>• <strong>Analytics Access:</strong> View performance metrics</li>
                </ul>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• <strong>Escalation Management:</strong> Configure support pathways</li>
                  <li>• <strong>SEO Optimization:</strong> Improve search visibility</li>
                  <li>• <strong>Priority Support:</strong> Direct admin assistance</li>
                  <li>• <strong>Brand Protection:</strong> Report unauthorized content</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="w-5 h-5" />
            Get Started Today
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Contact Our Team</h4>
              <p className="text-sm text-blue-800 mb-3">
                Ready to claim your brand page? Our team is here to help you get started.
              </p>
              <div className="space-y-2 text-sm">
                <p><strong>Email:</strong> brands@brandthropic.com</p>
                <p><strong>Phone:</strong> 1-800-BRANDS</p>
                <p><strong>Business Hours:</strong> Monday-Friday, 9 AM - 6 PM</p>
              </div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-2">Resources</h4>
              <ul className="text-sm text-green-800 space-y-2">
                <li>• Brand Verification Guide</li>
                <li>• SEO Best Practices</li>
                <li>• Customer Response Templates</li>
                <li>• Escalation Setup Tutorial</li>
                <li>• Analytics Dashboard Guide</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
