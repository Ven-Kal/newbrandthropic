
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Star, TrendingUp, Users, Trophy, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { UserDashboard } from "@/components/user-dashboard";
import { useBadgeSystem } from "@/hooks/useBadgeSystem";
import { SmartSearch } from "@/components/ui/smart-search";

interface Brand {
  brand_id: string;
  brand_name: string;
  category: string;
  logo_url: string;
  rating_avg: number;
  total_reviews: number;
  slug: string;
}

interface BannerAnnouncement {
  id: string;
  user_name: string;
  badge_name: string;
  custom_message: string;
  banner_image_url: string;
}

export default function Index() {
  console.log('Index page rendering...');
  
  const { isAuthenticated, user } = useAuth();
  const { celebrationBadge, closeCelebration } = useBadgeSystem();
  const [featuredBrands, setFeaturedBrands] = useState<Brand[]>([]);
  const [topCategories, setTopCategories] = useState<any[]>([]);
  const [bannerAnnouncement, setBannerAnnouncement] = useState<BannerAnnouncement | null>(null);
  const [showBanner, setShowBanner] = useState(true);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch featured brands with proper rating calculation
  useEffect(() => {
    const fetchFeaturedBrands = async () => {
      try {
        console.log('Fetching featured brands...');
        
        // First, update brand ratings from actual reviews
        const { error: updateError } = await supabase.rpc('update_brand_ratings');
        if (updateError) {
          console.error('Error updating brand ratings:', updateError);
        }

        const { data, error } = await supabase
          .from('brands')
          .select('brand_id, brand_name, category, logo_url, rating_avg, total_reviews, slug')
          .order('total_reviews', { ascending: false })
          .limit(6);

        if (error) {
          console.error('Error fetching featured brands:', error);
          return;
        }

        console.log('Featured brands fetched:', data?.length || 0);
        setFeaturedBrands(data || []);
      } catch (error) {
        console.error('Exception fetching featured brands:', error);
      }
    };

    fetchFeaturedBrands();
  }, []);

  // Fetch top categories
  useEffect(() => {
    const fetchTopCategories = async () => {
      try {
        console.log('Fetching categories...');
        const { data, error } = await supabase
          .from('brand_categories')
          .select('*')
          .order('brand_count', { ascending: false })
          .limit(8);

        if (error) {
          console.error('Error fetching categories:', error);
          return;
        }

        console.log('Categories fetched:', data?.length || 0);
        setTopCategories(data || []);
      } catch (error) {
        console.error('Exception fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopCategories();
  }, []);

  // Fetch banner announcements
  useEffect(() => {
    const fetchBannerAnnouncements = async () => {
      try {
        console.log('Fetching banner announcements...');
        const { data, error } = await supabase
          .from('banner_announcements')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(1);

        if (error) {
          console.error('Error fetching banner announcements:', error);
          return;
        }

        if (data && data.length > 0) {
          setBannerAnnouncement(data[0]);
        }
      } catch (error) {
        console.error('Exception fetching banner announcements:', error);
      }
    };

    fetchBannerAnnouncements();
  }, []);

  const handleSearchResultSelect = (result: any) => {
    if (result.type === 'brand') {
      window.location.href = `/brand/${result.slug || result.id}`;
    } else if (result.type === 'category') {
      window.location.href = `/category/${result.category}`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Winner Banner */}
      {bannerAnnouncement && showBanner && (
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-4 relative">
          <div className="container mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Trophy className="h-6 w-6" />
              <span className="text-lg font-bold">🎉 Badge Achievement Alert! 🎉</span>
            </div>
            <p className="text-sm md:text-base">
              <strong>{bannerAnnouncement.user_name}</strong> just earned the{" "}
              <strong>{bannerAnnouncement.badge_name}</strong> badge!
            </p>
            {bannerAnnouncement.custom_message && (
              <p className="text-sm mt-1 opacity-90">{bannerAnnouncement.custom_message}</p>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 text-white hover:bg-white/20"
              onClick={() => setShowBanner(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Hero Section with Global Search */}
      <section className="bg-gradient-to-br from-primary/5 to-primary/10 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-primary mb-6">
            Find Trusted Brands &<br />
            Real Customer Reviews
          </h1>
          <p className="text-xl text-primary/80 mb-8 max-w-2xl mx-auto">
            Discover authentic reviews, compare brands, and make informed decisions.
            Join our community and earn badges on your Tropic Trail journey!
          </p>
          
          {/* Global Search */}
          <div className="max-w-2xl mx-auto mb-8">
            <SmartSearch
              placeholder="Search for brands, categories, or products..."
              value={searchQuery}
              onChange={setSearchQuery}
              onResultSelect={handleSearchResultSelect}
              className="bg-white rounded-xl shadow-xl"
            />
          </div>

          <div className="flex flex-col md:flex-row gap-4 justify-center mb-12">
            <Button asChild size="lg" className="text-lg px-8">
              <Link to="/brands">Explore Brands</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8">
              <Link to="/register">Write a Review</Link>
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{featuredBrands.length}+</div>
              <div className="text-primary/70">Trusted Brands</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">
                {featuredBrands.reduce((sum, brand) => sum + brand.total_reviews, 0)}+
              </div>
              <div className="text-primary/70">Customer Reviews</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{topCategories.length}+</div>
              <div className="text-primary/70">Categories</div>
            </div>
          </div>
        </div>
      </section>

      {/* User Dashboard for authenticated users */}
      {isAuthenticated && (
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">Your Dashboard</h2>
            <UserDashboard />
          </div>
        </section>
      )}

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {topCategories.map((category) => (
              <Link 
                key={category.category} 
                to={`/category/${category.category}`}
                className="block"
              >
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-bold text-primary">
                        {category.category.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <h3 className="font-semibold mb-2 text-gray-900 capitalize">
                      {category.category}
                    </h3>
                    <p className="text-sm text-gray-600">{category.brand_count} brands</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Brands Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Brands</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredBrands.map((brand) => (
              <Card key={brand.brand_id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={brand.logo_url}
                      alt={brand.brand_name}
                      className="w-16 h-16 object-contain rounded"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder.svg";
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg truncate">{brand.brand_name}</h3>
                      <Badge variant="secondary" className="mt-1">{brand.category}</Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="font-medium">{brand.rating_avg.toFixed(1)}</span>
                      <span className="text-gray-500 text-sm">({brand.total_reviews} reviews)</span>
                    </div>
                    <Button asChild size="sm">
                      <Link to={`/brand/${brand.slug || brand.brand_id}`}>
                        View Details
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Join the BrandTropic Community</h2>
          <p className="text-xl mb-8 opacity-90">
            Share your experiences, earn badges, and help others make better choices.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            {!isAuthenticated ? (
              <Button asChild size="lg" variant="secondary">
                <Link to="/register">Get Started</Link>
              </Button>
            ) : (
              <Button asChild size="lg" variant="secondary">
                <Link to="/brands">Write Your First Review</Link>
              </Button>
            )}
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
              <Link to="/brands">Explore Brands</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Badge Celebration Modal */}
      {celebrationBadge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-8 max-w-md mx-4">
            <div className="text-center">
              <div className="mb-4">
                <img
                  src={celebrationBadge.icon_unlocked_url}
                  alt={celebrationBadge.name}
                  className="w-20 h-20 mx-auto"
                />
              </div>
              <h3 className="text-2xl font-bold text-primary mb-2">
                🎉 Badge Earned!
              </h3>
              <h4 className="text-lg font-semibold mb-2">{celebrationBadge.name}</h4>
              <p className="text-gray-600 mb-6">{celebrationBadge.description}</p>
              <Button onClick={closeCelebration} className="w-full">
                Awesome!
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
