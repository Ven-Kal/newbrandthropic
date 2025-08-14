
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { PageLayout } from "@/components/layout/page-layout";
import { EnhancedSEOHead } from "@/components/seo/enhanced-seo-head";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Star, Award, MessageSquare, Calendar } from "lucide-react";

interface UserProfile {
  user_id: string;
  name: string;
  total_points: number;
  current_badge_id: string;
  created_at: string;
  badge_name?: string;
  badge_icon?: string;
  review_count: number;
  rating_count: number;
}

export default function UserProfilePage() {
  const { userId } = useParams();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      fetchUserProfile();
    }
  }, [userId]);

  const fetchUserProfile = async () => {
    try {
      // Fetch user basic info
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select(`
          user_id,
          name,
          total_points,
          current_badge_id,
          created_at
        `)
        .eq('user_id', userId)
        .single();

      if (userError) {
        console.error('Error fetching user:', userError);
        toast.error('User not found');
        return;
      }

      // Fetch badge info if user has a current badge
      let badgeData = null;
      if (userData.current_badge_id) {
        const { data: badge, error: badgeError } = await supabase
          .from('badges')
          .select('name, icon_unlocked_url')
          .eq('id', userData.current_badge_id)
          .single();

        if (!badgeError) {
          badgeData = badge;
        }
      }

      // Fetch user stats
      const { data: pointsData, error: pointsError } = await supabase
        .from('user_points')
        .select('action_type')
        .eq('user_id', userId);

      let reviewCount = 0;
      let ratingCount = 0;
      if (!pointsError && pointsData) {
        reviewCount = pointsData.filter(p => p.action_type === 'review').length;
        ratingCount = pointsData.filter(p => p.action_type === 'rating').length;
      }

      setProfile({
        ...userData,
        badge_name: badgeData?.name,
        badge_icon: badgeData?.icon_unlocked_url,
        review_count: reviewCount,
        rating_count: ratingCount
      });

    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center min-h-96">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!profile) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">User Not Found</h1>
            <p className="text-gray-600 mt-2">The requested user profile could not be found.</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  const firstName = profile.name.split(' ')[0];
  const memberSince = new Date(profile.created_at).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long' 
  });

  return (
    <PageLayout>
      <EnhancedSEOHead
        title={`${firstName}'s Profile - Brandthropic`}
        description={`View ${firstName}'s public profile on Brandthropic. See their contributions, badges, and expertise in brand reviews and ratings.`}
        keywords={[
          "user profile",
          "brand reviewer",
          "customer reviews",
          "brandthropic member",
          firstName.toLowerCase()
        ]}
        noIndex={true}
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Profile Header */}
          <Card>
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="" alt={firstName} />
                  <AvatarFallback className="text-2xl font-bold bg-blue-100 text-blue-800">
                    {firstName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{firstName}</h1>
                  
                  {profile.badge_name && (
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                      {profile.badge_icon && (
                        <img 
                          src={profile.badge_icon} 
                          alt={profile.badge_name} 
                          className="w-8 h-8"
                        />
                      )}
                      <Badge variant="secondary" className="text-sm">
                        <Award className="w-4 h-4 mr-1" />
                        {profile.badge_name}
                      </Badge>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-center md:justify-start gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>Member since {memberSince}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                  <Award className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold">Total Points</h3>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-3xl font-bold text-blue-600">{profile.total_points}</p>
                <p className="text-sm text-gray-600">Contribution Points</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
                  <MessageSquare className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold">Reviews Written</h3>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-3xl font-bold text-green-600">{profile.review_count}</p>
                <p className="text-sm text-gray-600">Detailed Reviews</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-2">
                  <Star className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold">Brands Rated</h3>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-3xl font-bold text-orange-600">{profile.rating_count}</p>
                <p className="text-sm text-gray-600">Rating Contributions</p>
              </CardContent>
            </Card>
          </div>

          {/* Expertise Section */}
          <Card>
            <CardHeader>
              <h3 className="text-xl font-semibold">Expertise & Contributions</h3>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Community Impact</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Active community contributor</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Helps others make informed decisions</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span>Provides detailed brand feedback</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Recognition</h4>
                  <p className="text-sm text-gray-700">
                    {firstName} has earned {profile.total_points} points through valuable contributions 
                    to the Brandthropic community, helping other consumers make better brand choices.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}
