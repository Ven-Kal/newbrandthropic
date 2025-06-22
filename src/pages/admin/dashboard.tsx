
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DashboardStats {
  totalBrands: number;
  totalReviews: number;
  totalUsers: number;
  pendingReviews: number;
}

interface RecentActivity {
  id: string;
  type: string;
  description: string;
  timestamp: string;
}

export default function AdminDashboardPage() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalBrands: 0,
    totalReviews: 0,
    totalUsers: 0,
    pendingReviews: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Check if user is admin, if not redirect
  useEffect(() => {
    if (isAuthenticated && user?.role !== 'admin') {
      navigate('/');
    } else if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, user, navigate]);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch brands count
        const { count: brandsCount } = await supabase
          .from('brands')
          .select('*', { count: 'exact', head: true });
        
        // Fetch reviews count
        const { count: reviewsCount } = await supabase
          .from('reviews')
          .select('*', { count: 'exact', head: true });
        
        // Fetch pending reviews count
        const { count: pendingCount } = await supabase
          .from('reviews')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'pending');
        
        // Fetch users count from the users table
        const { count: usersCount } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true });
        
        // Fetch recent reviews for activity
        const { data: recentReviews } = await supabase
          .from('reviews')
          .select(`
            review_id,
            rating,
            created_at,
            brands!inner(brand_name),
            users!inner(name)
          `)
          .order('created_at', { ascending: false })
          .limit(10);
        
        setStats({
          totalBrands: brandsCount || 0,
          totalReviews: reviewsCount || 0,
          totalUsers: usersCount || 0,
          pendingReviews: pendingCount || 0,
        });
        
        // Format recent activity
        const activities: RecentActivity[] = (recentReviews || []).map(review => ({
          id: review.review_id,
          type: 'review',
          description: `${(review.users as any)?.name || 'User'} rated ${(review.brands as any)?.brand_name || 'Unknown Brand'} ${review.rating} stars`,
          timestamp: review.created_at,
        }));
        
        setRecentActivity(activities);
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && user?.role === 'admin') {
      fetchDashboardData();
    }
  }, [isAuthenticated, user]);
  
  if (!isAuthenticated || user?.role !== 'admin') {
    return null; // Will be redirected
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome to your admin dashboard. Here's an overview of your platform.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Brands</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "..." : stats.totalBrands.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "..." : stats.totalReviews.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "..." : stats.totalUsers.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "..." : stats.pendingReviews.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-gray-500">Loading activity...</p>
          ) : recentActivity.length > 0 ? (
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex justify-between items-center py-2 border-b last:border-0">
                  <div>
                    <p className="text-sm">{activity.description}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(activity.timestamp).toLocaleDateString()} at{' '}
                      {new Date(activity.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No recent activity to display.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
