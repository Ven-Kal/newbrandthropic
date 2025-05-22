
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';
import { UploadCloud, X, Loader2 } from 'lucide-react';

interface LogoUploaderProps {
  brandId: string;
  currentLogoUrl?: string;
  onSuccess: (logoUrl: string) => void;
}

export function LogoUploader({ brandId, currentLogoUrl, onSuccess }: LogoUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentLogoUrl || null);
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (JPEG, PNG, etc.)",
        variant: "destructive"
      });
      return;
    }
    
    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Logo image must be less than 2MB",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsUploading(true);
      
      // Create a preview
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      
      // Upload to storage
      const fileExt = file.name.split('.').pop();
      const filePath = `brand-logos/${brandId}-${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('brand-assets')
        .upload(filePath, file);
        
      if (error) throw error;
      
      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('brand-assets')
        .getPublicUrl(filePath);
        
      // Call the success callback with the new URL
      onSuccess(publicUrlData.publicUrl);
      
      toast({
        title: "Logo uploaded",
        description: "Brand logo has been updated successfully"
      });
      
    } catch (error: any) {
      console.error('Error uploading logo:', error);
      toast({
        title: "Upload failed",
        description: error.message || "There was an error uploading the logo",
        variant: "destructive"
      });
      
      // Reset preview if upload failed
      if (currentLogoUrl) {
        setPreview(currentLogoUrl);
      } else {
        setPreview(null);
      }
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleRemove = () => {
    setPreview(null);
    
    // If we're removing the current logo, call the success handler with an empty string
    if (currentLogoUrl) {
      onSuccess('');
    }
  };
  
  return (
    <div className="w-full">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center">
        {preview ? (
          <div className="relative w-full">
            <div className="flex justify-center">
              <img 
                src={preview} 
                alt="Brand logo preview" 
                className="h-32 object-contain"
              />
            </div>
            
            <div className="flex justify-center mt-4 space-x-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => document.getElementById(`logo-upload-${brandId}`)?.click()}
                disabled={isUploading}
              >
                Change
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleRemove}
                className="text-red-500 border-red-200 hover:bg-red-50"
                disabled={isUploading}
              >
                <X className="h-4 w-4 mr-1" />
                Remove
              </Button>
            </div>
          </div>
        ) : (
          <>
            {isUploading ? (
              <div className="flex flex-col items-center p-4">
                <Loader2 className="h-10 w-10 text-gray-400 animate-spin" />
                <p className="mt-2 text-sm text-gray-500">Uploading...</p>
              </div>
            ) : (
              <label 
                htmlFor={`logo-upload-${brandId}`}
                className="flex flex-col items-center p-4 cursor-pointer w-full"
              >
                <UploadCloud className="h-10 w-10 text-gray-400" />
                <p className="mt-2 text-sm font-medium">Click to upload logo</p>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG or SVG (max 2MB)</p>
              </label>
            )}
          </>
        )}
        
        <input
          id={`logo-upload-${brandId}`}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          disabled={isUploading}
        />
      </div>
    </div>
  );
}
