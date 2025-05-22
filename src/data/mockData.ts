
import { Brand, BrandCategory, Review, User } from '@/types';

// Mock Users Data
export const mockUsers: User[] = [
  {
    user_id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    is_verified: true,
    role: 'consumer',
    created_at: '2023-01-15T08:30:00Z',
    updated_at: '2023-01-15T08:30:00Z'
  },
  {
    user_id: '2',
    name: 'Admin User',
    email: 'admin@brandthropic.com',
    is_verified: true,
    role: 'admin',
    created_at: '2023-01-10T10:15:00Z',
    updated_at: '2023-01-10T10:15:00Z'
  }
];

// Mock Brands Data
export const mockBrands: Brand[] = [
  {
    brand_id: '1',
    brand_name: 'TeleStar',
    category: 'Telecom',
    logo_url: 'https://placehold.co/200x100/1E3A8A/FFFFFF?text=TeleStar',
    toll_free_number: '1-800-123-4567',
    support_email: 'support@telestar.com',
    website_url: 'https://www.telestar.com',
    complaint_page_url: 'https://www.telestar.com/complaints',
    rating_avg: 4.2,
    total_reviews: 423,
    created_by: '2',
    created_at: '2023-02-20T14:30:00Z',
    updated_at: '2023-02-20T14:30:00Z'
  },
  {
    brand_id: '2',
    brand_name: 'FastNet',
    category: 'Broadband',
    logo_url: 'https://placehold.co/200x100/1E3A8A/FFFFFF?text=FastNet',
    toll_free_number: '1-800-987-6543',
    support_email: 'help@fastnet.com',
    website_url: 'https://www.fastnet.com',
    complaint_page_url: 'https://www.fastnet.com/support/complaints',
    chatbot_url: 'https://www.fastnet.com/chat',
    rating_avg: 3.8,
    total_reviews: 256,
    created_by: '2',
    created_at: '2023-02-10T09:45:00Z',
    updated_at: '2023-02-10T09:45:00Z'
  },
  {
    brand_id: '3',
    brand_name: 'PowerHomes',
    category: 'Utilities',
    logo_url: 'https://placehold.co/200x100/1E3A8A/FFFFFF?text=PowerHomes',
    toll_free_number: '1-800-456-7890',
    support_email: 'care@powerhomes.com',
    website_url: 'https://www.powerhomes.com',
    rating_avg: 4.0,
    total_reviews: 189,
    created_by: '2',
    created_at: '2023-01-25T11:20:00Z',
    updated_at: '2023-01-25T11:20:00Z'
  },
  {
    brand_id: '4',
    brand_name: 'CoolAppliances',
    category: 'Appliances',
    logo_url: 'https://placehold.co/200x100/1E3A8A/FFFFFF?text=CoolAppliances',
    toll_free_number: '1-800-555-9876',
    support_email: 'service@coolappliances.com',
    website_url: 'https://www.coolappliances.com',
    rating_avg: 4.5,
    total_reviews: 312,
    created_by: '2',
    created_at: '2023-03-05T13:10:00Z',
    updated_at: '2023-03-05T13:10:00Z'
  },
  {
    brand_id: '5',
    brand_name: 'GovConnect',
    category: 'Govt IDs',
    logo_url: 'https://placehold.co/200x100/1E3A8A/FFFFFF?text=GovConnect',
    toll_free_number: '1-800-GOV-HELP',
    support_email: 'help@govconnect.gov',
    website_url: 'https://www.govconnect.gov',
    rating_avg: 3.5,
    total_reviews: 478,
    created_by: '2',
    created_at: '2023-02-15T10:00:00Z',
    updated_at: '2023-02-15T10:00:00Z'
  },
  {
    brand_id: '6',
    brand_name: 'SpeedyAutos',
    category: 'Automobiles',
    logo_url: 'https://placehold.co/200x100/1E3A8A/FFFFFF?text=SpeedyAutos',
    toll_free_number: '1-800-CAR-HELP',
    support_email: 'support@speedyautos.com',
    website_url: 'https://www.speedyautos.com',
    rating_avg: 4.3,
    total_reviews: 205,
    created_by: '2',
    created_at: '2023-03-10T14:25:00Z',
    updated_at: '2023-03-10T14:25:00Z'
  },
  {
    brand_id: '7',
    brand_name: 'FuelMaster',
    category: 'Fuel',
    logo_url: 'https://placehold.co/200x100/1E3A8A/FFFFFF?text=FuelMaster',
    toll_free_number: '1-800-FUEL-247',
    support_email: 'care@fuelmaster.com',
    website_url: 'https://www.fuelmaster.com',
    rating_avg: 3.9,
    total_reviews: 167,
    created_by: '2',
    created_at: '2023-02-28T09:15:00Z',
    updated_at: '2023-02-28T09:15:00Z'
  }
];

// Categories
export const brandCategories: BrandCategory[] = [
  'Telecom', 
  'Broadband', 
  'Appliances', 
  'Utilities', 
  'Govt IDs', 
  'Automobiles', 
  'Fuel'
];

// Mock Reviews Data
export const mockReviews: Review[] = [
  {
    review_id: '1',
    user_id: '1',
    brand_id: '1',
    rating: 4,
    category: 'customer service',
    review_text: 'Great customer service experience. The representative was helpful and resolved my issue quickly.',
    status: 'approved',
    created_at: '2023-04-10T15:30:00Z',
    updated_at: '2023-04-10T15:30:00Z'
  },
  {
    review_id: '2',
    user_id: '1',
    brand_id: '2',
    rating: 3,
    category: 'broadband',
    review_text: 'Internet speed is decent but tends to slow down during peak hours.',
    status: 'approved',
    created_at: '2023-04-15T14:20:00Z',
    updated_at: '2023-04-15T14:20:00Z'
  },
  {
    review_id: '3',
    user_id: '1',
    brand_id: '1',
    rating: 5,
    category: 'billing',
    review_text: 'Their billing system is very transparent and accurate. No hidden charges!',
    status: 'approved',
    created_at: '2023-04-20T10:45:00Z',
    updated_at: '2023-04-20T10:45:00Z'
  },
  {
    review_id: '4',
    user_id: '1',
    brand_id: '3',
    rating: 4,
    category: 'billing',
    review_text: 'Bills are easy to understand, and their payment options are convenient.',
    status: 'approved',
    created_at: '2023-04-22T11:30:00Z',
    updated_at: '2023-04-22T11:30:00Z'
  },
  {
    review_id: '5',
    user_id: '1',
    brand_id: '4',
    rating: 5,
    category: 'product quality',
    review_text: 'Purchased a refrigerator that works perfectly. Excellent quality!',
    status: 'approved',
    created_at: '2023-04-25T09:15:00Z',
    updated_at: '2023-04-25T09:15:00Z'
  },
  {
    review_id: '6',
    user_id: '1',
    brand_id: '2',
    rating: 2,
    category: 'customer service',
    review_text: 'Took forever to get through to customer service. Not impressed.',
    status: 'approved',
    created_at: '2023-04-28T16:40:00Z',
    updated_at: '2023-04-28T16:40:00Z'
  }
];
