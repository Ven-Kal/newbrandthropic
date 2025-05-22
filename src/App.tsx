import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { Navbar } from "@/components/navbar";
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

const AppRoutes = () => {
  // Configure auth redirects when the app loads
  useEffect(() => {
    configureAuthRedirects();
  }, []);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/brands" element={<BrandsListPage />} />
      <Route path="/brand/:brandId" element={<BrandPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      
      {/* Protected Routes */}
      <Route path="/write-review/:brandId" element={
        <ProtectedRoute>
          <WriteReviewPage />
        </ProtectedRoute>
      } />
      <Route path="/my-reviews" element={
        <ProtectedRoute>
          <MyReviewsPage />
        </ProtectedRoute>
      } />
      
      {/* Fixed route handling for reviews */}
      <Route path="/brand/:brandId/review" element={<BrandReviewRedirect />} />
      
      {/* Admin Routes */}
      <Route path="/admin" element={
        <AdminRoute>
          <AdminDashboardPage />
        </AdminRoute>
      } />
      <Route path="/admin/brands" element={
        <AdminRoute>
          <AdminBrandsPage />
        </AdminRoute>
      } />
      <Route path="/admin/reviews" element={
        <AdminRoute>
          <AdminReviewsPage />
        </AdminRoute>
      } />
      
      {/* Catch-all Route */}
      <Route path="*" element={<NotFound />} />
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
            <Navbar />
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
