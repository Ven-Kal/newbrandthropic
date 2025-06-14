
import { useState, useRef, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/lib/supabase";
import { Blog } from "@/types/blog";
import { Brand } from "@/types";
import { toast } from "sonner";
import { X, Tag, Image } from "lucide-react";

interface BlogEditorProps {
  blog?: Blog | null;
  onSave: () => void;
  onCancel: () => void;
}

export function BlogEditor({ blog, onSave, onCancel }: BlogEditorProps) {
  const [formData, setFormData] = useState({
    title: blog?.title || "",
    slug: blog?.slug || "",
    excerpt: blog?.excerpt || "",
    content: blog?.content || "",
    featured_image_url: blog?.featured_image_url || "",
    youtube_video_url: blog?.youtube_video_url || "",
    category: blog?.category || "",
    author_name: blog?.author_name || "",
    meta_title: blog?.meta_title || "",
    meta_description: blog?.meta_description || "",
    read_time_minutes: blog?.read_time_minutes || 5,
    is_published: blog?.is_published || false,
    tags: blog?.tags || [],
    tagged_brands: blog?.tagged_brands || [],
    keywords: blog?.keywords || []
  });

  const [newTag, setNewTag] = useState("");
  const [newKeyword, setNewKeyword] = useState("");
  const [brandSuggestions, setBrandSuggestions] = useState<Brand[]>([]);
  const [showBrandSuggestions, setShowBrandSuggestions] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);
  const contentTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Fetch brands for @ tagging
  const { data: brands = [] } = useQuery({
    queryKey: ['brands-for-tagging'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('brands')
        .select('brand_id, brand_name, slug')
        .order('brand_name');
      
      if (error) throw error;
      return data as Brand[];
    }
  });

  // Auto-generate slug from title
  useEffect(() => {
    if (formData.title && !blog) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
  }, [formData.title, blog]);

  // Handle @ brand tagging in content
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const content = e.target.value;
    const cursorPos = e.target.selectionStart;
    
    setFormData(prev => ({ ...prev, content }));
    setCursorPosition(cursorPos);

    // Check for @ symbol for brand tagging
    const textBeforeCursor = content.substring(0, cursorPos);
    const lastAtIndex = textBeforeCursor.lastIndexOf('@');
    
    if (lastAtIndex !== -1) {
      const textAfterAt = textBeforeCursor.substring(lastAtIndex + 1);
      // Only show suggestions if there's no space after @ and it's the last @ symbol
      if (!textAfterAt.includes(' ') && textAfterAt.length >= 0) {
        const filteredBrands = brands.filter(brand =>
          brand.brand_name.toLowerCase().includes(textAfterAt.toLowerCase())
        );
        setBrandSuggestions(filteredBrands.slice(0, 5));
        setShowBrandSuggestions(true);
      } else {
        setShowBrandSuggestions(false);
      }
    } else {
      setShowBrandSuggestions(false);
    }
  };

  // Insert brand mention
  const insertBrandMention = (brand: Brand) => {
    const content = formData.content;
    const textBeforeCursor = content.substring(0, cursorPosition);
    const textAfterCursor = content.substring(cursorPosition);
    const lastAtIndex = textBeforeCursor.lastIndexOf('@');
    
    if (lastAtIndex !== -1) {
      const beforeAt = content.substring(0, lastAtIndex);
      const brandMention = `@${brand.brand_name}`;
      const newContent = beforeAt + brandMention + textAfterCursor;
      
      setFormData(prev => ({
        ...prev,
        content: newContent,
        tagged_brands: [...new Set([...prev.tagged_brands, brand.brand_name])]
      }));
      
      setShowBrandSuggestions(false);
      
      // Focus back to textarea
      setTimeout(() => {
        if (contentTextareaRef.current) {
          const newPosition = lastAtIndex + brandMention.length;
          contentTextareaRef.current.focus();
          contentTextareaRef.current.setSelectionRange(newPosition, newPosition);
        }
      }, 0);
    }
  };

  // Save blog mutation
  const saveBlogMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const blogData = {
        ...data,
        updated_at: new Date().toISOString(),
        published_at: data.is_published ? new Date().toISOString() : null
      };

      if (blog) {
        // Update existing blog
        const { error } = await supabase
          .from('blogs')
          .update(blogData)
          .eq('blog_id', blog.blog_id);
        
        if (error) throw error;
      } else {
        // Create new blog
        const { error } = await supabase
          .from('blogs')
          .insert([blogData]);
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(blog ? "Blog updated successfully" : "Blog created successfully");
      onSave();
    },
    onError: (error) => {
      console.error('Error saving blog:', error);
      toast.error("Failed to save blog");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.title || !formData.slug || !formData.excerpt || !formData.content || !formData.featured_image_url || !formData.category || !formData.author_name) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    saveBlogMutation.mutate(formData);
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const addKeyword = () => {
    if (newKeyword.trim() && !formData.keywords.includes(newKeyword.trim())) {
      setFormData(prev => ({
        ...prev,
        keywords: [...prev.keywords, newKeyword.trim()]
      }));
      setNewKeyword("");
    }
  };

  const removeKeyword = (keywordToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      keywords: prev.keywords.filter(keyword => keyword !== keywordToRemove)
    }));
  };

  const removeBrandTag = (brandToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tagged_brands: prev.tagged_brands.filter(brand => brand !== brandToRemove)
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Blog Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter blog title..."
                  required
                />
              </div>

              <div>
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="blog-post-url"
                  required
                />
              </div>

              <div>
                <Label htmlFor="excerpt">Excerpt *</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                  placeholder="Brief description of the blog post..."
                  rows={3}
                  required
                />
              </div>

              <div className="relative">
                <Label htmlFor="content">Content * (Use @ to tag brands)</Label>
                <Textarea
                  ref={contentTextareaRef}
                  id="content"
                  value={formData.content}
                  onChange={handleContentChange}
                  placeholder="Write your blog content here... Use @ to mention brands (e.g., @Apple, @Google)"
                  rows={15}
                  required
                />
                
                {/* Brand suggestions dropdown */}
                {showBrandSuggestions && brandSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-40 overflow-y-auto">
                    {brandSuggestions.map((brand) => (
                      <button
                        key={brand.brand_id}
                        type="button"
                        onClick={() => insertBrandMention(brand)}
                        className="w-full px-3 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 border-b last:border-b-0"
                      >
                        <div className="font-medium">{brand.brand_name}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* SEO Settings */}
          <Card>
            <CardHeader>
              <CardTitle>SEO Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="meta_title">Meta Title</Label>
                <Input
                  id="meta_title"
                  value={formData.meta_title}
                  onChange={(e) => setFormData(prev => ({ ...prev, meta_title: e.target.value }))}
                  placeholder="SEO title (max 60 characters)"
                  maxLength={60}
                />
              </div>

              <div>
                <Label htmlFor="meta_description">Meta Description</Label>
                <Textarea
                  id="meta_description"
                  value={formData.meta_description}
                  onChange={(e) => setFormData(prev => ({ ...prev, meta_description: e.target.value }))}
                  placeholder="SEO description (max 160 characters)"
                  maxLength={160}
                  rows={3}
                />
              </div>

              <div>
                <Label>Keywords</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    placeholder="Add SEO keyword..."
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                  />
                  <Button type="button" onClick={addKeyword}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.keywords.map((keyword, index) => (
                    <Badge key={index} variant="outline">
                      {keyword}
                      <X 
                        className="ml-1 w-3 h-3 cursor-pointer" 
                        onClick={() => removeKeyword(keyword)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Publish Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Publish Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_published"
                  checked={formData.is_published}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_published: checked }))}
                />
                <Label htmlFor="is_published">Publish immediately</Label>
              </div>

              <div>
                <Label htmlFor="category">Category *</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  placeholder="e.g., Technology, Reviews"
                  required
                />
              </div>

              <div>
                <Label htmlFor="author_name">Author *</Label>
                <Input
                  id="author_name"
                  value={formData.author_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, author_name: e.target.value }))}
                  placeholder="Author name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="read_time_minutes">Read Time (minutes)</Label>
                <Input
                  id="read_time_minutes"
                  type="number"
                  min="1"
                  value={formData.read_time_minutes}
                  onChange={(e) => setFormData(prev => ({ ...prev, read_time_minutes: parseInt(e.target.value) || 5 }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Media */}
          <Card>
            <CardHeader>
              <CardTitle>Media</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="featured_image_url">Featured Image URL *</Label>
                <Input
                  id="featured_image_url"
                  value={formData.featured_image_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, featured_image_url: e.target.value }))}
                  placeholder="https://example.com/image.jpg"
                  required
                />
                {formData.featured_image_url && (
                  <div className="mt-2">
                    <img 
                      src={formData.featured_image_url} 
                      alt="Featured image preview" 
                      className="w-full h-32 object-cover rounded border"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="youtube_video_url">YouTube Video URL</Label>
                <Input
                  id="youtube_video_url"
                  value={formData.youtube_video_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, youtube_video_url: e.target.value }))}
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Tags & Brands</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Tags</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add tag..."
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  />
                  <Button type="button" onClick={addTag}>
                    <Tag className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                      <X 
                        className="ml-1 w-3 h-3 cursor-pointer" 
                        onClick={() => removeTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label>Tagged Brands</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tagged_brands.map((brand, index) => (
                    <Badge key={index} variant="default">
                      @{brand}
                      <X 
                        className="ml-1 w-3 h-3 cursor-pointer" 
                        onClick={() => removeBrandTag(brand)}
                      />
                    </Badge>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Brands are automatically tagged when you use @ in the content
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button 
              type="submit" 
              disabled={saveBlogMutation.isPending}
              className="flex-1"
            >
              {saveBlogMutation.isPending ? "Saving..." : (blog ? "Update Blog" : "Create Blog")}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
