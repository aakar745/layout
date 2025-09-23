'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Image as ImageIcon, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { serviceChargeAPI } from '@/lib/api/serviceCharge';

interface ImageUploadProps {
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function ImageUpload({ value, onChange, disabled }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(value || null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (disabled || acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    
    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image must be smaller than 10MB!');
      return;
    }

    // Validate file type
    const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.heic'];
    const fileName = file.name.toLowerCase();
    const hasValidExtension = validExtensions.some(ext => fileName.endsWith(ext));
    
    if (!hasValidExtension && !file.type.startsWith('image/')) {
      toast.error('Please upload a valid image file (JPG, PNG, GIF, SVG, HEIC)!');
      return;
    }

    try {
      setUploading(true);
      
      // Handle HEIC conversion if needed
      let fileToUpload = file;
      if (fileName.endsWith('.heic')) {
        toast.loading('Converting HEIC to JPEG...', { id: 'heic-convert' });
        
        try {
          // Use browser's native conversion or fallback
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const img = new Image();
          
          await new Promise((resolve, reject) => {
            img.onload = () => {
              canvas.width = img.width;
              canvas.height = img.height;
              ctx?.drawImage(img, 0, 0);
              
              canvas.toBlob((blob) => {
                if (blob) {
                  fileToUpload = new File(
                    [blob], 
                    fileName.replace(/\.heic$/i, '.jpg'), 
                    { type: 'image/jpeg' }
                  );
                  resolve(blob);
                } else {
                  reject(new Error('Conversion failed'));
                }
              }, 'image/jpeg', 0.8);
            };
            img.onerror = reject;
            img.src = URL.createObjectURL(file);
          });
          
          toast.success('HEIC file converted to JPEG!', { id: 'heic-convert' });
        } catch (heicError) {
          console.warn('HEIC conversion failed, uploading original:', heicError);
          toast.dismiss('heic-convert');
          // Continue with original file
        }
      }

      // Create preview
      const previewUrl = URL.createObjectURL(fileToUpload);
      setPreview(previewUrl);

      // Upload file
      const response = await serviceChargeAPI.uploadImage(fileToUpload);
      
      if (response.success) {
        // Backend returns path directly at root level
        onChange(response.path);
        toast.success(`${fileToUpload.name} uploaded successfully!`);
      } else {
        throw new Error('Upload failed');
      }

    } catch (error) {
      console.error('Upload error:', error);
      setPreview(null);
      
      if (error instanceof Error) {
        if (error.message.includes('LIMIT_FILE_SIZE')) {
          toast.error('Image is too large. Maximum file size is 10MB.');
        } else if (error.message.includes('INVALID_FILE_TYPE')) {
          toast.error('Invalid file type. Please upload JPG, PNG, GIF, SVG, or HEIC files.');
        } else {
          toast.error(error.message || 'Upload failed. Please try again.');
        }
      } else {
        toast.error('Upload failed. Please try again.');
      }
    } finally {
      setUploading(false);
    }
  }, [onChange, disabled]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.svg'],
      'image/heic': ['.heic', '.HEIC']
    },
    maxFiles: 1,
    disabled: disabled || uploading,
  });

  const handleRemove = () => {
    setPreview(null);
    onChange('');
    toast.success('Image removed');
  };

  const handlePreview = () => {
    if (preview) {
      window.open(preview, '_blank');
    }
  };

  return (
    <div className="space-y-4">
      {!preview ? (
        <Card 
          {...getRootProps()} 
          className={`
            border-2 border-dashed cursor-pointer transition-all duration-200 hover:border-blue-400
            ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            ${uploading ? 'bg-gray-50' : ''}
          `}
        >
          <input {...getInputProps()} />
          <div className="p-3">
            {uploading ? (
              <div className="flex items-center justify-center space-x-2">
                <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                <span className="text-xs text-gray-600">Uploading...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <Upload className={`w-4 h-4 ${isDragActive ? 'text-blue-500' : 'text-gray-400'}`} />
                <div>
                  <span className="text-xs font-medium text-gray-700">
                    {isDragActive ? 'Drop here' : 'Click to upload'}
                  </span>
                  <span className="text-xs text-gray-400 ml-2">• JPG, PNG, GIF, SVG, HEIC</span>
                </div>
              </div>
            )}
          </div>
        </Card>
      ) : (
        <Card className="p-3">
          <div className="flex items-center space-x-3">
            <div className="relative flex-shrink-0">
              <img
                src={preview}
                alt="Uploaded"
                className="w-12 h-12 object-cover rounded border border-gray-200"
                onError={() => {
                  setPreview(null);
                  toast.error('Failed to load image preview');
                }}
              />
              <Badge 
                variant="secondary" 
                className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 flex items-center justify-center text-xs"
              >
                ✓
              </Badge>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-900">Image uploaded</span>
                <div className="flex space-x-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handlePreview}
                    className="h-6 w-6 p-0"
                  >
                    <ImageIcon className="w-3 h-3" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleRemove}
                    className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      <div className="text-xs text-gray-500 text-center">
        <strong>Optional:</strong> Upload cheque image or supporting document. HEIC files auto-converted.
      </div>
    </div>
  );
}
