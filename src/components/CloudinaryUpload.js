import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Upload, FileText, CheckCircle, XCircle } from 'lucide-react';

const CloudinaryUpload = ({ onUploadSuccess, orderId, fileType = 'invoice' }) => {
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      setUploadError('Please upload a JPEG, PNG, or PDF file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File size must be less than 5MB');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setUploadError('');
    setUploadSuccess(false);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'vendorsync');
      formData.append('folder', 'vendorsync');

      const cloudinaryResponse = await fetch('https://api.cloudinary.com/v1_1/demo/auto/upload', {
        method: 'POST',
        body: formData,
      });

      if (!cloudinaryResponse.ok) {
        throw new Error('Cloudinary upload failed');
      }

      const cloudinaryData = await cloudinaryResponse.json();

      setUploadProgress(100);
      setUploadSuccess(true);

      if (onUploadSuccess) {
        onUploadSuccess({
          file_url: cloudinaryData.secure_url,
          public_id: cloudinaryData.public_id,
          file_type: fileType
        });
      }

      setTimeout(() => {
        setUploadSuccess(false);
      }, 3000);

    } catch (error) {
      console.error('Upload error:', error);
      setUploadError('Failed to upload file. Please try again.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      event.target.value = '';
    }
  };

  const getFileTypeDisplay = () => {
    switch (fileType) {
      case 'invoice': return 'Invoice';
      case 'receipt': return 'Receipt';
      case 'delivery_note': return 'Delivery Note';
      default: return 'Document';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <FileText className="h-5 w-5 text-blue-600" />
        Upload {getFileTypeDisplay()}
      </h3>
      
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
        <input
          type="file"
          id={`file-upload-${orderId}-${fileType}`}
          onChange={handleFileUpload}
          disabled={isUploading}
          accept=".jpg,.jpeg,.png,.pdf"
          className="hidden"
        />
        
        <label 
          htmlFor={`file-upload-${orderId}-${fileType}`}
          className={`cursor-pointer block ${isUploading ? 'opacity-50' : ''}`}
        >
          {uploadSuccess ? (
            <div className="flex flex-col items-center">
              <CheckCircle className="h-12 w-12 text-green-500 mb-2" />
              <span className="text-sm font-medium text-green-600">Upload Successful!</span>
              <span className="text-xs text-green-500 mt-1">File uploaded successfully</span>
            </div>
          ) : isUploading ? (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-2"></div>
              <span className="text-sm font-medium text-gray-900">Uploading...</span>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <span className="text-xs text-gray-500 mt-1">{uploadProgress}%</span>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <Upload className="h-12 w-12 text-gray-400 mb-2" />
              <span className="text-sm font-medium text-gray-900">Choose file to upload</span>
              <span className="text-xs text-gray-500 mt-1">JPEG, PNG, PDF (Max 5MB)</span>
            </div>
          )}
        </label>

        {uploadError && (
          <div className="mt-4 flex items-center justify-center gap-2 text-red-600 text-sm">
            <XCircle className="h-4 w-4" />
            {uploadError}
          </div>
        )}
      </div>

      <div className="mt-4 text-xs text-gray-500">
        <p>• Supported formats: JPG, PNG, PDF</p>
        <p>• Maximum file size: 5MB</p>
        <p>• Files are securely stored in Cloudinary</p>
      </div>
    </div>
  );
};

export default CloudinaryUpload;