import * as React from "react";
import { useState, useRef, useCallback } from "react";
import "./FormFile.css";

interface FormFileProps {
  name: string;
  text: string;
  note: string;
  variant: 'Webflow' | 'Basin' | 'UploadCare';
  fileTypes: string;
}

export const FormFile = ({ name, text, note, variant, fileTypes }: FormFileProps) => {
  const [fileCount, setFileCount] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update file count when files are selected
  const updateFileCount = useCallback((files: FileList | null) => {
    const count = files ? files.length : 0;
    setFileCount(count);
  }, []);

  // Handle drag events
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    // Only set dragOver to false if we're leaving the drop zone entirely
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    
    if (x < rect.left || x >= rect.right || y < rect.top || y >= rect.bottom) {
      setIsDragOver(false);
    }
  }, []);

  const handleDragEnd = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  // Handle file drop
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (fileInputRef.current && files.length > 0) {
      fileInputRef.current.files = files;
      updateFileCount(files);
      
      // Trigger change event for form handling
      const changeEvent = new Event('change', { bubbles: true });
      fileInputRef.current.dispatchEvent(changeEvent);
    }
  }, [updateFileCount]);

  // Handle click to open file selector
  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  // Handle file input change
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    updateFileCount(e.target.files);
  }, [updateFileCount]);

  // Parse file types for accept attribute
  const getAcceptAttribute = () => {
    if (!fileTypes) return "image/webp, image/png, image/jpeg"; // default
    
    // Handle common formats
    const typeMap: Record<string, string> = {
      'images': 'image/*',
      'pdf': 'application/pdf',
      'documents': '.doc,.docx,.pdf,.txt',
      'videos': 'video/*',
      'audio': 'audio/*'
    };
    
    return typeMap[fileTypes.toLowerCase()] || fileTypes;
  };

  // Get display text based on file count
  const getDisplayText = () => {
    if (fileCount > 0) {
      return `${fileCount} file${fileCount !== 1 ? 's' : ''} selected`;
    }
    return note;
  };

  // Get component classes
  const getComponentClasses = () => {
    const baseClasses = "cc-formfile";
    const dragOverClass = isDragOver ? "drag-over" : "";
    const hasFilesClass = fileCount > 0 ? "has-files" : "";
    
    return `${baseClasses} ${dragOverClass} ${hasFilesClass}`.trim();
  };

  return (
    <div 
      className={getComponentClasses()}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragEnd={handleDragEnd}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <div>{text}</div>
      <div className="cc-formfile-text-note">
        {getDisplayText()}
      </div>
      <div>
        <input
          ref={fileInputRef}
          type="file"
          name={name + '[]'}
//          style={{ display: 'none' }}
          accept={getAcceptAttribute()}
          multiple
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
};