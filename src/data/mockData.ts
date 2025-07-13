
import { Brand, BrandCategory, Review, User } from '@/types';

// Note: This file now only contains type definitions and initial seed data.
// All actual data should come from the Supabase database.

// Mock Users Data - for reference only, not used in production
export const mockUsers: User[] = [];

// Mock Brands Data - for reference only, not used in production  
export const mockBrands: Brand[] = [];

// Categories - fetched dynamically from database
export const brandCategories: BrandCategory[] = [
  'telecommunications', 
  'internet', 
  'utilities', 
  'retail', 
  'banking', 
  'insurance', 
  'healthcare', 
  'food', 
  'automotive', 
  'technology'
];

// Mock Reviews Data - for reference only, not used in production
export const mockReviews: Review[] = [];
