
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminLayout } from "@/components/admin/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Blog } from "@/types/blog";
import { format } from "date-fns";
import { BlogEditor } from "@/components/admin/blog-editor";
import { toast } from "sonner";

export default function AdminBlogs() {
  const [isCreating, setIsCreating] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");
  
  const queryClient = useQueryClient();

  // Fetch blogs
  const { data: blogs = [], isLoading } = useQuery({
    queryKey: ['admin-blogs', searchTerm, statusFilter],
    queryFn: async () => {
      let query = supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,author_name.ilike.%${searchTerm}%`);
      }

      if (statusFilter !== 'all') {
        query = query.eq('is_published', statusFilter === 'published');
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Blog[];
    }
  });

  // Toggle publish status
  const togglePublishMutation = useMutation({
    mutationFn: async ({ blogId, isPublished }: { blogId: string; isPublished: boolean }) => {
      const { error } = await supabase
        .from('blogs')
        .update({ 
          is_published: !isPublished,
          published_at: !isPublished ? new Date().toISOString() : null 
        })
        .eq('blog_id', blogId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blogs'] });
      toast.success("Blog status updated successfully");
    },
    onError: (error) => {
      console.error('Error updating blog status:', error);
      toast.error("Failed to update blog status");
    }
  });

  // Delete blog
  const deleteBlogMutation = useMutation({
    mutationFn: async (blogId: string) => {
      const { error } = await supabase
        .from('blogs')
        .delete()
        .eq('blog_id', blogId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blogs'] });
      toast.success("Blog deleted successfully");
    },
    onError: (error) => {
      console.error('Error deleting blog:', error);
      toast.error("Failed to delete blog");
    }
  });

  const handleTogglePublish = (blog: Blog) => {
    togglePublishMutation.mutate({ 
      blogId: blog.blog_id, 
      isPublished: blog.is_published 
    });
  };

  const handleDeleteBlog = (blogId: string) => {
    if (confirm("Are you sure you want to delete this blog? This action cannot be undone.")) {
      deleteBlogMutation.mutate(blogId);
    }
  };

  const handleBlogSaved = () => {
    setIsCreating(false);
    setEditingBlog(null);
    queryClient.invalidateQueries({ queryKey: ['admin-blogs'] });
  };

  if (isCreating || editingBlog) {
    return (
      <AdminLayout title={isCreating ? "Create New Blog" : "Edit Blog"} active="blogs">
        <div className="mb-4">
          <Button 
            variant="outline" 
            onClick={() => {
              setIsCreating(false);
              setEditingBlog(null);
            }}
          >
            ← Back to Blogs
          </Button>
        </div>
        <BlogEditor 
          blog={editingBlog} 
          onSave={handleBlogSaved}
          onCancel={() => {
            setIsCreating(false);
            setEditingBlog(null);
          }}
        />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Blog Management" active="blogs">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex justify-between items-center">
          <div className="flex gap-4 items-center">
            <Input
              placeholder="Search blogs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
            />
            <Tabs value={statusFilter} onValueChange={(value) => setStatusFilter(value as any)}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="published">Published</TabsTrigger>
                <TabsTrigger value="draft">Drafts</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <Button onClick={() => setIsCreating(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Blog
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Blogs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{blogs.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Published</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {blogs.filter(blog => blog.is_published).length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Drafts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {blogs.filter(blog => !blog.is_published).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Blogs Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Blogs</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Loading blogs...</div>
            ) : blogs.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No blogs found. Create your first blog to get started.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Published</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {blogs.map((blog) => (
                    <TableRow key={blog.blog_id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{blog.title}</div>
                          <div className="text-sm text-gray-500 truncate max-w-[200px]">
                            {blog.excerpt}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{blog.author_name}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{blog.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={blog.is_published ? "default" : "secondary"}>
                          {blog.is_published ? "Published" : "Draft"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {blog.is_published && blog.published_at
                          ? format(new Date(blog.published_at), 'MMM d, yyyy')
                          : '-'
                        }
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleTogglePublish(blog)}
                          >
                            {blog.is_published ? 
                              <EyeOff className="w-4 h-4" /> : 
                              <Eye className="w-4 h-4" />
                            }
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingBlog(blog)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteBlog(blog.blog_id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
