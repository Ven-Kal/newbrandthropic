
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Star, 
  Search, 
  Shield, 
  MessageSquare, 
  CheckCircle,
  Award,
  TrendingUp,
  Phone,
  Mail,
  AlertTriangle,
  Eye,
  BookOpen,
  Zap,
  Target,
  Globe
} from "lucide-react";

export function ConsumerBenefitsGuide() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-6 h-6" />
            Benefits for Consumers on BrandThropic
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 text-lg">
            Discover how BrandThropic empowers consumers with authentic reviews, 
            transparent brand information, and effective complaint resolution tools.
          </p>
        </CardContent>
      </Card>

      {/* Key Benefits for Consumers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Authentic Reviews */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-600" />
              Authentic Customer Reviews
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                <span>Verified reviews from real customers</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                <span>Screenshot validation for proof of experience</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                <span>Detailed ratings across multiple categories</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                <span>Anti-spam and fake review detection</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Smart Search */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5 text-blue-600" />
              Smart Brand Discovery
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                <span>Advanced search with filters and categories</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                <span>Compare brands side-by-side</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                <span>Personalized recommendations</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                <span>Similar brand suggestions</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Complaint Resolution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              Complaint Resolution Tools
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                <span>Step-by-step escalation guidance</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                <span>Direct contact information for support</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                <span>Regulatory authority contact details</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                <span>Consumer rights information</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Gamification & Rewards */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-purple-600" />
              Gamification & Rewards
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                <span>Earn points for contributing reviews</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                <span>Unlock badges for community participation</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                <span>Recognition for helpful contributions</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                <span>Leaderboard participation</span>
              </li>
            </ul>
          </CardContent>
        </Card>

      </div>

      {/* How to Use the Platform */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            How to Use BrandThropic Effectively
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            
            {/* Getting Started */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-3">Getting Started</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium text-blue-800 mb-2">1. Create Your Account</h5>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Quick registration process</li>
                    <li>• Email verification for security</li>
                    <li>• Set up your profile</li>
                    <li>• Choose your preferences</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-blue-800 mb-2">2. Explore Brands</h5>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Browse by category</li>
                    <li>• Use search filters</li>
                    <li>• Read existing reviews</li>
                    <li>• Compare ratings</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Writing Reviews */}
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-3">Writing Effective Reviews</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium text-green-800 mb-2">Review Guidelines</h5>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Be honest and objective</li>
                    <li>• Include specific details</li>
                    <li>• Upload supporting screenshots</li>
                    <li>• Rate multiple aspects</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-green-800 mb-2">What to Include</h5>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Product or service details</li>
                    <li>• Your experience timeline</li>
                    <li>• Issues encountered</li>
                    <li>• Resolution outcomes</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Using Escalation Tools */}
            <div className="bg-orange-50 p-4 rounded-lg">
              <h4 className="font-semibold text-orange-900 mb-3">Using Escalation Tools</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium text-orange-800 mb-2">When to Escalate</h5>
                  <ul className="text-sm text-orange-700 space-y-1">
                    <li>• Unresolved customer service issues</li>
                    <li>• Billing or payment disputes</li>
                    <li>• Product quality concerns</li>
                    <li>• Service delivery problems</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-orange-800 mb-2">Escalation Steps</h5>
                  <ul className="text-sm text-orange-700 space-y-1">
                    <li>• Start with customer service</li>
                    <li>• Follow escalation pathway</li>
                    <li>• Document all interactions</li>
                    <li>• Contact regulatory bodies if needed</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Earning Rewards */}
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-semibold text-purple-900 mb-3">Earning Points and Badges</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium text-purple-800 mb-2">Point System</h5>
                  <ul className="text-sm text-purple-700 space-y-1">
                    <li>• 10 points per approved review</li>
                    <li>• 5 points per brand rating</li>
                    <li>• 3 points per helpful comment</li>
                    <li>• Bonus points for quality content</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-purple-800 mb-2">Badge Categories</h5>
                  <ul className="text-sm text-purple-700 space-y-1">
                    <li>• Reviewer badges (Bronze, Silver, Gold)</li>
                    <li>• Category expert badges</li>
                    <li>• Community contributor badges</li>
                    <li>• Special achievement badges</li>
                  </ul>
                </div>
              </div>
            </div>

          </div>
        </CardContent>
      </Card>

      {/* Platform Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Platform Features at a Glance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Browse & Discover
              </h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Advanced search functionality</li>
                <li>• Category-wise browsing</li>
                <li>• Brand comparison tools</li>
                <li>• Personalized recommendations</li>
              </ul>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Review & Rate
              </h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Detailed review forms</li>
                <li>• Multi-aspect rating system</li>
                <li>• Screenshot upload support</li>
                <li>• Review verification process</li>
              </ul>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Get Support
              </h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Escalation guidance</li>
                <li>• Contact information</li>
                <li>• Regulatory authority links</li>
                <li>• Consumer rights resources</li>
              </ul>
            </div>

          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Start Your Journey Today
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <p className="text-gray-600">
              Join thousands of consumers who are making informed decisions and helping 
              others through authentic reviews and shared experiences.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">New Users</h4>
                <p className="text-sm text-blue-800">
                  Create your account and start exploring brands in your area of interest.
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-2">Existing Users</h4>
                <p className="text-sm text-green-800">
                  Continue building your reputation and helping the community grow.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
