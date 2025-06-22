
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { Building, PenTool, Search, Save } from "lucide-react";

interface SEOData {
  id: string;
  type: 'brand' | 'blog';
  name: string;
  meta_title?: string;
  meta_description?: string;
  keywords?: string;
  og_image_url?: string;
  canonical_url?: string;
  updated_at?: string;
}

export function SEOManager() {
  const [brands, setBrands] = useState<SEOData[]>([]);
  const [blogs, setBlogs] = useState<SEOData[]>([]);
  const [selectedItem, setSelectedItem] = useState<SEOData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    meta_title: "",
    meta_description: "",
    keywords: "",
    og_image_url: "",
    canonical_url: ""
  });

  // Fetch brands and blogs
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch brands
        const { data: brandsData, error: brandsError } = await supabase
          .from('brands')
          .select('brand_id, brand_name, meta_title, meta_description, keywords, og_image_url, canonical_url, updated_at');

        if (brandsError) throw brandsError;

        const formattedBrands: SEOData[] = (brandsData || []).map(brand => ({
          id: brand.brand_id,
          type: 'brand' as const,
          name: brand.brand_name,
          meta_title: brand.meta_title,
          meta_description: brand.meta_description,
          keywords: brand.keywords,
          og_image_url: brand.og_image_url,
          canonical_url: brand.canonical_url,
          updated_at: brand.updated_at
        }));

        setBrands(formattedBrands);

        // Fetch blogs
        const { data: blogsData, error: blogsError } = await supabase
          .from('blogs')
          .select('blog_id, title, meta_title, meta_description, keywords, og_image_url, canonical_url, updated_at');

        if (blogsError) throw blogsError;

        const formattedBlogs: SEOData[] = (blogsData || []).map(blog => ({
          id: blog.blog_id,
          type: 'blog' as const,
          name: blog.title,
          meta_title: blog.meta_title,
          meta_description: blog.meta_description,
          keywords: blog.keywords,
          og_image_url: blog.og_image_url,
          canonical_url: blog.canonical_url,
          updated_at: blog.updated_at
        }));

        setBlogs(formattedBlogs);
      } catch (error) {
        console.error('Error fetching SEO data:', error);
        toast({
          title: "Error",
          description: "Failed to load SEO data",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  // Handle item selection
  const handleSelectItem = (item: SEOData) => {
    setSelectedItem(item);
    setFormData({
      meta_title: item.meta_title || "",
      meta_description: item.meta_description || "",
      keywords: item.keywords || "",
      og_image_url: item.og_image_url || "",
      canonical_url: item.canonical_url || ""
    });
  };

  // Handle form submission
  const handleSave = async () => {
    if (!selectedItem) return;

    setSaving(true);
    try {
      const updateData = {
        meta_title: formData.meta_title,
        meta_description: formData.meta_description,
        keywords: formData.keywords,
        og_image_url: formData.og_image_url,
        canonical_url: formData.canonical_url,
        updated_at: new Date().toISOString()
      };

      const tableName = selectedItem.type === 'brand' ? 'brands' : 'blogs';
      const idField = selectedItem.type === 'brand' ? 'brand_id' : 'blog_id';

      const { error } = await supabase
        .from(tableName)
        .update(updateData)
        .eq(idField, selectedItem.id);

      if (error) throw error;

      // Update local state
      const updatedItem = { ...selectedItem, ...updateData };
      if (selectedItem.type === 'brand') {
        setBrands(prev => prev.map(b => b.id === selectedItem.id ? updatedItem : b));
      } else {
        setBlogs(prev => prev.map(b => b.id === selectedItem.id ? updatedItem : b));
      }

      setSelectedItem(updatedItem);

      toast({
        title: "Success",
        description: "SEO settings updated successfully"
      });
    } catch (error) {
      console.error('Error saving SEO data:', error);
      toast({
        title: "Error",
        description: "Failed to update SEO settings",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  // Filter items based on search
  const filteredBrands = brands.filter(brand =>
    brand.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredBlogs = blogs.filter(blog =>
    blog.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Item List */}
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              SEO Items
            </CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="brands" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="brands" className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  Brands
                </TabsTrigger>
                <TabsTrigger value="blogs" className="flex items-center gap-2">
                  <PenTool className="h-4 w-4" />
                  Blogs
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="brands" className="space-y-2 mt-4">
                {filteredBrands.map((brand) => (
                  <div
                    key={brand.id}
                    onClick={() => handleSelectItem(brand)}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedItem?.id === brand.id
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{brand.name}</p>
                        <div className="flex gap-1 mt-1">
                          {brand.meta_title && <Badge variant="secondary" className="text-xs">Title</Badge>}
                          {brand.meta_description && <Badge variant="secondary" className="text-xs">Desc</Badge>}
                          {brand.og_image_url && <Badge variant="secondary" className="text-xs">OG</Badge>}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {filteredBrands.length === 0 && (
                  <p className="text-center text-gray-500 py-4">No brands found</p>
                )}
              </TabsContent>
              
              <TabsContent value="blogs" className="space-y-2 mt-4">
                {filteredBlogs.map((blog) => (
                  <div
                    key={blog.id}
                    onClick={() => handleSelectItem(blog)}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedItem?.id === blog.id
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{blog.name}</p>
                        <div className="flex gap-1 mt-1">
                          {blog.meta_title && <Badge variant="secondary" className="text-xs">Title</Badge>}
                          {blog.meta_description && <Badge variant="secondary" className="text-xs">Desc</Badge>}
                          {blog.og_image_url && <Badge variant="secondary" className="text-xs">OG</Badge>}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {filteredBlogs.length === 0 && (
                  <p className="text-center text-gray-500 py-4">No blogs found</p>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* SEO Editor */}
      <div className="lg:col-span-2">
        {selectedItem ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>SEO Settings for "{selectedItem.name}"</span>
                <Badge variant={selectedItem.type === 'brand' ? 'default' : 'secondary'}>
                  {selectedItem.type}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="meta_title">Meta Title</Label>
                <Input
                  id="meta_title"
                  value={formData.meta_title}
                  onChange={(e) => setFormData(prev => ({ ...prev, meta_title: e.target.value }))}
                  placeholder="Enter meta title..."
                  maxLength={60}
                />
                <p className="text-xs text-gray-500">
                  {formData.meta_title.length}/60 characters
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="meta_description">Meta Description</Label>
                <Textarea
                  id="meta_description"
                  value={formData.meta_description}
                  onChange={(e) => setFormData(prev => ({ ...prev, meta_description: e.target.value }))}
                  placeholder="Enter meta description..."
                  rows={3}
                  maxLength={160}
                />
                <p className="text-xs text-gray-500">
                  {formData.meta_description.length}/160 characters
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="keywords">Keywords</Label>
                <Input
                  id="keywords"
                  value={formData.keywords}
                  onChange={(e) => setFormData(prev => ({ ...prev, keywords: e.target.value }))}
                  placeholder="keyword1, keyword2, keyword3..."
                />
                <p className="text-xs text-gray-500">
                  Separate keywords with commas
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="og_image_url">Open Graph Image URL</Label>
                <Input
                  id="og_image_url"
                  type="url"
                  value={formData.og_image_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, og_image_url: e.target.value }))}
                  placeholder="https://example.com/image.jpg"
                />
                <p className="text-xs text-gray-500">
                  Recommended size: 1200x630 pixels
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="canonical_url">Canonical URL</Label>
                <Input
                  id="canonical_url"
                  type="url"
                  value={formData.canonical_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, canonical_url: e.target.value }))}
                  placeholder="https://brandthropic.com/page-url"
                />
                <p className="text-xs text-gray-500">
                  Full URL to prevent duplicate content issues
                </p>
              </div>

              <Button 
                onClick={handleSave} 
                disabled={saving}
                className="w-full"
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Saving..." : "Save SEO Settings"}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="flex items-center justify-center h-64">
              <div className="text-center">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Select a brand or blog to edit SEO settings</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
