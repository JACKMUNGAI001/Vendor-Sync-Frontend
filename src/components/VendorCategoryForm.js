import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const VendorCategoryForm = ({ category, onSuccess, onCancel }) => {
  const { user } = useAuth();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (category) {
      setValue('name', category.name);
    }
  }, [category, setValue]);

  const onSubmit = async (data) => {
    if (!user?.token) return;

    setLoading(true);
    setError('');

    try {
      if (category) {
        await axios.patch(`${process.env.REACT_APP_BACKEND_URL}/vendor-categories/${category.id}`, data, {
          headers: { 
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        });
      } else {
        await axios.post(`${process.env.REACT_APP_BACKEND_URL}/vendor-categories`, data, {
          headers: { 
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        });
      }
      onSuccess();
    } catch (error) {
      console.error('Category form error:', error);
      setError(error.response?.data?.message || 'Failed to save category');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{category ? 'Edit Category' : 'New Category'}</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Category Name</label>
          <input 
            type="text" 
            id="name" 
            {...register('name', { required: 'Category name is required' })} 
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>
        <div className="flex justify-end space-x-4">
          <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition disabled:bg-blue-300">
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default VendorCategoryForm;
