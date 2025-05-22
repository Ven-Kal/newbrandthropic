
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { AdminLayout } from "@/components/admin/layout";
import { Button } from "@/components/ui/button";
import { Plus, Upload, Search, MoreHorizontal, PencilLine } from "lucide-react";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { toast } from "@/components/ui/use-toast";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { LogoUploader } from "@/components/admin/logo-uploader";
import { Brand } from "@/types";

export default function AdminBrandsPage() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  
  // Fetch brands from Supabase
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const { data, error } = await supabase
          .from('brands')
          .select('*')
          .order('brand_name');
          
        if (error) {
          toast({
            title: "Error fetching brands",
            description: error.message,
            variant: "destructive"
          });
          return;
        }
        
        setBrands(data || []);
      } catch (error) {
        console.error('Error fetching brands:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBrands();
  }, []);
  
  // Filter brands based on search
  const filteredBrands = brands.filter(brand => 
    brand.brand_name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Handle logo update
  const handleLogoUpdate = async (logoUrl: string) => {
    if (!selectedBrand) return;
    
    try {
      const { error } = await supabase
        .from('brands')
        .update({ logo_url: logoUrl })
        .eq('brand_id', selectedBrand.brand_id);
        
      if (error) throw error;
      
      // Update local state
      setBrands(brands.map(brand => 
        brand.brand_id === selectedBrand.brand_id
          ? { ...brand, logo_url: logoUrl }
          : brand
      ));
      
      setEditDialogOpen(false);
      toast({
        title: "Brand updated",
        description: "Brand logo has been updated successfully"
      });
      
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message || "There was an error updating the brand",
        variant: "destructive"
      });
    }
  };
  
  // If not admin, redirect
  if (!isAuthenticated || user?.role !== 'admin') {
    navigate("/login");
    return null;
  }
  
  return (
    <AdminLayout title="Manage Brands" active="brands">
      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search brands..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="gap-2">
            <Upload className="h-4 w-4" />
            Import CSV
          </Button>
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Brand
          </Button>
        </div>
      </div>
      
      {/* Brands Table */}
      <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="py-3 px-4 text-left">Brand</th>
                <th className="py-3 px-4 text-left">Category</th>
                <th className="py-3 px-4 text-left">Rating</th>
                <th className="py-3 px-4 text-left">Reviews</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                    </div>
                    <div className="mt-2 text-sm text-gray-500">Loading brands...</div>
                  </td>
                </tr>
              ) : filteredBrands.length > 0 ? (
                filteredBrands.map((brand) => (
                  <tr key={brand.brand_id} className="border-b last:border-0">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={brand.logo_url || "/placeholder.svg"}
                          alt={brand.brand_name}
                          className="w-8 h-8 object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/placeholder.svg";
                          }}
                        />
                        <span className="font-medium">{brand.brand_name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">{brand.category}</td>
                    <td className="py-3 px-4">{brand.rating_avg.toFixed(1)}</td>
                    <td className="py-3 px-4">{brand.total_reviews}</td>
                    <td className="py-3 px-4">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => {
                          setSelectedBrand(brand);
                          setEditDialogOpen(true);
                        }}
                      >
                        <PencilLine className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-gray-500">
                    No brands found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Edit Logo Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Brand Logo</DialogTitle>
            <DialogDescription>
              Upload a new logo for {selectedBrand?.brand_name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            {selectedBrand && (
              <LogoUploader 
                brandId={selectedBrand.brand_id}
                currentLogoUrl={selectedBrand.logo_url}
                onSuccess={handleLogoUpdate}
              />
            )}
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setEditDialogOpen(false)}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
