import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Plus, Edit, Trash2, List } from 'lucide-react';
import VendorCategoryForm from './VendorCategoryForm';

const VendorCategoryList = () => {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      if (!user?.token) return;

      try {
        setLoading(true);
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/vendor-categories`, {
          headers: { 
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        });
        setCategories(response.data.categories || []);
        setError('');
      } catch (error) {
        console.error('Categories fetch error:', error);
        setError(error.response?.data?.message || 'Failed to load categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [user]);

  const handleFormSuccess = () => {
    setShowCategoryForm(false);
    setSelectedCategory(null);
    // Refresh categories
    const fetchCategories = async () => {
      if (!user?.token) return;

      try {
        setLoading(true);
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/vendor-categories`, {
          headers: { 
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        });
        setCategories(response.data.categories || []);
        setError('');
      } catch (error) {
        console.error('Categories fetch error:', error);
        setError(error.response?.data?.message || 'Failed to load categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;

    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/vendor-categories/${id}`, {
        headers: { 
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        }
      });
      setCategories(categories.filter(cat => cat.id !== id));
    } catch (error) {
      console.error('Delete category error:', error);
      setError(error.response?.data?.message || 'Failed to delete category');
    }
  };

  if (showCategoryForm) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-2xl mx-auto">
          <VendorCategoryForm 
            category={selectedCategory}
            onSuccess={handleFormSuccess}
            onCancel={() => setShowCategoryForm(false)}
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
                <h1 className="text-2xl font-bold text-gray-900">Vendor Categories</h1>
                <p className="text-gray-600">Manage your vendor categories</p>
              </div>
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setShowCategoryForm(true);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>New Category</span>
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
            ) : categories.length === 0 ? (
              <div className="text-center py-12">
                <List className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg mb-2">No categories found</p>
                <p className="text-gray-400 mb-6">Get started by creating your first category</p>
                <button
                  onClick={() => {
                    setSelectedCategory(null);
                    setShowCategoryForm(true);
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition inline-flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Create Category</span>
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {categories.map((cat) => (
                      <tr key={cat.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{cat.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => {
                                setSelectedCategory(cat);
                                setShowCategoryForm(true);
                              }}
                              className="text-green-600 hover:text-green-900"
                              title="Edit Category"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => handleDelete(cat.id)}
                              className="text-red-600 hover:text-red-900"
                              title="Delete Category"
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

export default VendorCategoryList;
