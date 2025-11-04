import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const VendorForm = ({ vendor, onSuccess, onCancel }) => {
  const { user } = useAuth();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      if (!user?.token) return;
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/vendor-categories`, {
          headers: { 
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        });
        setCategories(response.data.categories || []);
      } catch (error) {
        console.error('Categories fetch error:', error);
      }
    };
    fetchCategories();
  }, [user]);

  useEffect(() => {
    if (vendor) {
      setValue('name', vendor.name);
      setValue('email', vendor.email);
      setValue('phone', vendor.phone);
      setValue('address', vendor.address);
      setValue('company_name', vendor.company_name);
      setValue('contact_person', vendor.contact_person);
      setValue('category_id', vendor.category_id);
      setValue('is_verified', vendor.is_verified);
    }
  }, [vendor, setValue]);

  const onSubmit = async (data) => {
    if (!user?.token) return;

    setLoading(true);
    setError('');

    try {
      if (vendor) {
        await axios.patch(`${process.env.REACT_APP_API_URL}/api/vendors/${vendor.id}`, data, {
          headers: { 
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        });
      } else {
        await axios.post(`${process.env.REACT_APP_API_URL}/api/vendors`, data, {
          headers: { 
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        });
      }
      onSuccess();
    } catch (error) {
      console.error('Vendor form error:', error);
      setError(error.response?.data?.message || 'Failed to save vendor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{vendor ? 'Edit Vendor' : 'New Vendor'}</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input 
              type="text" 
              id="name" 
              {...register('name', { required: 'Name is required' })} 
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input 
              type="email" 
              id="email" 
              {...register('email', { required: 'Email is required' })} 
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
            <input 
              type="text" 
              id="phone" 
              {...register('phone')} 
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
            <input 
              type="text" 
              id="address" 
              {...register('address')} 
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="company_name" className="block text-sm font-medium text-gray-700">Company Name</label>
            <input 
              type="text" 
              id="company_name" 
              {...register('company_name')} 
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="contact_person" className="block text-sm font-medium text-gray-700">Contact Person</label>
            <input 
              type="text" 
              id="contact_person" 
              {...register('contact_person')} 
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="category_id" className="block text-sm font-medium text-gray-700">Category</label>
            <select 
              id="category_id" 
              {...register('category_id', { valueAsNumber: true })} 
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div className="mb-4 flex items-center">
            <input 
              type="checkbox" 
              id="is_verified" 
              {...register('is_verified')} 
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="is_verified" className="ml-2 block text-sm text-gray-900">Verified</label>
          </div>
        </div>
        <div className="flex justify-end space-x-4 mt-4">
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

export default VendorForm;
