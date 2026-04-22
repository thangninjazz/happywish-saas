'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ImagePlus, X } from 'lucide-react';
import Image from 'next/image';

interface UploadGalleryProps {
  maxFiles?: number;
  onFilesChange: (files: File[]) => void;
}

export function UploadGallery({ maxFiles = 10, onFilesChange }: UploadGalleryProps) {
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      const newFiles = [...files, ...selectedFiles].slice(0, maxFiles);
      setFiles(newFiles);
      onFilesChange(newFiles);

      // Generate preview URLs
      const newPreviewUrls = newFiles.map(file => URL.createObjectURL(file));
      setPreviewUrls(newPreviewUrls);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
    onFilesChange(newFiles);

    const newPreviewUrls = [...previewUrls];
    URL.revokeObjectURL(newPreviewUrls[index]);
    newPreviewUrls.splice(index, 1);
    setPreviewUrls(newPreviewUrls);
  };

  return (
    <div className="space-y-4">
      <div 
        className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:bg-muted/50 transition-colors cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        <ImagePlus className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold">Upload Photos</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Drag and drop or click to select files. Max {maxFiles} photos.
        </p>
        <input 
          type="file" 
          multiple 
          accept="image/*" 
          className="hidden" 
          ref={fileInputRef}
          onChange={handleFileSelect}
        />
      </div>

      {previewUrls.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-6">
          {previewUrls.map((url, index) => (
            <div key={url} className="relative aspect-square rounded-lg overflow-hidden border group">
              <Image 
                src={url} 
                alt={`Preview ${index}`} 
                fill 
                className="object-cover"
              />
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); removeFile(index); }}
                className="absolute top-2 right-2 p-1 bg-black/50 hover:bg-black/80 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
