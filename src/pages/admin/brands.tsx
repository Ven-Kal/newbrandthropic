
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { AdminLayout } from "@/components/admin/layout";
import { Button } from "@/components/ui/button";
import { Plus, Upload, Search, PencilLine, Download } from "lucide-react";
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
import { CSVImporter } from "@/components/admin/csv-importer";
import { CSVTemplate } from "@/components/admin/csv-template";
import { Brand } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function AdminBrandsPage() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  
  // Fetch brands from Supabase
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
  
  useEffect(() => {
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
  
  // Handler for CSV import success
  const handleImportSuccess = () => {
    setImportDialogOpen(false);
    fetchBrands(); // Refresh brands list
  };
  
  // If not admin, redirect
  if (!isAuthenticated || user?.role !== 'admin') {
    navigate("/login");
    return null;
  }
  
  return (
    <AdminLayout title="Brand Management" active="brands">
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
          <Button 
            size="sm" 
            variant="outline" 
            className="gap-2"
            onClick={() => setTemplateDialogOpen(true)}
          >
            <Download className="h-4 w-4" />
            CSV Template
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="gap-2"
            onClick={() => setImportDialogOpen(true)}
          >
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
      <div className="bg-white border rounded-lg shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Brand</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Reviews</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                  </div>
                  <div className="mt-2 text-sm text-gray-500">Loading brands...</div>
                </TableCell>
              </TableRow>
            ) : filteredBrands.length > 0 ? (
              filteredBrands.map((brand) => (
                <TableRow key={brand.brand_id}>
                  <TableCell>
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
                  </TableCell>
                  <TableCell className="capitalize">{brand.category}</TableCell>
                  <TableCell>{brand.rating_avg.toFixed(1)}</TableCell>
                  <TableCell>{brand.total_reviews}</TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        setSelectedBrand(brand);
                        setEditDialogOpen(true);
                      }}
                    >
                      <PencilLine className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                  No brands found matching your search.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
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
      
      {/* CSV Template Dialog */}
      <Dialog open={templateDialogOpen} onOpenChange={setTemplateDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>CSV Template</DialogTitle>
            <DialogDescription>
              Download a template for bulk brand uploads
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <CSVTemplate />
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setTemplateDialogOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* CSV Import Dialog */}
      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Import Brands from CSV</DialogTitle>
            <DialogDescription>
              Upload a CSV file to import brands to the database
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <CSVImporter onSuccess={handleImportSuccess} />
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setImportDialogOpen(false)}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
