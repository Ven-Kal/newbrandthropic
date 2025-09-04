
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Plus, Upload, Search, PencilLine, Download, BookOpen, AlertTriangle } from "lucide-react";
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
import { SEOGuide } from "@/components/admin/seo-guide";
import { EscalationEditor } from "@/components/admin/escalation-editor";
import { Brand } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface EscalationLevel {
  id: string;
  title: string;
  link?: string;
  phone?: string;
  email?: string;
  note?: string;
}

export default function AdminBrandsPage() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [escalationDialogOpen, setEscalationDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [seoGuideOpen, setSeoGuideOpen] = useState(false);
  const [escalationLevels, setEscalationLevels] = useState<EscalationLevel[]>([]);
  
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

  // Handle escalation levels update
  const handleEscalationUpdate = async () => {
    if (!selectedBrand) return;
    
    try {
      const { error } = await supabase
        .from('brands')
        .update({ escalation_levels: escalationLevels })
        .eq('brand_id', selectedBrand.brand_id);
        
      if (error) throw error;
      
      // Update local state
      setBrands(brands.map(brand => 
        brand.brand_id === selectedBrand.brand_id
          ? { ...brand, escalation_levels: escalationLevels }
          : brand
      ));
      
      setEscalationDialogOpen(false);
      toast({
        title: "Escalation levels updated",
        description: "Brand escalation levels have been updated successfully"
      });
      
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message || "There was an error updating the escalation levels",
        variant: "destructive"
      });
    }
  };

  // Open escalation editor
  const openEscalationEditor = (brand: Brand) => {
    setSelectedBrand(brand);
    setEscalationLevels(Array.isArray(brand.escalation_levels) ? brand.escalation_levels : []);
    setEscalationDialogOpen(true);
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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Brand Management</h1>
        <p className="text-gray-600 mt-2">
          Manage brands, upload logos, and optimize SEO settings.
        </p>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
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
            onClick={() => setSeoGuideOpen(true)}
          >
            <BookOpen className="h-4 w-4" />
            SEO Guide
          </Button>
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
              <TableHead>SEO Status</TableHead>
              <TableHead>Escalations</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                  </div>
                  <div className="mt-2 text-sm text-gray-500">Loading brands...</div>
                </TableCell>
              </TableRow>
            ) : filteredBrands.length > 0 ? (
              filteredBrands.map((brand) => {
                const seoScore = [
                  brand.meta_title,
                  brand.meta_description,
                  brand.logo_alt,
                  brand.canonical_url
                ].filter(Boolean).length;

                const escalationCount = Array.isArray(brand.escalation_levels) ? brand.escalation_levels.length : 0;
                
                return (
                  <TableRow key={brand.brand_id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={brand.logo_url || "/placeholder.svg"}
                          alt={brand.logo_alt || `${brand.brand_name} logo`}
                          className="w-8 h-8 object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/placeholder.svg";
                          }}
                        />
                        <span className="font-medium">{brand.brand_name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="capitalize">{brand.category}</TableCell>
                    <TableCell>{Number(brand.rating_avg || 0).toFixed(1)}</TableCell>
                    <TableCell>{brand.total_reviews}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          seoScore >= 3 ? 'bg-green-500' : 
                          seoScore >= 2 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}></div>
                        <span className="text-xs">{seoScore}/4</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          escalationCount > 0 ? 'bg-green-500' : 'bg-gray-300'
                        }`}></div>
                        <span className="text-xs">{escalationCount} levels</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            setSelectedBrand(brand);
                            setEditDialogOpen(true);
                          }}
                          title="Edit Logo"
                        >
                          <PencilLine className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => openEscalationEditor(brand)}
                          title="Manage Escalations"
                        >
                          <AlertTriangle className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                  No brands found matching your search.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* SEO Guide Dialog */}
      <Dialog open={seoGuideOpen} onOpenChange={setSeoGuideOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Complete SEO Implementation Guide</DialogTitle>
            <DialogDescription>
              Step-by-step guide to implement all SEO features and upload files to Google Search Console
            </DialogDescription>
          </DialogHeader>
          
          <SEOGuide />
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setSeoGuideOpen(false)}
            >
              Close Guide
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
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

      {/* Escalation Levels Dialog */}
      <Dialog open={escalationDialogOpen} onOpenChange={setEscalationDialogOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Manage Escalation Levels</DialogTitle>
            <DialogDescription>
              Configure escalation steps for {selectedBrand?.brand_name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <EscalationEditor
              escalationLevels={escalationLevels}
              onEscalationLevelsChange={setEscalationLevels}
            />
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setEscalationDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleEscalationUpdate}
            >
              Save Changes
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
    </div>
  );
}
