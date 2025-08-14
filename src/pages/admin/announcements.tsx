import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Upload, Trophy, Eye, EyeOff } from "lucide-react";

interface Announcement {
  id: string;
  user_name: string;
  badge_name: string;
  custom_message: string | null;
  banner_image_url: string | null;
  is_active: boolean;
  created_at: string;
}

export default function AnnouncementsPage() {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    user_name: '',
    badge_name: '',
    custom_message: '',
    banner_image_url: ''
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const { data, error } = await supabase
        .from('banner_announcements')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAnnouncements(data || []);
    } catch (error) {
      console.error('Error fetching announcements:', error);
      toast.error('Failed to fetch announcements');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `announcements/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('Brand Assets')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('Brand Assets')
        .getPublicUrl(filePath);

      setFormData(prev => ({
        ...prev,
        banner_image_url: data.publicUrl
      }));

      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.user_name || !formData.badge_name) {
      toast.error('Please fill in required fields');
      return;
    }

    try {
      const { error } = await supabase
        .from('banner_announcements')
        .insert({
          user_name: formData.user_name,
          badge_name: formData.badge_name,
          custom_message: formData.custom_message || null,
          banner_image_url: formData.banner_image_url || null,
          is_active: true
        });

      if (error) throw error;

      toast.success('Announcement created successfully');
      setFormData({
        user_name: '',
        badge_name: '',
        custom_message: '',
        banner_image_url: ''
      });
      fetchAnnouncements();
    } catch (error) {
      console.error('Error creating announcement:', error);
      toast.error('Failed to create announcement');
    }
  };

  const toggleAnnouncementStatus = async (id: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('banner_announcements')
        .update({ is_active: !isActive })
        .eq('id', id);

      if (error) throw error;

      toast.success(`Announcement ${!isActive ? 'activated' : 'deactivated'}`);
      fetchAnnouncements();
    } catch (error) {
      console.error('Error toggling announcement:', error);
      toast.error('Failed to update announcement');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Winner Announcements</h1>
        <p className="text-gray-600 mt-2">
          Create and manage winner celebration banners for badge achievements.
        </p>
      </div>

      {/* Create New Announcement */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Create New Announcement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateAnnouncement} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="user_name">Winner Name *</Label>
                <Input
                  id="user_name"
                  value={formData.user_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, user_name: e.target.value }))}
                  placeholder="Enter winner's name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="badge_name">Badge Name *</Label>
                <Input
                  id="badge_name"
                  value={formData.badge_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, badge_name: e.target.value }))}
                  placeholder="e.g., Peak Truth Finder"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="custom_message">Custom Message</Label>
              <Textarea
                id="custom_message"
                value={formData.custom_message}
                onChange={(e) => setFormData(prev => ({ ...prev, custom_message: e.target.value }))}
                placeholder="Add a custom congratulatory message (optional)"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="banner_image">Banner Image (Optional)</Label>
              <div className="mt-2 space-y-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                />
                {uploading && (
                  <p className="text-sm text-gray-500">Uploading image...</p>
                )}
                {formData.banner_image_url && (
                  <div className="mt-2">
                    <img
                      src={formData.banner_image_url}
                      alt="Banner preview"
                      className="w-full max-w-md h-32 object-cover rounded border"
                    />
                  </div>
                )}
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={uploading}>
              <Trophy className="w-4 h-4 mr-2" />
              Create Announcement
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Existing Announcements */}
      <Card>
        <CardHeader>
          <CardTitle>Existing Announcements</CardTitle>
        </CardHeader>
        <CardContent>
          {announcements.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              No announcements created yet.
            </p>
          ) : (
            <div className="space-y-4">
              {announcements.map((announcement) => (
                <div
                  key={announcement.id}
                  className={`p-4 rounded-lg border ${
                    announcement.is_active ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Trophy className="w-4 h-4 text-yellow-500" />
                        <h3 className="font-semibold">
                          {announcement.user_name} earned {announcement.badge_name}
                        </h3>
                        <span className={`text-xs px-2 py-1 rounded ${
                          announcement.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {announcement.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      
                      {announcement.custom_message && (
                        <p className="text-gray-600 mb-2">{announcement.custom_message}</p>
                      )}
                      
                      {announcement.banner_image_url && (
                        <img
                          src={announcement.banner_image_url}
                          alt="Banner"
                          className="w-full max-w-sm h-20 object-cover rounded mt-2"
                        />
                      )}
                      
                      <p className="text-xs text-gray-500 mt-2">
                        Created: {new Date(announcement.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleAnnouncementStatus(announcement.id, announcement.is_active)}
                      className="ml-4"
                    >
                      {announcement.is_active ? (
                        <>
                          <EyeOff className="w-4 h-4 mr-2" />
                          Deactivate
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4 mr-2" />
                          Activate
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
