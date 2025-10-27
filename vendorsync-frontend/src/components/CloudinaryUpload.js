import React, { useState } from 'react';
import axios from 'axios';

function CloudinaryUpload({ onUploadSuccess, orderId, fileType = 'invoice' }) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload a JPEG, PNG, or PDF file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'vendorsync_preset');
      formData.append('folder', 'vendorsync');
      formData.append('api_key', '178465286397512');

      const cloudinaryResponse = await axios.post(
        `https://api.cloudinary.com/v1_1/Root/auto/upload`,
        formData,
        {
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(progress);
          },
        }
      );

      const documentResponse = await axios.post('http://localhost:5000/documents', {
        order_id: orderId,
        file_url: cloudinaryResponse.data.secure_url,
        file_type: fileType,
        public_id: cloudinaryResponse.data.public_id
      });

      if (onUploadSuccess) {
        onUploadSuccess(documentResponse.data);
      }

      alert('File uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload file. Please try again.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      event.target.value = '';
    }
  };

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4">Upload {fileType === 'invoice' ? 'Invoice' : 'Document'}</h3>
      
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <input
          type="file"
          id="file-upload"
          onChange={handleFileUpload}
          disabled={isUploading}
          accept=".jpg,.jpeg,.png,.pdf"
          className="hidden"
        />
        
        <label
          htmlFor="file-upload"
          className={`cursor-pointer block ${
            isUploading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" 
              strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="mt-2 block text-sm font-medium text-gray-900">
            {isUploading ? 'Uploading...' : 'Choose file to upload'}
          </span>
          <span className="mt-1 block text-xs text-gray-500">
            JPEG, PNG, or PDF (Max 5MB)
          </span>
        </label>

        {isUploading && (
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Uploading... {uploadProgress}%
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CloudinaryUpload;