import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function OrderForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await axios.post('https://vendor-sync-backend-4bre.onrender.com/orders', {
        material_list: JSON.parse(data.material_list),
        vendor_id: data.vendor_id
      }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      navigate('/orders');
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto p-4 bg-white shadow-md rounded">
      <div className="mb-4">
        <label className="block text-gray-700">Material List (JSON)</label>
        <textarea
          {...register('material_list', { required: 'Material list is required' })}
          className="w-full p-2 border rounded"
        />
        {errors.material_list && <p className="text-red-500">{errors.material_list.message}</p>}
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Vendor ID</label>
        <input
          type="number"
          {...register('vendor_id', { required: 'Vendor ID is required' })}
          className="w-full p-2 border rounded"
        />
        {errors.vendor_id && <p className="text-red-500">{errors.vendor_id.message}</p>}
      </div>
      <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Create Order</button>
    </form>
  );
}

export default OrderForm;
