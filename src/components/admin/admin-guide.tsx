
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  LayoutDashboard, 
  Package, 
  MessageSquare, 
  Users, 
  FileText, 
  Search,
  Megaphone,
  BarChart3,
  Shield,
  AlertTriangle,
  Building,
  UserCheck,
  Eye,
  Star,
  BookOpen,
  Phone,
  Mail,
  ExternalLink,
  TrendingUp,
  Globe,
  Settings,
  Upload,
  Download,
  PencilLine,
  CheckCircle,
  XCircle
} from "lucide-react";

export function AdminGuide() {
  return (
    <div className="space-y-8">
      {/* Overview Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5" />
            Admin Console Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            The admin console provides comprehensive management tools for the BrandThropic platform. 
            Access all features through the sidebar navigation on the left.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Quick Stats</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Dashboard with real-time metrics</li>
                <li>• User management and roles</li>
                <li>• Content moderation tools</li>
                <li>• SEO optimization features</li>
              </ul>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-2">Key Features</h4>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• Brand verification system</li>
                <li>• Review management</li>
                <li>• Analytics dashboard</li>
                <li>• Blog content management</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Guide */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Navigation & Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            
            {/* Dashboard */}
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-semibold text-lg flex items-center gap-2 mb-2">
                <LayoutDashboard className="w-5 h-5" />
                Dashboard <Badge variant="secondary">Main</Badge>
              </h3>
              <p className="text-gray-600 mb-2">
                <strong>Location:</strong> /admin (Default landing page)
              </p>
              <p className="text-gray-600 mb-3">
                Central hub displaying key metrics, recent activity, and quick actions.
              </p>
              <div className="bg-gray-50 p-3 rounded text-sm">
                <strong>Features:</strong>
                <ul className="mt-1 space-y-1">
                  <li>• Total users, brands, and reviews overview</li>
                  <li>• Recent user registrations</li>
                  <li>• Pending review approvals</li>
                  <li>• System health indicators</li>
                </ul>
              </div>
            </div>

            {/* Analytics */}
            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="font-semibold text-lg flex items-center gap-2 mb-2">
                <BarChart3 className="w-5 h-5" />
                Analytics Dashboard <Badge variant="secondary">Analytics</Badge>
              </h3>
              <p className="text-gray-600 mb-2">
                <strong>Location:</strong> /admin/analytics
              </p>
              <p className="text-gray-600 mb-3">
                Comprehensive analytics and visitor tracking system.
              </p>
              <div className="bg-gray-50 p-3 rounded text-sm">
                <strong>Available Metrics:</strong>
                <ul className="mt-1 space-y-1">
                  <li>• Real-time visitor tracking</li>
                  <li>• Geographic distribution (countries, states)</li>
                  <li>• Device and browser analytics</li>
                  <li>• Page view statistics</li>
                  <li>• Traffic sources and referrers</li>
                  <li>• User engagement metrics</li>
                </ul>
              </div>
            </div>

            {/* Brand Management */}
            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="font-semibold text-lg flex items-center gap-2 mb-2">
                <Package className="w-5 h-5" />
                Brand Management <Badge variant="secondary">Core</Badge>
              </h3>
              <p className="text-gray-600 mb-2">
                <strong>Location:</strong> /admin/brands
              </p>
              <p className="text-gray-600 mb-3">
                Complete brand management system with verification and optimization tools.
              </p>
              <div className="bg-gray-50 p-3 rounded text-sm">
                <strong>Key Features:</strong>
                <ul className="mt-1 space-y-1">
                  <li>• Brand listing and search functionality</li>
                  <li>• Logo upload and management</li>
                  <li>• Brand verification status</li>
                  <li>• SEO optimization (meta titles, descriptions)</li>
                  <li>• Escalation level management</li>
                  <li>• CSV import/export for bulk operations</li>
                  <li>• Contact information management</li>
                </ul>
              </div>
            </div>

            {/* Review Management */}
            <div className="border-l-4 border-orange-500 pl-4">
              <h3 className="font-semibold text-lg flex items-center gap-2 mb-2">
                <MessageSquare className="w-5 h-5" />
                Review Management <Badge variant="secondary">Moderation</Badge>
              </h3>
              <p className="text-gray-600 mb-2">
                <strong>Location:</strong> /admin/reviews
              </p>
              <p className="text-gray-600 mb-3">
                Review moderation and approval system with content filtering.
              </p>
              <div className="bg-gray-50 p-3 rounded text-sm">
                <strong>Moderation Tools:</strong>
                <ul className="mt-1 space-y-1">
                  <li>• Review approval/rejection workflow</li>
                  <li>• Content filtering and spam detection</li>
                  <li>• Rating verification system</li>
                  <li>• Screenshot validation</li>
                  <li>• Bulk moderation actions</li>
                  <li>• Review status tracking</li>
                </ul>
              </div>
            </div>

            {/* User Management */}
            <div className="border-l-4 border-red-500 pl-4">
              <h3 className="font-semibold text-lg flex items-center gap-2 mb-2">
                <Users className="w-5 h-5" />
                User Management <Badge variant="secondary">Users</Badge>
              </h3>
              <p className="text-gray-600 mb-2">
                <strong>Location:</strong> /admin/users
              </p>
              <p className="text-gray-600 mb-3">
                User account management with role-based access control.
              </p>
              <div className="bg-gray-50 p-3 rounded text-sm">
                <strong>User Controls:</strong>
                <ul className="mt-1 space-y-1">
                  <li>• User account verification</li>
                  <li>• Role assignment (admin, moderator, user)</li>
                  <li>• Badge and point system management</li>
                  <li>• Account suspension/activation</li>
                  <li>• User activity tracking</li>
                  <li>• Profile management</li>
                </ul>
              </div>
            </div>

            {/* Blog Management */}
            <div className="border-l-4 border-indigo-500 pl-4">
              <h3 className="font-semibold text-lg flex items-center gap-2 mb-2">
                <FileText className="w-5 h-5" />
                Blog Management <Badge variant="secondary">Content</Badge>
              </h3>
              <p className="text-gray-600 mb-2">
                <strong>Location:</strong> /admin/blogs
              </p>
              <p className="text-gray-600 mb-3">
                Content management system for blog posts and articles.
              </p>
              <div className="bg-gray-50 p-3 rounded text-sm">
                <strong>Content Features:</strong>
                <ul className="mt-1 space-y-1">
                  <li>• Rich text editor with HTML support</li>
                  <li>• Image upload and management</li>
                  <li>• SEO optimization for posts</li>
                  <li>• Category and tag management</li>
                  <li>• Publication scheduling</li>
                  <li>• Brand tagging system</li>
                </ul>
              </div>
            </div>

            {/* Announcements */}
            <div className="border-l-4 border-pink-500 pl-4">
              <h3 className="font-semibold text-lg flex items-center gap-2 mb-2">
                <Megaphone className="w-5 h-5" />
                Announcements <Badge variant="secondary">Communication</Badge>
              </h3>
              <p className="text-gray-600 mb-2">
                <strong>Location:</strong> /admin/announcements
              </p>
              <p className="text-gray-600 mb-3">
                System for managing site-wide announcements and notifications.
              </p>
              <div className="bg-gray-50 p-3 rounded text-sm">
                <strong>Announcement Tools:</strong>
                <ul className="mt-1 space-y-1">
                  <li>• Banner creation and management</li>
                  <li>• User achievement celebrations</li>
                  <li>• Badge milestone announcements</li>
                  <li>• Custom message broadcasting</li>
                  <li>• Activation/deactivation controls</li>
                </ul>
              </div>
            </div>

            {/* SEO Management */}
            <div className="border-l-4 border-teal-500 pl-4">
              <h3 className="font-semibold text-lg flex items-center gap-2 mb-2">
                <Search className="w-5 h-5" />
                SEO Management <Badge variant="secondary">Optimization</Badge>
              </h3>
              <p className="text-gray-600 mb-2">
                <strong>Location:</strong> /admin/seo
              </p>
              <p className="text-gray-600 mb-3">
                SEO optimization tools for brands and content.
              </p>
              <div className="bg-gray-50 p-3 rounded text-sm">
                <strong>SEO Features:</strong>
                <ul className="mt-1 space-y-1">
                  <li>• Meta title and description optimization</li>
                  <li>• Keyword management</li>
                  <li>• Open Graph image settings</li>
                  <li>• Canonical URL management</li>
                  <li>• SEO scoring system</li>
                  <li>• Search console integration guide</li>
                </ul>
              </div>
            </div>

          </div>
        </CardContent>
      </Card>

      {/* Escalation Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Escalation Management System
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-gray-600">
              The escalation system helps consumers navigate complaint resolution processes for different brands.
            </p>
            
            <div className="bg-amber-50 p-4 rounded-lg">
              <h4 className="font-semibold text-amber-900 mb-2">How to Configure Escalations</h4>
              <ol className="text-sm text-amber-800 space-y-2">
                <li>1. Navigate to <strong>Brand Management</strong> (/admin/brands)</li>
                <li>2. Find the brand and click the escalation icon (⚠️)</li>
                <li>3. Add escalation levels with contact information</li>
                <li>4. Include phone numbers, emails, and website links</li>
                <li>5. Add descriptive notes for each escalation step</li>
              </ol>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Escalation Features</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Multi-level escalation paths</li>
                  <li>• Contact information per level</li>
                  <li>• Custom notes and instructions</li>
                  <li>• Direct link integration</li>
                </ul>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-2">Display System</h4>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• Automatic display on brand pages</li>
                  <li>• Step-by-step guidance</li>
                  <li>• Clickable contact methods</li>
                  <li>• Mobile-responsive design</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Regulatory Authority Mapping */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Regulatory Authority & Government Body Mapping
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-gray-600">
              Each brand category should be mapped to relevant regulatory authorities and government bodies for consumer protection.
            </p>
            
            <div className="bg-red-50 p-4 rounded-lg">
              <h4 className="font-semibold text-red-900 mb-2">Implementation Status</h4>
              <p className="text-sm text-red-800">
                <strong>Note:</strong> This feature is planned but not yet implemented. It will be added to the brand management system.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Planned Categories</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Banking - RBI, Banking Ombudsman</li>
                  <li>• Insurance - IRDAI, Insurance Ombudsman</li>
                  <li>• Telecommunications - TRAI, DOT</li>
                  <li>• E-commerce - Consumer Affairs Ministry</li>
                  <li>• Travel - Ministry of Tourism</li>
                  <li>• Healthcare - Medical Council of India</li>
                </ul>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Integration Points</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Brand category classification</li>
                  <li>• Regulatory contact information</li>
                  <li>• Complaint filing procedures</li>
                  <li>• Legal framework references</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customer Request Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="w-5 h-5" />
            Customer Request & Submission Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-gray-600">
              Handle various customer requests including review submissions, brand claims, and support tickets.
            </p>

            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold text-blue-900 mb-2">Review Submissions</h4>
                <p className="text-sm text-blue-800 mb-2">
                  <strong>Location:</strong> Review Management (/admin/reviews)
                </p>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Approve/reject user-submitted reviews</li>
                  <li>• Validate screenshots and content</li>
                  <li>• Monitor for spam and fake reviews</li>
                  <li>• Bulk moderation actions</li>
                </ul>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-semibold text-green-900 mb-2">Brand Claims</h4>
                <p className="text-sm text-green-800 mb-2">
                  <strong>Status:</strong> Planned feature
                </p>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Brand verification requests</li>
                  <li>• Page ownership claims</li>
                  <li>• Information update requests</li>
                  <li>• Logo and branding updates</li>
                </ul>
              </div>

              <div className="border-l-4 border-orange-500 pl-4">
                <h4 className="font-semibold text-orange-900 mb-2">User Support</h4>
                <p className="text-sm text-orange-800 mb-2">
                  <strong>Current Tools:</strong> User Management
                </p>
                <ul className="text-sm text-orange-700 space-y-1">
                  <li>• Account verification issues</li>
                  <li>• Badge and point system queries</li>
                  <li>• Technical support requests</li>
                  <li>• Content dispute resolution</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
