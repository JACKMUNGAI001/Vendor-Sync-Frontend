import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function DocumentUpload({ orderId, onUploadSuccess }) {
    const { user } = useAuth();
    const [uploading, setUploading] = useState(false);
    const [file, setFile] = useState(null);

    const handleFileUpload = async (event) => {
        event.preventDefault();
        if (!file) {
            alert('Please select a file');
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('order_id', orderId);
        formData.append('file_type', 'invoice'); // Can be 'invoice' or 'receipt'

        try {
            const response = await axios.post('https://vendor-sync-backend-4bre.onrender.com/documents', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${user.token}`
                }
            });
            
            alert('Document uploaded successfully!');
            setFile(null);
            document.getElementById('fileInput').value = '';
            if (onUploadSuccess) onUploadSuccess(response.data);
        } catch (error) {
            console.error('Upload error:', error);
            alert('Failed to upload document. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="border rounded-lg p-6 bg-white mt-4">
            <h3 className="text-lg font-semibold mb-4">Upload Document</h3>
            <form onSubmit={handleFileUpload} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select File (PDF, JPG, PNG)
                    </label>
                    <input
                        id="fileInput"
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => setFile(e.target.files[0])}
                        className="w-full p-2 border rounded-md"
                        disabled={uploading}
                    />
                </div>
                
                <button
                    type="submit"
                    disabled={uploading || !file}
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-300 transition"
                >
                    {uploading ? 'Uploading...' : 'Upload Document'}
                </button>
            </form>
        </div>
    );
}

export default DocumentUpload;