
import { Routes, Route, useLocation, Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/navbar";
import { Footer } from "@/components/footer";
import HomePage from "@/pages/home";
import Login from "@/pages/login";
import Register from "@/pages/register";
import ResetPassword from "@/pages/reset-password";
import Brand from "@/pages/brand";
import Brands from "@/pages/brands";
import BlogsPage from "@/pages/blogs";
import BlogPage from "@/pages/blog";
import WriteReview from "@/pages/write-review";
import MyReviews from "@/pages/my-reviews";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminBrands from "@/pages/admin/brands";
import AdminBlogs from "@/pages/admin/blogs";
import AdminReviews from "@/pages/admin/reviews";
import AdminUsers from "@/pages/admin/users";
import NotFound from "@/pages/NotFound";
import Survey from "@/pages/survey";
import Subcategory from "@/pages/subcategory";
import SitemapXML from "@/pages/sitemap.xml";
import { EnhancedSEOHead } from "@/components/seo/enhanced-seo-head";

const queryClient = new QueryClient();

function App() {
  const location = useLocation();

  // Check if current route is sitemap
  if (location.pathname === '/sitemap.xml') {
    return <SitemapXML />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="min-h-screen flex flex-col">
          <EnhancedSEOHead />
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/brand/:slugOrId" element={<Brand />} />
              <Route path="/brands" element={<Brands />} />
              <Route path="/blog" element={<BlogsPage />} />
              <Route path="/blog/:slug" element={<BlogPage />} />
              <Route path="/write-review" element={<WriteReview />} />
              <Route path="/write-review/:brandId" element={<WriteReview />} />
              <Route path="/my-reviews" element={<MyReviews />} />
              <Route path="/survey" element={<Survey />} />
              <Route path="/category/:category" element={<Subcategory />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/brands" element={<AdminBrands />} />
              <Route path="/admin/blogs" element={<AdminBlogs />} />
              <Route path="/admin/reviews" element={<AdminReviews />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
          <Toaster />
        </div>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
