import * as React from "react";
import { useState, useRef, useCallback, useEffect } from "react";
import "./FormFile.css";

interface FormFileProps {
  name: string;
  text: string;
  note: string;
  variant: 'Webflow' | 'Basin' | 'UploadCare';
  fileTypes: string;
  multiple: boolean;
}

export const FormFile = ({ name, text, note, variant, fileTypes, multiple }: FormFileProps) => {
  const [fileCount, setFileCount] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Create a hidden input in the document body that forms can access
  useEffect(() => {
    console.log('FormFile useEffect running - creating hidden input');
    
    // Create a hidden input that will be accessible to the form
    const hiddenInput = document.createElement('input');
    hiddenInput.type = 'file';
    hiddenInput.name = name;
    hiddenInput.style.display = 'none';
    hiddenInput.style.position = 'absolute';
    hiddenInput.style.left = '-9999px';
    if (multiple) {
      hiddenInput.multiple = true;
    }
    
    // Find the specific form that contains our component
    // We need to traverse up from the shadow root to find the parent form
    let currentElement = document.querySelector(`code-island[data-props*='"name":"${name}"']`);
    console.log('Found component element:', currentElement);
    
    let form = null;
    while (currentElement && currentElement.parentElement) {
      currentElement = currentElement.parentElement;
      if (currentElement.tagName === 'FORM') {
        form = currentElement;
        break;
      }
    }
    
    console.log('Found parent form:', form);
    if (form) {
      form.appendChild(hiddenInput);
      console.log('Hidden input added to correct form');
    } else {
      console.log('Could not find parent form');
    }

    // Cleanup on unmount
    return () => {
      console.log('Cleaning up hidden input');
      if (hiddenInput.parentNode) {
        hiddenInput.parentNode.removeChild(hiddenInput);
      }
    };
  }, [name, multiple]);

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
      
      // Also update the hidden input in the form
      const hiddenInput = document.querySelector(`form input[name="${name}"]`) as HTMLInputElement;
      if (hiddenInput) {
        hiddenInput.files = files;
      }
      
      // Trigger change event for form handling
      const changeEvent = new Event('change', { bubbles: true });
      fileInputRef.current.dispatchEvent(changeEvent);
    }
  }, [updateFileCount, name]);

  // Handle click to open file selector
  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  // Handle file input change
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    console.log('Files selected:', files);
    updateFileCount(files);
    
    // Sync files to the hidden input in the form
    const hiddenInput = document.querySelector(`form input[name="${name}"]`) as HTMLInputElement;
    console.log('Found hidden input:', hiddenInput);
    if (hiddenInput) {
      hiddenInput.files = files;
      console.log('Files synced to hidden input');
    } else {
      console.log('Hidden input not found!');
    }
  }, [updateFileCount, name]);

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
      if (multiple) {
        return `${fileCount} file${fileCount !== 1 ? 's' : ''} selected`;
      } else {
        return `1 file selected`;
      }
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
      <div className="w-embed">
        <input
          ref={fileInputRef}
          type="file"
          name={`${name}-internal`}
          style={{ display: 'none' }}
          accept={getAcceptAttribute()}
          multiple={multiple}
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
};