
import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { Input } from "./input";
import { supabase } from "@/lib/supabase";

interface SearchResult {
  id: string;
  title: string;
  type: 'blog' | 'brand' | 'category';
  slug?: string;
  category?: string;
  excerpt?: string;
}

interface SmartSearchProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onResultSelect?: (result: SearchResult) => void;
  className?: string;
}

export function SmartSearch({
  placeholder = "Search...",
  value,
  onChange,
  onResultSelect,
  className = ""
}: SmartSearchProps) {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Debounced search function
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (value.trim().length >= 2) {
        performSearch(value.trim());
      } else {
        setResults([]);
        setIsOpen(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [value]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const performSearch = async (query: string) => {
    setIsLoading(true);
    try {
      const searchResults: SearchResult[] = [];

      // Search blogs
      const { data: blogs } = await supabase
        .from('blogs')
        .select('blog_id, title, slug, category, excerpt')
        .eq('is_published', true)
        .or(`title.ilike.%${query}%, excerpt.ilike.%${query}%, category.ilike.%${query}%`)
        .limit(5);

      if (blogs) {
        searchResults.push(...blogs.map(blog => ({
          id: blog.blog_id,
          title: blog.title,
          type: 'blog' as const,
          slug: blog.slug,
          category: blog.category,
          excerpt: blog.excerpt
        })));
      }

      // Search brands
      const { data: brands } = await supabase
        .from('brands')
        .select('brand_id, brand_name, slug, category')
        .or(`brand_name.ilike.%${query}%, category.ilike.%${query}%`)
        .limit(5);

      if (brands) {
        searchResults.push(...brands.map(brand => ({
          id: brand.brand_id,
          title: brand.brand_name,
          type: 'brand' as const,
          slug: brand.slug,
          category: brand.category
        })));
      }

      setResults(searchResults);
      setIsOpen(searchResults.length > 0);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
      setIsOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResultClick = (result: SearchResult) => {
    setIsOpen(false);
    onResultSelect?.(result);
  };

  const clearSearch = () => {
    onChange("");
    setResults([]);
    setIsOpen(false);
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-10 pr-10"
          onFocus={() => {
            if (results.length > 0) setIsOpen(true);
          }}
        />
        {value && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">Searching...</div>
          ) : results.length > 0 ? (
            <div className="py-2">
              {results.map((result) => (
                <button
                  key={`${result.type}-${result.id}`}
                  onClick={() => handleResultClick(result)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate">
                        {result.title}
                      </div>
                      {result.excerpt && (
                        <div className="text-sm text-gray-500 mt-1 line-clamp-1">
                          {result.excerpt}
                        </div>
                      )}
                      {result.category && (
                        <div className="text-xs text-gray-400 mt-1">
                          {result.category}
                        </div>
                      )}
                    </div>
                    <div className="ml-2 flex-shrink-0">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        result.type === 'blog' 
                          ? 'bg-blue-100 text-blue-800'
                          : result.type === 'brand'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {result.type}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500">
              No results found for "{value}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}
