import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Building2 } from 'lucide-react';

const OrderForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [vendorsLoading, setVendorsLoading] = useState(true);

  useEffect(() => {
    const fetchVendors = async () => {
      if (!user?.token) return;
      
      try {
        setVendorsLoading(true);
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/vendors`, {
          headers: { 
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        });
        
        const verifiedVendors = (response.data.vendors || []).filter(v => v.is_verified);
        setVendors(verifiedVendors);
        
        if (verifiedVendors.length === 0) {
          setSubmitError('No verified vendors available. Please verify vendors first.');
        }
      } catch (error) {
        console.error('Failed to fetch vendors:', error);
        setSubmitError('Failed to load vendors. Please try again.');
      } finally {
        setVendorsLoading(false);
      }
    };
    fetchVendors();
  }, [user]);

  const onSubmit = async (data) => {
    if (!user) {
      setSubmitError('Please log in to create an order');
      return;
    }

    if (user.role !== 'manager') {
      setSubmitError('Only managers can create orders');
      return;
    }

    setLoading(true);
    setSubmitError('');

    try {
      const orderData = {
        order_number: data.orderNumber,
        vendor_id: parseInt(data.vendorId)
      };

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/orders`,
        orderData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 201) {
        alert('Order created successfully!');
        navigate('/orders');
      }
    } catch (error) {
      console.error('Order creation error:', error);
      setSubmitError(error.response?.data?.message || 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Create New Order</h2>
          </div>
          <p className="text-gray-600">Fill in the details to create a new purchase order</p>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Order Number *
            </label>
            <input
              type="text"
              {...register('orderNumber', { required: 'Order number is required' })}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., PO-2025-001"
            />
            {errors.orderNumber && (
              <p className="text-red-500 text-sm mt-1">{errors.orderNumber.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Assign to Vendor *
            </label>
            {vendorsLoading ? (
              <div className="flex items-center justify-center p-3 border border-gray-300 rounded-md">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500 mr-2"></div>
                <span className="text-gray-600">Loading vendors...</span>
              </div>
            ) : vendors.length === 0 ? (
              <div className="p-3 border border-yellow-300 bg-yellow-50 rounded-md">
                <p className="text-yellow-800 text-sm">
                  No verified vendors available. Please verify vendors in the Vendors page first.
                </p>
              </div>
            ) : (
              <select
                {...register('vendorId', { required: 'Vendor is required' })}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a vendor</option>
                {vendors.map((vendor) => (
                  <option key={vendor.id} value={vendor.id}>
                    {vendor.name} - {vendor.company_name || vendor.email}
                  </option>
                ))}
              </select>
            )}
            {errors.vendorId && (
              <p className="text-red-500 text-sm mt-1">{errors.vendorId.message}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Only verified vendors are shown. Total available: {vendors.length}
            </p>
          </div>

          {submitError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {submitError}
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading || vendors.length === 0}
              className="flex-1 bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition disabled:bg-blue-300 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Order...' : 'Create Order'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/orders')}
              className="flex-1 bg-gray-500 text-white py-3 rounded-md hover:bg-gray-600 transition"
            >
              Cancel
            </button>
          </div>

          {vendors.length === 0 && !vendorsLoading && (
            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() => navigate('/vendors')}
                className="text-blue-600 hover:underline text-sm"
              >
                → Go to Vendors page to add and verify vendors
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default OrderForm;