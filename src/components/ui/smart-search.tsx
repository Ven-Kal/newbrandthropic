
import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { Input } from "./input";
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

interface SearchResult {
  type: 'brand' | 'category';
  id: string;
  name: string;
  category?: string;
  logo_url?: string;
}

interface SmartSearchProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onResultSelect?: (result: SearchResult) => void;
  className?: string;
}

export function SmartSearch({
  placeholder = "Search brands, categories, or products...",
  value,
  onChange,
  onResultSelect,
  className
}: SmartSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  
  // Fetch search results when user types
  const { data: searchResults = [] } = useQuery({
    queryKey: ['search', value],
    queryFn: async () => {
      if (!value || value.length < 2) return [];
      
      const results: SearchResult[] = [];
      
      // Search brands
      const { data: brands } = await supabase
        .from('brands')
        .select('brand_id, brand_name, category, logo_url')
        .ilike('brand_name', `%${value}%`)
        .limit(6);
        
      if (brands) {
        results.push(...brands.map(brand => ({
          type: 'brand' as const,
          id: brand.brand_id,
          name: brand.brand_name,
          category: brand.category,
          logo_url: brand.logo_url
        })));
      }
      
      // Search categories
      const { data: categories } = await supabase
        .from('brand_categories')
        .select('category')
        .ilike('category', `%${value}%`)
        .limit(4);
        
      if (categories) {
        results.push(...categories.map(cat => ({
          type: 'category' as const,
          id: cat.category,
          name: cat.category
        })));
      }
      
      return results;
    },
    enabled: value.length >= 2
  });
  
  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || searchResults.length === 0) return;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < searchResults.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : searchResults.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0) {
          handleResultSelect(searchResults[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  };
  
  const handleResultSelect = (result: SearchResult) => {
    onChange(result.name);
    setIsOpen(false);
    setHighlightedIndex(-1);
    onResultSelect?.(result);
  };
  
  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark class="bg-yellow-200 rounded px-1">$1</mark>');
  };
  
  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder={placeholder}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setIsOpen(true);
            setHighlightedIndex(-1);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          className="pl-10 pr-10 h-12 text-base border-2 border-gray-200 focus:border-primary-500 rounded-xl shadow-sm"
        />
        {value && (
          <button
            onClick={() => {
              onChange('');
              setIsOpen(false);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      
      {isOpen && searchResults.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 z-50 max-h-80 overflow-y-auto">
          {searchResults.map((result, index) => (
            <div
              key={`${result.type}-${result.id}`}
              className={`flex items-center gap-3 p-3 cursor-pointer transition-colors ${
                index === highlightedIndex 
                  ? 'bg-primary-50 border-l-4 border-primary-500' 
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => handleResultSelect(result)}
            >
              {result.type === 'brand' && result.logo_url && (
                <img 
                  src={result.logo_url} 
                  alt={result.name}
                  className="w-8 h-8 object-contain rounded"
                />
              )}
              {result.type === 'category' && (
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center text-white text-xs font-bold">
                  {result.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex-1">
                <div 
                  className="font-medium text-gray-900"
                  dangerouslySetInnerHTML={{ 
                    __html: highlightMatch(result.name, value) 
                  }}
                />
                {result.type === 'brand' && result.category && (
                  <div className="text-sm text-gray-500 capitalize">
                    {result.category}
                  </div>
                )}
                {result.type === 'category' && (
                  <div className="text-sm text-gray-500">
                    Category
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
