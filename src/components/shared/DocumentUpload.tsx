import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Upload, X, FileText, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';

export interface UploadedDocument {
  id: string;
  file: File;
  documentType: string;
  uploadDate: string;
}

interface RequiredDocument {
  type: string;
  label: string;
  required: boolean;
  description: string;
}

interface DocumentUploadProps {
  title?: string;
  description?: string;
  acceptedTypes?: string[];
  maxSizeMB?: number;
  maxFiles?: number;
  requiredDocuments: RequiredDocument[];
  uploadedDocuments: UploadedDocument[];
  onDocumentsChange: (documents: UploadedDocument[]) => void;
  errors?: Record<string, string>;
}

export default function DocumentUpload({
  title = "Document Upload",
  description = "Please upload the required documents for your registration.",
  acceptedTypes = ['image/*', 'application/pdf'],
  maxSizeMB = 10,
  maxFiles = 10,
  requiredDocuments,
  uploadedDocuments,
  onDocumentsChange,
  errors = {}
}: DocumentUploadProps) {
  const [dragActive, setDragActive] = useState(false);

  const handleFiles = (files: FileList | null, documentType: string) => {
    if (!files) return;

    const newDocuments: UploadedDocument[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Check file size
      if (file.size > maxSizeMB * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size is ${maxSizeMB}MB.`);
        continue;
      }

      // Check file type
      const isValidType = acceptedTypes.some(type => {
        if (type.includes('*')) {
          const baseType = type.split('/')[0];
          return file.type.startsWith(baseType);
        }
        return file.type === type;
      });

      if (!isValidType) {
        alert(`File ${file.name} is not a supported format. Please upload ${acceptedTypes.join(', ')} files.`);
        continue;
      }

      const newDoc: UploadedDocument = {
        id: `${Date.now()}-${i}`,
        file,
        documentType,
        uploadDate: new Date().toISOString()
      };

      newDocuments.push(newDoc);
    }

    if (uploadedDocuments.length + newDocuments.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed.`);
      return;
    }

    onDocumentsChange([...uploadedDocuments, ...newDocuments]);
  };

  const removeDocument = (documentId: string) => {
    onDocumentsChange(uploadedDocuments.filter(doc => doc.id !== documentId));
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

  const handleDrop = (e: React.DragEvent, documentType: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files, documentType);
  };

  const getUploadedDocsForType = (type: string) => {
    return uploadedDocuments.filter(doc => doc.documentType === type);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card className="space-y-6 border-none mt-[2876543210px] mx-[0px] my-[16px] px-[0px] py-[-4px]">
      {/* Document Upload Sections */}
      {requiredDocuments.map((docType) => {
        const uploadedForType = getUploadedDocsForType(docType.type);
        const hasError = errors[docType.type];

        return (
          <React.Fragment key={docType.type}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <Label className="text-base font-medium">
                  {docType.label}
                  {docType.required && <span className="text-red-500 ml-1">*</span>}
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  {docType.description}
                </p>
              </div>
              <div className="text-sm text-muted-foreground">
                {uploadedForType.length} uploaded
              </div>
            </div>

            {/* Upload Area */}
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors mb-3 ${
                dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
              } ${hasError ? 'border-red-500' : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={(e) => handleDrop(e, docType.type)}
            >
              <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-600 mb-2">
                Drag and drop files here, or{' '}
                <label className="text-blue-600 hover:text-blue-700 cursor-pointer underline">
                  browse
                  <input
                    type="file"
                    multiple
                    accept={acceptedTypes.join(',')}
                    onChange={(e) => handleFiles(e.target.files, docType.type)}
                    className="hidden"
                  />
                </label>
              </p>
            </div>

            {/* Error Display */}
            {hasError && (
              <p className="text-red-500 text-sm mb-3">{errors[docType.type]}</p>
            )}

            {/* Uploaded Files List */}
            {uploadedForType.length > 0 && (
              <div className="space-y-2 mb-6">
                {uploadedForType.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium">{doc.file.name}</p>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(doc.file.size)} • Uploaded {new Date(doc.uploadDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeDocument(doc.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </React.Fragment>
        );
      })}

      {/* Summary */}
      <div className="pt-4 border-t">
        <p className="text-sm text-muted-foreground">
          Total files uploaded: {uploadedDocuments.length}/{maxFiles}
        </p>
      </div>
    </Card>
  );
}