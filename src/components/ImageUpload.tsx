import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, Check, Image as ImageIcon } from 'lucide-react';

const ImageUpload = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileChange = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileChange(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!image) return;
    
    setIsUploading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsUploading(false);
    setUploadSuccess(true);
    
    setTimeout(() => {
      setUploadSuccess(false);
    }, 3000);
  };

  const resetUpload = () => {
    setImage(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <section className="w-full py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Upload Image</h2>
        
        {!image ? (
          <div
            className={`border-2 border-dashed rounded-lg transition-all duration-200 ease-in-out
              ${isDragging 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-blue-400 bg-gray-50 hover:bg-gray-100'}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="flex flex-col items-center justify-center py-12 cursor-pointer">
              <Upload className="h-12 w-12 text-gray-400 mb-4" />
              <p className="text-lg font-medium text-gray-700 mb-1">Drag and drop your image here</p>
              <p className="text-sm text-gray-500 mb-4">or click to select from your device</p>
              <span className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
                Select Image
              </span>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleInputChange}
                accept="image/*"
                className="hidden"
              />
            </div>
          </div>
        ) : (
          <div className="border rounded-lg bg-white p-4 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-blue-500" />
                <span className="font-medium text-gray-700">{image.name}</span>
              </div>
              <button 
                onClick={resetUpload}
                className="p-1 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {preview && (
              <div className="relative mb-4 rounded-md overflow-hidden bg-gray-100">
                <img
                  src={preview}
                  alt="Preview"
                  className="max-h-96 object-contain mx-auto"
                />
              </div>
            )}
            
            <div className="flex justify-end">
              <button
                onClick={handleUpload}
                disabled={isUploading || uploadSuccess}
                className={`px-4 py-2 rounded-md flex items-center gap-2 transition-all ${
                  uploadSuccess
                    ? 'bg-green-500 text-white'
                    : isUploading
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                {uploadSuccess ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span>Uploaded!</span>
                  </>
                ) : isUploading ? (
                  <>
                    <div className="h-4 w-4 border-2 border-gray-500 border-t-gray-300 rounded-full animate-spin" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    <span>Upload</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
        
        <div className="mt-4 text-sm text-gray-500">
          <p>Supported formats: JPEG, PNG, GIF</p>
          <p>Maximum file size: 10MB</p>
        </div>
      </div>
    </section>
  );
};

export default ImageUpload;