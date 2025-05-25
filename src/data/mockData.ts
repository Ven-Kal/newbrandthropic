
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
    category: 'telecommunications',
    logo_url: 'https://placehold.co/200x100/1E3A8A/FFFFFF?text=TeleStar',
    toll_free_number: '1-800-123-4567',
    support_email: 'support@telestar.com',
    website_url: 'https://www.telestar.com',
    complaint_page_url: 'https://www.telestar.com/complaints',
    legal_entity_name: 'TeleStar Communications Pvt Ltd',
    holding_company_name: 'TeleCorp Holdings',
    top_products: 'Mobile Plans, Internet Services, Business Solutions',
    company_notes: 'Leading telecommunications provider with 24/7 customer support and nationwide coverage.',
    special_tags: 'featured,reliable',
    rating_avg: 4.2,
    total_reviews: 423,
    created_by: '2',
    created_at: '2023-02-20T14:30:00Z',
    updated_at: '2023-02-20T14:30:00Z'
  },
  {
    brand_id: '2',
    brand_name: 'FastNet',
    category: 'internet',
    logo_url: 'https://placehold.co/200x100/1E3A8A/FFFFFF?text=FastNet',
    toll_free_number: '1-800-987-6543',
    support_email: 'help@fastnet.com',
    website_url: 'https://www.fastnet.com',
    complaint_page_url: 'https://www.fastnet.com/support/complaints',
    chatbot_url: 'https://www.fastnet.com/chat',
    legal_entity_name: 'FastNet Internet Services Ltd',
    holding_company_name: 'Digital Connect Group',
    top_products: 'High-Speed Internet, WiFi Solutions, Enterprise Connectivity',
    company_notes: 'Premium internet service provider offering ultra-fast broadband connections across major cities.',
    special_tags: 'shark tank,fast',
    rating_avg: 3.8,
    total_reviews: 256,
    created_by: '2',
    created_at: '2023-02-10T09:45:00Z',
    updated_at: '2023-02-10T09:45:00Z'
  },
  {
    brand_id: '3',
    brand_name: 'PowerHomes',
    category: 'utilities',
    logo_url: 'https://placehold.co/200x100/1E3A8A/FFFFFF?text=PowerHomes',
    toll_free_number: '1-800-456-7890',
    support_email: 'care@powerhomes.com',
    website_url: 'https://www.powerhomes.com',
    legal_entity_name: 'PowerHomes Utilities Ltd',
    holding_company_name: 'Energy Solutions Group',
    top_products: 'Electricity, Gas Supply, Solar Solutions',
    company_notes: 'Reliable utility services provider with focus on renewable energy solutions.',
    special_tags: 'green,sustainable',
    rating_avg: 4.0,
    total_reviews: 189,
    created_by: '2',
    created_at: '2023-01-25T11:20:00Z',
    updated_at: '2023-01-25T11:20:00Z'
  },
  {
    brand_id: '4',
    brand_name: 'CoolAppliances',
    category: 'retail',
    logo_url: 'https://placehold.co/200x100/1E3A8A/FFFFFF?text=CoolAppliances',
    toll_free_number: '1-800-555-9876',
    support_email: 'service@coolappliances.com',
    website_url: 'https://www.coolappliances.com',
    legal_entity_name: 'Cool Appliances Retail Pvt Ltd',
    holding_company_name: 'Home Solutions Corp',
    top_products: 'Refrigerators, Washing Machines, Air Conditioners, Kitchen Appliances',
    company_notes: 'Leading appliance retailer offering wide range of home and kitchen appliances with excellent after-sales service.',
    special_tags: 'popular,warranty',
    rating_avg: 4.5,
    total_reviews: 312,
    created_by: '2',
    created_at: '2023-03-05T13:10:00Z',
    updated_at: '2023-03-05T13:10:00Z'
  },
  {
    brand_id: '5',
    brand_name: 'GovConnect',
    category: 'technology',
    logo_url: 'https://placehold.co/200x100/1E3A8A/FFFFFF?text=GovConnect',
    toll_free_number: '1-800-GOV-HELP',
    support_email: 'help@govconnect.gov',
    website_url: 'https://www.govconnect.gov',
    legal_entity_name: 'Government Connect Services',
    holding_company_name: 'Digital India Initiative',
    top_products: 'Digital ID Services, Online Documentation, e-Governance Solutions',
    company_notes: 'Government digital services platform providing easy access to various government services and documentation.',
    special_tags: 'government,digital',
    rating_avg: 3.5,
    total_reviews: 478,
    created_by: '2',
    created_at: '2023-02-15T10:00:00Z',
    updated_at: '2023-02-15T10:00:00Z'
  },
  {
    brand_id: '6',
    brand_name: 'SpeedyAutos',
    category: 'automotive',
    logo_url: 'https://placehold.co/200x100/1E3A8A/FFFFFF?text=SpeedyAutos',
    toll_free_number: '1-800-CAR-HELP',
    support_email: 'support@speedyautos.com',
    website_url: 'https://www.speedyautos.com',
    legal_entity_name: 'Speedy Automobiles Ltd',
    holding_company_name: 'Auto Group International',
    top_products: 'Car Sales, Auto Financing, Vehicle Insurance, Maintenance Services',
    company_notes: 'Full-service automotive company providing cars, financing, insurance and maintenance under one roof.',
    special_tags: 'trusted,comprehensive',
    rating_avg: 4.3,
    total_reviews: 205,
    created_by: '2',
    created_at: '2023-03-10T14:25:00Z',
    updated_at: '2023-03-10T14:25:00Z'
  },
  {
    brand_id: '7',
    brand_name: 'FuelMaster',
    category: 'automotive',
    logo_url: 'https://placehold.co/200x100/1E3A8A/FFFFFF?text=FuelMaster',
    toll_free_number: '1-800-FUEL-247',
    support_email: 'care@fuelmaster.com',
    website_url: 'https://www.fuelmaster.com',
    legal_entity_name: 'FuelMaster Energy Solutions',
    holding_company_name: 'Energy Retail Group',
    top_products: 'Petrol, Diesel, CNG, Electric Charging, Lubricants',
    company_notes: 'Leading fuel retail chain with modern stations and multiple fuel options including electric charging.',
    special_tags: 'eco-friendly,24x7',
    rating_avg: 3.9,
    total_reviews: 167,
    created_by: '2',
    created_at: '2023-02-28T09:15:00Z',
    updated_at: '2023-02-28T09:15:00Z'
  }
];

// Categories - now flexible, will be fetched from database
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
