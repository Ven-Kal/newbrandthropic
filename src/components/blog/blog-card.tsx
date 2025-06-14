
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PerformanceImage } from "@/components/ui/performance-image";
import { Link } from "react-router-dom";
import { Clock, Calendar } from "lucide-react";
import { Blog } from "@/types/blog";
import { format } from "date-fns";

interface BlogCardProps {
  blog: Blog;
}

export function BlogCard({ blog }: BlogCardProps) {
  return (
    <Link to={`/blog/${blog.slug}`} onClick={() => window.scrollTo(0, 0)}>
      <Card className="group hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer h-full flex flex-col overflow-hidden">
        {/* Featured Image */}
        <div className="aspect-video w-full overflow-hidden">
          <PerformanceImage
            src={blog.featured_image_url}
            alt={blog.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>

        <CardContent className="p-6 flex-grow flex flex-col">
          {/* Category Badge */}
          <div className="mb-3">
            <Badge variant="secondary" className="text-xs">
              {blog.category}
            </Badge>
          </div>

          {/* Title */}
          <h3 className="font-semibold text-lg text-gray-900 mb-3 group-hover:text-primary transition-colors line-clamp-2">
            {blog.title}
          </h3>

          {/* Excerpt */}
          <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
            {blog.excerpt}
          </p>

          {/* Meta Info */}
          <div className="flex items-center justify-between text-xs text-gray-500 mt-auto">
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{blog.read_time_minutes} min read</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="w-3 h-3" />
              <span>{format(new Date(blog.published_at), 'MMM d, yyyy')}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
