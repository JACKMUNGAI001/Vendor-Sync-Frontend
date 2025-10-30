import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const OrderForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await axios.get('https://vendor-sync-backend-4bre.onrender.com/vendors');
        setVendors(response.data.vendors || []);
      } catch (error) {
        console.error('Failed to fetch vendors:', error);
      }
    };
    fetchVendors();
  }, []);

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
      const materialList = {
        [data.materialName]: {
          quantity: parseInt(data.quantity),
          unit: data.unit,
          specifications: data.specifications || ''
        }
      };

      const orderData = {
        vendor_id: parseInt(data.vendorId),
        material_list: materialList,
        delivery_date: data.deliveryDate,
        special_instructions: data.specialInstructions || ''
      };

      const response = await axios.post(
        'https://vendor-sync-backend-4bre.onrender.com/orders',
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
          <h2 className="text-2xl font-bold text-gray-900">Create New Order</h2>
          <p className="text-gray-600">Fill in the details to create a new purchase order</p>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Vendor *</label>
            <select
              {...register('vendorId', { required: 'Vendor is required' })}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a vendor</option>
              {vendors.map((vendor) => (
                <option key={vendor.id} value={vendor.id}>
                  {vendor.name} - {vendor.contact_email}
                </option>
              ))}
            </select>
            {errors.vendorId && <p className="text-red-500 text-sm mt-1">{errors.vendorId.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Material Name *</label>
            <input
              type="text"
              {...register('materialName', { required: 'Material name is required' })}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Cement, Steel Bars, Electrical Wires"
            />
            {errors.materialName && <p className="text-red-500 text-sm mt-1">{errors.materialName.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
              <input
                type="number"
                {...register('quantity', { 
                  required: 'Quantity is required',
                  min: { value: 1, message: 'Quantity must be at least 1' }
                })}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="100"
              />
              {errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unit *</label>
              <select
                {...register('unit', { required: 'Unit is required' })}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select unit</option>
                <option value="kg">Kilograms</option>
                <option value="tons">Tons</option>
                <option value="pieces">Pieces</option>
                <option value="bags">Bags</option>
                <option value="liters">Liters</option>
                <option value="meters">Meters</option>
              </select>
              {errors.unit && <p className="text-red-500 text-sm mt-1">{errors.unit.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Specifications</label>
            <textarea
              {...register('specifications')}
              rows="3"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Any specific requirements, quality standards, or specifications..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Date</label>
            <input
              type="date"
              {...register('deliveryDate')}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Special Instructions</label>
            <textarea
              {...register('specialInstructions')}
              rows="3"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Any special delivery instructions, site access information, or contact details..."
            />
          </div>

          {submitError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {submitError}
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
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
        </form>
      </div>
    </div>
  );
};

export default OrderForm;