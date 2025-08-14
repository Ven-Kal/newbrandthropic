
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/home';
import LoginPage from './pages/login';
import RegisterPage from './pages/register';
import BrandPage from './pages/brand';
import BrandsPage from './pages/brands';
import ReviewPage from './pages/write-review';
import ProfilePage from './pages/my-reviews';
import AdminLayout from './components/admin/layout';
import AdminDashboardPage from './pages/admin/dashboard';
import AdminBrandsPage from './pages/admin/brands';
import AdminReviewsPage from './pages/admin/reviews';
import AdminUsersPage from './pages/admin/users';
import AdminBlogsPage from './pages/admin/blogs';
import AdminAnnouncementsPage from './pages/admin/announcements';
import AdminSEOPage from './pages/admin/seo';
import AdminAnalyticsPage from './pages/admin/analytics';
import NotFoundPage from './pages/NotFound';
import AboutUsPage from './pages/about';
import ForBrandsPage from './pages/for-brands';
import ForConsumersPage from './pages/for-consumers';
import UserProfilePage from './pages/user-profile';
import ResetPasswordPage from './pages/reset-password';
import AdminGuidePage from './pages/admin/guide';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/brands" element={<BrandsPage />} />
        <Route path="/brand/:brandId" element={<BrandPage />} />
        <Route path="/write-review/:brandId" element={<ReviewPage />} />
        <Route path="/about" element={<AboutUsPage />} />
        <Route path="/for-brands" element={<ForBrandsPage />} />
        <Route path="/for-consumers" element={<ForConsumersPage />} />
        <Route path="/user-profile/:userId" element={<UserProfilePage />} />
        <Route path="/my-reviews" element={<ProfilePage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<NotFoundPage />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="brands" element={<AdminBrandsPage />} />
          <Route path="reviews" element={<AdminReviewsPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="blogs" element={<AdminBlogsPage />} />
          <Route path="announcements" element={<AdminAnnouncementsPage />} />
          <Route path="seo" element={<AdminSEOPage />} />
          <Route path="analytics" element={<AdminAnalyticsPage />} />
          <Route path="guide" element={<AdminGuidePage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
