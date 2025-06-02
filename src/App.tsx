
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { PerformanceMonitor } from "@/components/seo/performance-monitor";
import HomePage from "./pages/home";
import BrandPage from "./pages/brand";
import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";
import ResetPasswordPage from "./pages/reset-password";
import WriteReviewPage from "./pages/write-review";
import NotFound from "./pages/NotFound";
import MyReviewsPage from "./pages/my-reviews";
import AdminDashboardPage from "./pages/admin/dashboard";
import AdminBrandsPage from "./pages/admin/brands";
import AdminReviewsPage from "./pages/admin/reviews";
import BrandsListPage from "./pages/brands";
import SubcategoryPage from "./pages/subcategory";
import SurveyPage from "./pages/survey";
import { useEffect } from "react";
import { configureAuthRedirects } from "./lib/supabase";

const queryClient = new QueryClient();

// Protected route component that checks authentication
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Store the intended location for redirect after login
      sessionStorage.setItem('redirectAfterLogin', location.pathname);
    }
  }, [isLoading, isAuthenticated, location]);
  
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// AdminRoute component that checks for admin role
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!isAuthenticated || user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

// Fixed redirect component
const BrandReviewRedirect = () => {
  const location = useLocation();
  const path = location.pathname;
  const brandId = path.split('/brand/')[1]?.split('/review')[0];
  
  return <Navigate to={`/write-review/${brandId}`} replace />;
};

// Layout component for pages that need navbar and footer
const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <PerformanceMonitor />
      <Navbar />
      {children}
      <Footer />
    </>
  );
};

const AppRoutes = () => {
  // Configure auth redirects when the app loads
  useEffect(() => {
    configureAuthRedirects();
  }, []);

  return (
    <Routes>
      {/* Public Routes with Layout */}
      <Route path="/" element={<Layout><HomePage /></Layout>} />
      <Route path="/brands" element={<Layout><BrandsListPage /></Layout>} />
      <Route path="/category/:category" element={<Layout><SubcategoryPage /></Layout>} />
      <Route path="/brand/:brandId" element={<Layout><BrandPage /></Layout>} />
      <Route path="/login" element={<Layout><LoginPage /></Layout>} />
      <Route path="/register" element={<Layout><RegisterPage /></Layout>} />
      <Route path="/reset-password" element={<Layout><ResetPasswordPage /></Layout>} />
      
      {/* Survey Routes (No Layout - Full Screen) */}
      <Route path="/survey/:surveyId" element={<SurveyPage />} />
      
      {/* Protected Routes with Layout */}
      <Route path="/write-review/:brandId" element={
        <Layout>
          <ProtectedRoute>
            <WriteReviewPage />
          </ProtectedRoute>
        </Layout>
      } />
      <Route path="/my-reviews" element={
        <Layout>
          <ProtectedRoute>
            <MyReviewsPage />
          </ProtectedRoute>
        </Layout>
      } />
      
      {/* Fixed route handling for reviews */}
      <Route path="/brand/:brandId/review" element={<BrandReviewRedirect />} />
      
      {/* Admin Routes with Layout */}
      <Route path="/admin" element={
        <Layout>
          <AdminRoute>
            <AdminDashboardPage />
          </AdminRoute>
        </Layout>
      } />
      <Route path="/admin/brands" element={
        <Layout>
          <AdminRoute>
            <AdminBrandsPage />
          </AdminRoute>
        </Layout>
      } />
      <Route path="/admin/reviews" element={
        <Layout>
          <AdminRoute>
            <AdminReviewsPage />
          </AdminRoute>
        </Layout>
      } />
      
      {/* Catch-all Route */}
      <Route path="*" element={<Layout><NotFound /></Layout>} />
    </Routes>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
