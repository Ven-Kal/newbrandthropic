
import { SEOManager } from "@/components/admin/seo-manager";

export default function AdminSEOPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">SEO Management</h1>
        <p className="text-gray-600 mt-2">
          Manage meta titles, descriptions, keywords, and other SEO elements for brands and blogs.
        </p>
      </div>
      
      <SEOManager />
    </div>
  );
}
