import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Plus, Edit, Trash2, FileText } from 'lucide-react';
import RequirementForm from './RequirementForm';

const RequirementList = () => {
  const { user } = useAuth();
  const [requirements, setRequirements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showRequirementForm, setShowRequirementForm] = useState(false);
  const [selectedRequirement, setSelectedRequirement] = useState(null);

  useEffect(() => {
    const fetchRequirements = async () => {
      if (!user?.token) return;

      try {
        setLoading(true);
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/requirements`, {
          headers: { 
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        });
        setRequirements(response.data.requirements || []);
        setError('');
      } catch (error) {
        console.error('Requirements fetch error:', error);
        setError(error.response?.data?.message || 'Failed to load requirements');
      } finally {
        setLoading(false);
      }
    };

    fetchRequirements();
  }, [user]);

  const handleFormSuccess = () => {
    setShowRequirementForm(false);
    setSelectedRequirement(null);
    // Refresh requirements
    const fetchRequirements = async () => {
      if (!user?.token) return;

      try {
        setLoading(true);
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/requirements`, {
          headers: { 
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        });
        setRequirements(response.data.requirements || []);
        setError('');
      } catch (error) {
        console.error('Requirements fetch error:', error);
        setError(error.response?.data?.message || 'Failed to load requirements');
      } finally {
        setLoading(false);
      }
    };

    fetchRequirements();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this requirement?')) return;

    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/requirements/${id}`, {
        headers: { 
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        }
      });
      setRequirements(requirements.filter(req => req.id !== id));
    } catch (error) {
      console.error('Delete requirement error:', error);
      setError(error.response?.data?.message || 'Failed to delete requirement');
    }
  };

  if (showRequirementForm) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-2xl mx-auto">
          <RequirementForm 
            requirement={selectedRequirement}
            onSuccess={handleFormSuccess}
            onCancel={() => setShowRequirementForm(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Material Requirements</h1>
                <p className="text-gray-600">Manage your material needs</p>
              </div>
              <button
                onClick={() => {
                  setSelectedRequirement(null);
                  setShowRequirementForm(true);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>New Requirement</span>
              </button>
            </div>
          </div>

          <div className="p-6">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                {error}
              </div>
            )}

            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : requirements.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg mb-2">No requirements found</p>
                <p className="text-gray-400 mb-6">Get started by creating your first requirement</p>
                <button
                  onClick={() => {
                    setSelectedRequirement(null);
                    setShowRequirementForm(true);
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition inline-flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Create Requirement</span>
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specifications</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {requirements.map((req) => (
                      <tr key={req.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{req.item_name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{req.quantity}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{req.specifications}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(req.created_at).toLocaleDateString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => {
                                setSelectedRequirement(req);
                                setShowRequirementForm(true);
                              }}
                              className="text-green-600 hover:text-green-900"
                              title="Edit Requirement"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => handleDelete(req.id)}
                              className="text-red-600 hover:text-red-900"
                              title="Delete Requirement"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequirementList;
