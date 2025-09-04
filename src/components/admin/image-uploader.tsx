
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, Image, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

interface ImageUploaderProps {
  onImageUploaded: (url: string) => void;
  currentImage?: string;
  label?: string;
  bucketName?: string;
}

export function ImageUploader({ onImageUploaded, currentImage, label = "Upload Image", bucketName = "Brand Assets" }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setUploadStatus('error');
      toast.error("Please upload a valid image file (JPEG, PNG, GIF, or WebP)");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadStatus('error');
      toast.error("Image file must be smaller than 5MB");
      return;
    }

    setUploading(true);
    setUploadStatus('uploading');

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `blog-images/${fileName}`;

      console.log('Uploading file:', fileName);

      const { error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('blog-images')
        .getPublicUrl(filePath);

      console.log('File uploaded successfully, URL:', data.publicUrl);
      
      onImageUploaded(data.publicUrl);
      setUploadStatus('success');
      toast.success("Image uploaded successfully!");
      
      // Reset status after 3 seconds
      setTimeout(() => setUploadStatus('idle'), 3000);
      
    } catch (error) {
      console.error('Error uploading image:', error);
      setUploadStatus('error');
      toast.error("Failed to upload image. Please try again.");
      
      // Reset status after 3 seconds
      setTimeout(() => setUploadStatus('idle'), 3000);
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const removeImage = () => {
    onImageUploaded("");
    setUploadStatus('idle');
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getStatusIcon = () => {
    switch (uploadStatus) {
      case 'uploading':
        return <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Image className="w-6 h-6 text-gray-400" />;
    }
  };

  const getStatusText = () => {
    switch (uploadStatus) {
      case 'uploading':
        return 'Uploading...';
      case 'success':
        return 'Upload successful!';
      case 'error':
        return 'Upload failed';
      default:
        return 'Drag and drop your image here, or click to browse';
    }
  };

  return (
    <div className="space-y-4">
      <Label>{label}</Label>
      
      {currentImage ? (
        <div className="relative">
          <img 
            src={currentImage} 
            alt="Uploaded image" 
            className="w-full h-48 object-cover rounded-lg border"
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2"
            onClick={removeImage}
          >
            <X className="w-4 h-4" />
          </Button>
          <div className="absolute bottom-2 left-2 bg-green-600 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Image uploaded
          </div>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive 
              ? "border-primary bg-primary/5" 
              : uploadStatus === 'error'
              ? "border-red-300 bg-red-50"
              : uploadStatus === 'success'
              ? "border-green-300 bg-green-50"
              : "border-gray-300 hover:border-gray-400"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="space-y-4">
            <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
              {getStatusIcon()}
            </div>
            <div>
              <p className={`text-sm mb-2 ${
                uploadStatus === 'error' ? 'text-red-600' : 
                uploadStatus === 'success' ? 'text-green-600' : 'text-gray-600'
              }`}>
                {getStatusText()}
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                <Upload className="w-4 h-4 mr-2" />
                {uploading ? "Uploading..." : "Choose Image"}
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              Supports JPEG, PNG, GIF, WebP (max 5MB)
            </p>
          </div>
        </div>
      )}

      <Input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
