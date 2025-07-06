import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { EnhancedSEOHead } from "@/components/seo/enhanced-seo-head";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { PerformanceImage } from "@/components/ui/performance-image";
import { Blog } from "@/types/blog";
import { Clock, Calendar, User, Tag } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { PageLayout } from "@/components/layout/page-layout";

function BlogPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<Blog | null>(null);

  // Fetch blog data by slug
  const { data: blogData, isLoading, error } = useQuery({
    queryKey: ['blog', slug],
    queryFn: async () => {
      if (!slug) return null;
      
      console.log("Fetching blog with slug:", slug);
      
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching blog:', error);
        throw error;
      }
      
      console.log("Blog data found:", data);
      return data as Blog;
    },
    enabled: !!slug,
  });

  useEffect(() => {
    if (blogData) {
      setBlog(blogData);
      window.scrollTo(0, 0);
    } else if (!isLoading && !blogData && slug) {
      navigate('/blog');
    }
  }, [blogData, isLoading, slug, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading blog post...</p>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">Blog Post Not Found</h1>
          <p className="text-gray-600 mb-4">The blog post you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/blog')}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90"
          >
            Browse All Blogs
          </button>
        </div>
      </div>
    );
  }

  const breadcrumbs = [
    { name: "Blog", url: "/blog" },
    { name: blog.title, url: `/blog/${blog.slug}` }
  ];

  return (
    <PageLayout>
      <EnhancedSEOHead 
        title={blog.meta_title || `${blog.title} | Brandthropic Blog`}
        description={blog.meta_description || blog.excerpt}
        keywords={blog.keywords || [blog.category, 'customer service', 'brand insights']}
        breadcrumbs={breadcrumbs}
      />
      
      <main className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Breadcrumbs items={breadcrumbs} />
          
          {/* Blog Header */}
          <div className="mb-8 mt-8">
            <div className="mb-4">
              <Badge variant="secondary" className="mb-4">
                {blog.category}
              </Badge>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {blog.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-8">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>{blog.author_name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>{format(new Date(blog.published_at), 'MMMM d, yyyy')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>{blog.read_time_minutes} min read</span>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div className="aspect-video w-full overflow-hidden rounded-lg mb-8">
            <PerformanceImage
              src={blog.featured_image_url}
              alt={blog.title}
              className="w-full h-full object-cover"
              priority
            />
          </div>

          {/* YouTube Video */}
          {blog.youtube_video_url && (
            <div className="aspect-video w-full mb-8">
              <iframe
                src={blog.youtube_video_url.replace('watch?v=', 'embed/')}
                title={blog.title}
                className="w-full h-full rounded-lg"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}

          {/* Blog Content */}
          <div className="prose prose-lg max-w-none mb-8">
            <div 
              dangerouslySetInnerHTML={{ __html: blog.content }}
              className="text-gray-700 leading-relaxed"
            />
          </div>

          {/* Tags and Tagged Brands */}
          {(blog.tags?.length > 0 || blog.tagged_brands?.length > 0) && (
            <div className="border-t pt-8 mb-8">
              {blog.tags?.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <Tag className="w-4 h-4 text-gray-600" />
                    <span className="font-medium text-gray-900">Tags:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {blog.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {blog.tagged_brands?.length > 0 && (
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="font-medium text-gray-900">Featured Brands:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {blog.tagged_brands.map((brandId, index) => (
                      <Link 
                        key={index}
                        to={`/brand/${brandId}`}
                        className="text-primary hover:underline"
                      >
                        <Badge variant="default" className="text-xs cursor-pointer">
                          View Brand
                        </Badge>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </PageLayout>
  );
}

export default BlogPage;
