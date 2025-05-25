
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, AlertCircle, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface CSVImporterProps {
  onSuccess?: () => void;
}

export function CSVImporter({ onSuccess }: CSVImporterProps) {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [parsedRecords, setParsedRecords] = useState<any[]>([]);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'parsing' | 'ready' | 'uploading' | 'success' | 'error'>('idle');

  const validateRecord = (record: any) => {
    const errors = [];
    
    // Required fields validation
    if (!record.brand_name?.trim()) errors.push('Brand name is required');
    if (!record.category?.trim()) errors.push('Category is required');
    
    // Category validation
    const validCategories = ['telecommunications', 'internet', 'utilities', 'retail', 'banking', 'insurance', 'healthcare', 'food', 'automotive', 'technology'];
    if (record.category && !validCategories.includes(record.category.toLowerCase())) {
      errors.push(`Invalid category: ${record.category}`);
    }
    
    // URL validation
    const urlFields = ['logo_url', 'website_url', 'complaint_page_url', 'chatbot_url', 'grievance_portal_url'];
    urlFields.forEach(field => {
      if (record[field] && !record[field].startsWith('http')) {
        errors.push(`${field} must start with http:// or https://`);
      }
    });
    
    // Company notes length validation
    if (record.company_notes && record.company_notes.length > 300) {
      errors.push('Company notes must be 300 characters or less');
    }
    
    return errors;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploadStatus('parsing');
    
    if (!file.name.endsWith('.csv')) {
      toast({
        title: "Invalid file type",
        description: "Please upload a CSV file",
        variant: "destructive"
      });
      setUploadStatus('idle');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const csv = event.target?.result as string;
        const lines = csv.split('\n').filter(line => line.trim());
        
        if (lines.length < 2) {
          throw new Error('CSV file must contain headers and at least one data row');
        }
        
        const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
        const records = [];
        const validationErrors = [];
        
        for (let i = 1; i < lines.length; i++) {
          if (!lines[i].trim()) continue;
          
          // Parse CSV line handling quoted values
          const values = [];
          let current = '';
          let inQuotes = false;
          
          for (let j = 0; j < lines[i].length; j++) {
            const char = lines[i][j];
            if (char === '"') {
              inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
              values.push(current.trim());
              current = '';
            } else {
              current += char;
            }
          }
          values.push(current.trim());
          
          const record: Record<string, any> = {};
          headers.forEach((header, index) => {
            record[header] = values[index] || '';
          });
          
          // Validate record
          const errors = validateRecord(record);
          if (errors.length > 0) {
            validationErrors.push(`Row ${i + 1}: ${errors.join(', ')}`);
          } else {
            records.push(record);
          }
        }
        
        if (validationErrors.length > 0) {
          toast({
            title: "Validation Errors",
            description: `${validationErrors.length} rows have errors. Please fix them and try again.`,
            variant: "destructive"
          });
          console.error('Validation errors:', validationErrors);
          setUploadStatus('error');
          return;
        }
        
        setParsedRecords(records);
        setUploadStatus('ready');
        
        toast({
          title: "CSV Parsed Successfully",
          description: `${records.length} valid records found. Click "Import to Database" to continue.`,
        });
      } catch (error) {
        console.error("Error parsing CSV:", error);
        toast({
          title: "Error Parsing CSV",
          description: error instanceof Error ? error.message : "Please check the CSV format and try again",
          variant: "destructive"
        });
        setUploadStatus('error');
      }
    };
    
    reader.readAsText(file);
  };
  
  const handleImport = async () => {
    if (parsedRecords.length === 0) return;
    
    setIsUploading(true);
    setUploadStatus('uploading');
    
    try {
      const brands = parsedRecords.map(record => ({
        brand_name: record.brand_name,
        category: record.category.toLowerCase(),
        logo_url: record.logo_url || "https://via.placeholder.com/150",
        website_url: record.website_url || null,
        support_email: record.support_email || null,
        toll_free_number: record.toll_free_number || null,
        complaint_page_url: record.complaint_page_url || null,
        chatbot_url: record.chatbot_url || null,
        grievance_portal_url: record.grievance_portal_url || null,
        instagram_url: record.instagram_url || null,
        linkedin_url: record.linkedin_url || null,
        facebook_url: record.facebook_url || null,
        twitter_url: record.twitter_url || null,
        legal_entity_name: record.legal_entity_name || null,
        holding_company_name: record.holding_company_name || null,
        top_products: record.top_products || null,
        company_notes: record.company_notes || null,
        special_tags: record.special_tags || null,
        rating_avg: 0,
        total_reviews: 0
      }));
      
      const { data, error } = await supabase
        .from('brands')
        .upsert(brands, { onConflict: 'brand_name' })
        .select();
        
      if (error) throw error;
      
      toast({
        title: "Import Successful",
        description: `${data.length} brands have been imported successfully.`,
      });
      
      setUploadStatus('success');
      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error("Error importing brands:", error);
      toast({
        title: "Import Failed",
        description: error.message || "An error occurred during import",
        variant: "destructive"
      });
      setUploadStatus('error');
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2">
        <h3 className="text-lg font-medium">Standard Brands CSV Importer</h3>
        <p className="text-sm text-muted-foreground">
          Import brands using the standardized CSV template. Ensure your file follows the template format exactly.
        </p>
      </div>
      
      <div className="border rounded-md p-6 bg-gray-50">
        {uploadStatus === 'idle' || uploadStatus === 'error' ? (
          <div className="flex flex-col items-center justify-center space-y-4">
            <Input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="max-w-sm"
              disabled={isUploading}
            />
            <p className="text-sm text-muted-foreground text-center">
              Upload a CSV file following the standard template format
            </p>
          </div>
        ) : uploadStatus === 'parsing' ? (
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
            <p className="text-sm">Parsing and validating CSV file...</p>
          </div>
        ) : uploadStatus === 'ready' ? (
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="bg-green-50 text-green-700 px-4 py-2 rounded-md text-sm w-full max-w-sm text-center">
              ✓ {parsedRecords.length} valid records ready to import
            </div>
            <Button 
              onClick={handleImport} 
              disabled={isUploading}
              className="flex items-center space-x-2"
            >
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Importing...</span>
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  <span>Import to Database</span>
                </>
              )}
            </Button>
          </div>
        ) : uploadStatus === 'uploading' ? (
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
            <p className="text-sm">Uploading to database...</p>
          </div>
        ) : uploadStatus === 'success' ? (
          <div className="flex flex-col items-center justify-center space-y-4 text-green-600">
            <CheckCircle2 className="h-10 w-10" />
            <p className="font-medium">Import Successful!</p>
            <Button 
              variant="outline"
              onClick={() => setUploadStatus('idle')}
            >
              Import Another File
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
