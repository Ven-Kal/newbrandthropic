
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

interface DuplicateGroup {
  type: 'name' | 'email' | 'phone' | 'website';
  value: string;
  brands: Array<{
    brand_id: string;
    brand_name: string;
    category: string;
  }>;
}

export function DuplicateDetector() {
  const { data: duplicates = [], isLoading } = useQuery({
    queryKey: ['duplicate-brands'],
    queryFn: async () => {
      const { data: brands, error } = await supabase
        .from('brands')
        .select('brand_id, brand_name, category, support_email, toll_free_number, website_url');
        
      if (error) {
        console.error('Error fetching brands for duplicate detection:', error);
        return [];
      }

      const duplicateGroups: DuplicateGroup[] = [];

      // Group brands by similar names (using Levenshtein distance approximation)
      const nameGroups: { [key: string]: typeof brands } = {};
      brands.forEach(brand => {
        const normalizedName = brand.brand_name.toLowerCase().replace(/[^\w]/g, '');
        if (!nameGroups[normalizedName]) {
          nameGroups[normalizedName] = [];
        }
        nameGroups[normalizedName].push(brand);
      });

      // Find duplicate names
      Object.entries(nameGroups).forEach(([name, groupBrands]) => {
        if (groupBrands.length > 1) {
          duplicateGroups.push({
            type: 'name',
            value: name,
            brands: groupBrands
          });
        }
      });

      // Group by support email
      const emailGroups: { [key: string]: typeof brands } = {};
      brands.forEach(brand => {
        if (brand.support_email) {
          const email = brand.support_email.toLowerCase().trim();
          if (!emailGroups[email]) {
            emailGroups[email] = [];
          }
          emailGroups[email].push(brand);
        }
      });

      Object.entries(emailGroups).forEach(([email, groupBrands]) => {
        if (groupBrands.length > 1) {
          duplicateGroups.push({
            type: 'email',
            value: email,
            brands: groupBrands
          });
        }
      });

      // Group by toll free number
      const phoneGroups: { [key: string]: typeof brands } = {};
      brands.forEach(brand => {
        if (brand.toll_free_number) {
          const phone = brand.toll_free_number.replace(/[^\d]/g, '');
          if (!phoneGroups[phone]) {
            phoneGroups[phone] = [];
          }
          phoneGroups[phone].push(brand);
        }
      });

      Object.entries(phoneGroups).forEach(([phone, groupBrands]) => {
        if (groupBrands.length > 1) {
          duplicateGroups.push({
            type: 'phone',
            value: phone,
            brands: groupBrands
          });
        }
      });

      // Group by website URL
      const websiteGroups: { [key: string]: typeof brands } = {};
      brands.forEach(brand => {
        if (brand.website_url) {
          const website = brand.website_url.toLowerCase().replace(/^https?:\/\//, '').replace(/\/$/, '');
          if (!websiteGroups[website]) {
            websiteGroups[website] = [];
          }
          websiteGroups[website].push(brand);
        }
      });

      Object.entries(websiteGroups).forEach(([website, groupBrands]) => {
        if (groupBrands.length > 1) {
          duplicateGroups.push({
            type: 'website',
            value: website,
            brands: groupBrands
          });
        }
      });

      return duplicateGroups;
    },
  });

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'name': return 'Similar Names';
      case 'email': return 'Same Email';
      case 'phone': return 'Same Phone';
      case 'website': return 'Same Website';
      default: return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'name': return 'bg-yellow-100 text-yellow-800';
      case 'email': return 'bg-red-100 text-red-800';
      case 'phone': return 'bg-orange-100 text-orange-800';
      case 'website': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            Duplicate Detection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Scanning for duplicates...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-yellow-600" />
          Duplicate Detection
          {duplicates.length > 0 && (
            <Badge variant="destructive">{duplicates.length}</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {duplicates.length === 0 ? (
          <p className="text-green-600">No duplicates detected! All brands have unique information.</p>
        ) : (
          <div className="space-y-4">
            {duplicates.map((group, index) => (
              <div key={index} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-center gap-2 mb-3">
                  <Badge className={getTypeColor(group.type)}>
                    {getTypeLabel(group.type)}
                  </Badge>
                  <span className="text-sm text-gray-600">
                    Value: {group.value}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {group.brands.map((brand) => (
                    <div key={brand.brand_id} className="flex items-center justify-between bg-white p-2 rounded border">
                      <div>
                        <div className="font-medium">{brand.brand_name}</div>
                        <div className="text-sm text-gray-500 capitalize">{brand.category}</div>
                      </div>
                      <Link 
                        to={`/brand/${brand.brand_id}`}
                        className="text-blue-600 hover:text-blue-800"
                        target="_blank"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
