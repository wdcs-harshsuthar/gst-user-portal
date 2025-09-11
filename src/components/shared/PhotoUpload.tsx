import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Upload, X, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { UploadedDocument } from './DocumentUpload';

interface PhotoUploadProps {
  title?: string;
  description?: string;
  accept?: string;
  maxSize?: number; // in MB
  onUpload: (documents: UploadedDocument[]) => void;
  uploadedDocuments: UploadedDocument[];
  isRequired?: boolean;
  className?: string;
}

export default function PhotoUpload({
  title = "Upload Photo",
  description = "Upload a clear photograph",
  accept = "image/jpeg,image/jpg,image/png",
  maxSize = 5,
  onUpload,
  uploadedDocuments,
  isRequired = false,
  className = ""
}: PhotoUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  React.useEffect(() => {
    if (uploadedDocuments.length > 0) {
      const file = uploadedDocuments[0].file;
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [uploadedDocuments]);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0]; // Only take the first file for photo upload
    
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      alert(`File ${file.name} is too large. Maximum size is ${maxSize}MB.`);
      return;
    }

    // Check file type
    const acceptedTypes = accept.split(',').map(type => type.trim());
    const isValidType = acceptedTypes.some(type => {
      if (type.includes('*')) {
        const baseType = type.split('/')[0];
        return file.type.startsWith(baseType);
      }
      return file.type === type;
    });

    if (!isValidType) {
      alert(`File ${file.name} is not a supported format. Please upload ${accept} files.`);
      return;
    }

    const newDoc: UploadedDocument = {
      id: `photo-${Date.now()}`,
      file,
      documentType: 'photo',
      uploadDate: new Date().toISOString()
    };

    onUpload([newDoc]);
  };

  const removeDocument = () => {
    onUpload([]);
    setPreviewUrl(null);
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
    handleFiles(e.dataTransfer.files);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Title and Description */}
      <div>
        <Label className="text-base font-medium">
          {title}
          {isRequired && <span className="text-red-500 ml-1">*</span>}
        </Label>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">
            {description}
          </p>
        )}
      </div>

      {/* Upload Area or Preview */}
      {uploadedDocuments.length === 0 ? (
        <div
          className={`text-center transition-colors ${
            dragActive ? 'bg-blue-50' : ''
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
          <p className="text-sm text-gray-600 mb-2">
            Drag and drop your photo here, or{' '}
            <label className="text-blue-600 hover:text-blue-700 cursor-pointer underline">
              browse
              <input
                type="file"
                accept={accept}
                onChange={(e) => handleFiles(e.target.files)}
                className="hidden"
              />
            </label>
          </p>
          <p className="text-xs text-gray-500">
            Max size: {maxSize}MB • Formats: {accept.replace(/image\//g, '').toUpperCase()}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Photo Preview */}
          {previewUrl && (
            <div className="relative w-32 h-32 mx-auto">
              <img
                src={previewUrl}
                alt="Uploaded photo"
                className="w-full h-full object-cover rounded-lg border border-gray-200"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={removeDocument}
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
          
          {/* Replace Button */}
          <div className="text-center">
            <label className="text-blue-600 hover:text-blue-700 cursor-pointer underline text-sm">
              Replace Photo
              <input
                type="file"
                accept={accept}
                onChange={(e) => handleFiles(e.target.files)}
                className="hidden"
              />
            </label>
          </div>
        </div>
      )}
    </div>
  );
}