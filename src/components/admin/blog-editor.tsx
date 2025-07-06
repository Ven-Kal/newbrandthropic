
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUploader } from "@/components/admin/image-uploader";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { Blog } from "@/types/blog";

interface BlogEditorProps {
  blog?: Blog | null;
  onSave?: () => void;
  onCancel?: () => void;
  onSuccess?: () => void;
}

export function BlogEditor({ blog, onSave, onCancel, onSuccess }: BlogEditorProps) {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [featuredImageUrl, setFeaturedImageUrl] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [currentKeyword, setCurrentKeyword] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load existing blog data when editing
  useEffect(() => {
    if (blog) {
      setTitle(blog.title);
      setSlug(blog.slug);
      setExcerpt(blog.excerpt);
      setContent(blog.content);
      setCategory(blog.category);
      setAuthorName(blog.author_name);
      setFeaturedImageUrl(blog.featured_image_url);
      setYoutubeUrl(blog.youtube_video_url || "");
      setTags(blog.tags || []);
      setMetaTitle(blog.meta_title || "");
      setMetaDescription(blog.meta_description || "");
      setKeywords(blog.keywords || []);
      setIsPublished(blog.is_published);
    }
  }, [blog]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!slug || slug === generateSlug(title)) {
      setSlug(generateSlug(value));
    }
  };

  const addTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const addKeyword = () => {
    if (currentKeyword.trim() && !keywords.includes(currentKeyword.trim())) {
      setKeywords([...keywords, currentKeyword.trim()]);
      setCurrentKeyword("");
    }
  };

  const removeKeyword = (keywordToRemove: string) => {
    setKeywords(keywords.filter(keyword => keyword !== keywordToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !content || !excerpt || !authorName || !category) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const blogData = {
        title,
        slug: slug || generateSlug(title),
        excerpt,
        content,
        category,
        author_name: authorName,
        featured_image_url: featuredImageUrl || '',
        youtube_video_url: youtubeUrl || null,
        tags,
        meta_title: metaTitle || null,
        meta_description: metaDescription || null,
        keywords: keywords.length > 0 ? keywords : null,
        is_published: isPublished,
        published_at: isPublished ? new Date().toISOString() : new Date().toISOString(),
      };

      console.log('Submitting blog data:', blogData);

      let result;
      if (blog) {
        // Update existing blog
        result = await supabase
          .from('blogs')
          .update(blogData)
          .eq('blog_id', blog.blog_id)
          .select()
          .single();
      } else {
        // Create new blog
        result = await supabase
          .from('blogs')
          .insert([blogData])
          .select()
          .single();
      }

      const { data, error } = result;

      if (error) {
        console.error('Error saving blog:', error);
        throw error;
      }

      console.log('Blog saved successfully:', data);
      
      toast.success(`Blog ${isPublished ? 'published' : 'saved as draft'} successfully!`);
      
      // Reset form only if creating new blog
      if (!blog) {
        setTitle("");
        setSlug("");
        setExcerpt("");
        setContent("");
        setCategory("");
        setAuthorName("");
        setFeaturedImageUrl("");
        setYoutubeUrl("");
        setTags([]);
        setMetaTitle("");
        setMetaDescription("");
        setKeywords([]);
        setIsPublished(false);
      }
      
      onSave?.();
      onSuccess?.();
      
    } catch (error: any) {
      console.error('Error saving blog:', error);
      toast.error(error.message || "Failed to save blog");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{blog ? 'Edit Blog Post' : 'Create New Blog Post'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Enter blog title"
                required
              />
            </div>

            <div>
              <Label htmlFor="slug">URL Slug *</Label>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="url-friendly-slug"
                required
              />
            </div>

            <div>
              <Label htmlFor="excerpt">Excerpt *</Label>
              <Textarea
                id="excerpt"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Brief description of the blog post"
                className="h-20"
                required
              />
            </div>

            <div>
              <Label htmlFor="content">Content *</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your blog content here..."
                className="h-40"
                required
              />
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <ImageUploader
              onImageUploaded={setFeaturedImageUrl}
              currentImage={featuredImageUrl}
              label="Featured Image"
            />
          </div>

          {/* Category and Author */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category *</Label>
              <Input
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g., Customer Service, Reviews"
                required
              />
            </div>

            <div>
              <Label htmlFor="author">Author Name *</Label>
              <Input
                id="author"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Author name"
                required
              />
            </div>
          </div>

          {/* Optional YouTube URL */}
          <div>
            <Label htmlFor="youtube">YouTube Video URL (Optional)</Label>
            <Input
              id="youtube"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
            />
          </div>

          {/* Tags */}
          <div>
            <Label>Tags</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                placeholder="Add a tag"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <Button type="button" onClick={addTag} variant="outline">
                Add Tag
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <X 
                    className="w-3 h-3 cursor-pointer" 
                    onClick={() => removeTag(tag)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          {/* SEO Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">SEO Settings</h3>
            
            <div>
              <Label htmlFor="metaTitle">Meta Title</Label>
              <Input
                id="metaTitle"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                placeholder="SEO title for search engines"
              />
            </div>

            <div>
              <Label htmlFor="metaDescription">Meta Description</Label>
              <Textarea
                id="metaDescription"
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                placeholder="SEO description for search engines"
                className="h-20"
              />
            </div>

            <div>
              <Label>Keywords</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={currentKeyword}
                  onChange={(e) => setCurrentKeyword(e.target.value)}
                  placeholder="Add a keyword"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                />
                <Button type="button" onClick={addKeyword} variant="outline">
                  Add Keyword
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {keywords.map((keyword, index) => (
                  <Badge key={index} variant="outline" className="flex items-center gap-1">
                    {keyword}
                    <X 
                      className="w-3 h-3 cursor-pointer" 
                      onClick={() => removeKeyword(keyword)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Publishing Options */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="publish"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="rounded"
            />
            <Label htmlFor="publish">Publish immediately</Label>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4">
            {onCancel && (
              <Button 
                type="button" 
                variant="outline"
                onClick={onCancel}
                className="flex-1"
              >
                Cancel
              </Button>
            )}
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? 'Saving...' : (isPublished ? 'Publish Blog' : 'Save as Draft')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
