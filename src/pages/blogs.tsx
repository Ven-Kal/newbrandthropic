
import { useState } from "react";
import { BlogCard } from "@/components/blog/blog-card";
import { SmartSearch } from "@/components/ui/smart-search";
import { EnhancedSEOHead } from "@/components/seo/enhanced-seo-head";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { PageHeader } from "@/components/seo/page-header";
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Blog } from "@/types/blog";

function BlogsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const navigate = useNavigate();

  // Fetch blogs from Supabase
  const { data: blogs = [], isLoading } = useQuery({
    queryKey: ['blogs'],
    queryFn: async () => {
      console.log("Fetching blogs...");
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('is_published', true)
        .order('published_at', { ascending: false });
        
      if (error) {
        console.error('Error fetching blogs:', error);
        return [];
      }
      
      console.log("Fetched blogs:", data?.length || 0);
      return data as Blog[] || [];
    },
  });

  // Fetch blog categories
  const { data: categories = [] } = useQuery({
    queryKey: ['blog-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_categories')
        .select('*')
        .order('category');
        
      if (error) {
        console.error('Error fetching blog categories:', error);
        return [];
      }
      
      return data || [];
    },
  });

  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch = blog.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase()) ||
      blog.excerpt
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || blog.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  const handleSearchResultSelect = (result: any) => {
    if (result.type === 'blog') {
      navigate(`/blog/${result.slug}`);
    } else if (result.type === 'category') {
      setSelectedCategory(result.name);
    }
  };

  const breadcrumbs = [
    { name: "Blog", url: "/blog" }
  ];

  return (
    <>
      <EnhancedSEOHead 
        title="Blog - Insights & Customer Service Tips | Brandthropic"
        description="Read the latest insights about customer service, brand reviews, and consumer tips. Stay informed with our expert articles and industry updates."
        keywords={["customer service blog", "brand insights", "consumer tips", "customer support articles"]}
        breadcrumbs={breadcrumbs}
      />
      
      <main className="min-h-screen bg-white">
        <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-4xl mx-auto text-center">
              <div className="mb-8">
                <PageHeader 
                  title="Blog & Insights"
                  description="Stay updated with the latest customer service insights and brand stories"
                  className="text-white"
                />
              </div>
              
              <div className="max-w-2xl mx-auto">
                <SmartSearch
                  placeholder="Search blogs, topics, or categories..."
                  value={searchQuery}
                  onChange={setSearchQuery}
                  onResultSelect={handleSearchResultSelect}
                  className="bg-white rounded-xl shadow-xl"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
              Browse by Category
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 max-w-6xl mx-auto">
              <button
                onClick={() => handleCategorySelect("all")}
                className={`group p-6 rounded-xl text-center transition-all duration-300 transform hover:scale-105 ${
                  selectedCategory === "all"
                    ? "bg-primary text-white shadow-lg"
                    : "bg-white hover:bg-gray-100 border border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-secondary flex items-center justify-center">
                  <span className="text-white font-bold text-lg">All</span>
                </div>
                <span className="font-semibold">All Posts</span>
              </button>
              
              {categories.map((cat) => (
                <button
                  key={cat.category}
                  onClick={() => handleCategorySelect(cat.category)}
                  className={`group p-6 rounded-xl text-center transition-all duration-300 transform hover:scale-105 ${
                    selectedCategory === cat.category
                      ? "bg-primary text-white shadow-lg"
                      : "bg-white hover:bg-gray-100 border border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-accent flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {cat.category.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="font-semibold capitalize">{cat.category}</span>
                  <div className={`text-xs mt-1 ${selectedCategory === cat.category ? 'text-white/80' : 'text-gray-500'}`}>
                    ({cat.blog_count})
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <Breadcrumbs items={breadcrumbs} />
            
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
              {searchQuery
                ? `Search Results for "${searchQuery}"`
                : selectedCategory !== "all"
                ? `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Posts`
                : "Latest Posts"}
            </h2>
            
            {isLoading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <p className="text-lg text-gray-500 mt-4">Loading blogs...</p>
              </div>
            ) : filteredBlogs.length === 0 ? (
              <div className="text-center py-12">
                <div className="max-w-md mx-auto">
                  <div className="w-24 h-24 mx-auto mb-6 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-4xl">📝</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No blogs found</h3>
                  <p className="text-gray-500">
                    Try adjusting your search or category filter.
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {filteredBlogs.map((blog, index) => (
                  <div 
                    key={blog.blog_id} 
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <BlogCard blog={blog} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}

export default BlogsPage;
