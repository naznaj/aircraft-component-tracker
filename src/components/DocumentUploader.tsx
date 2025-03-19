
import { useState, useRef } from 'react';
import { Upload, X, FileText, Check } from 'lucide-react';
import { formatFileSize } from '../utils/formatters';

interface DocumentUploaderProps {
  label: string;
  accept?: string;
  maxSize?: number;
  referenceField?: boolean;
  referenceValue?: string;
  onReferenceChange?: (value: string) => void;
  onFileChange: (file: File | null) => void;
  description?: string;
}

export function DocumentUploader({
  label,
  accept = '.pdf,.jpg,.jpeg,.png',
  maxSize = 5 * 1024 * 1024, // 5MB default
  referenceField = false,
  referenceValue = '',
  onReferenceChange,
  onFileChange,
  description
}: DocumentUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    validateAndSetFile(selectedFile);
  };
  
  const validateAndSetFile = (selectedFile: File | null) => {
    setError(null);
    
    if (!selectedFile) {
      setFile(null);
      onFileChange(null);
      return;
    }
    
    // Check file size
    if (selectedFile.size > maxSize) {
      setError(`File size exceeds the maximum allowed size (${formatFileSize(maxSize)})`);
      return;
    }
    
    // Check file type
    const fileType = selectedFile.type;
    const acceptedTypes = accept.split(',').map(type => type.trim());
    
    const isAcceptedType = acceptedTypes.some(type => {
      if (type.startsWith('.')) {
        // Check file extension
        return selectedFile.name.toLowerCase().endsWith(type.toLowerCase());
      } else {
        // Check MIME type
        return fileType === type || (type.includes('*') && fileType.startsWith(type.split('*')[0]));
      }
    });
    
    if (!isAcceptedType) {
      setError(`File type not accepted. Please upload ${accept}`);
      return;
    }
    
    setFile(selectedFile);
    onFileChange(selectedFile);
  };
  
  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
    
    const droppedFile = event.dataTransfer.files[0];
    validateAndSetFile(droppedFile);
  };
  
  const handleRemoveFile = () => {
    setFile(null);
    setError(null);
    onFileChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        {description && (
          <span className="text-xs text-gray-500">{description}</span>
        )}
      </div>
      
      {referenceField && (
        <div className="mb-2">
          <input
            type="text"
            value={referenceValue}
            onChange={(e) => onReferenceChange?.(e.target.value)}
            placeholder="Reference Number"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary text-sm"
          />
        </div>
      )}
      
      <div
        className={`
          border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center
          transition-colors duration-200
          ${isDragging ? 'border-primary bg-primary/5' : 'border-gray-300'}
          ${error ? 'border-red-300 bg-red-50' : ''}
          ${file ? 'bg-gray-50' : 'hover:bg-gray-50'}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {file ? (
          <div className="w-full">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-primary" />
                <div className="truncate max-w-xs">
                  <p className="text-sm font-medium text-gray-700 truncate">{file.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleRemoveFile}
                className="p-1 rounded-full hover:bg-gray-200"
              >
                <X className="h-4 w-4 text-gray-500" />
              </button>
            </div>
            <div className="mt-2 flex items-center">
              <Check className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-xs text-green-600">File uploaded successfully</span>
            </div>
          </div>
        ) : (
          <>
            <div className="p-3 rounded-full bg-primary/10 mb-3">
              <Upload className="h-6 w-6 text-primary" />
            </div>
            <p className="text-sm text-gray-700 mb-1">
              <span className="font-medium">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">
              {accept.replace(/\./g, '').toUpperCase()} (max. {formatFileSize(maxSize)})
            </p>
            {error && (
              <p className="text-xs text-red-500 mt-2">{error}</p>
            )}
          </>
        )}
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept={accept}
          onChange={handleFileChange}
          onClick={(e) => {
            // Clear the input value to allow selecting the same file again
            (e.target as HTMLInputElement).value = '';
          }}
        />
      </div>
      
      {!file && !error && (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="mt-2 inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md bg-primary/10 text-primary hover:bg-primary/20"
        >
          <Upload className="h-3.5 w-3.5 mr-1" />
          Choose file
        </button>
      )}
    </div>
  );
}
