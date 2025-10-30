import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const UserForm = ({ user: existingUser, onSuccess, onCancel }) => {
  const { user } = useAuth();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const fetchRoles = async () => {
      if (!user?.token) return;
      try {
        // Assuming you have a /roles endpoint to fetch roles
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/roles`, {
          headers: { 
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        });
        setRoles(response.data.roles || []);
      } catch (error) {
        console.error('Roles fetch error:', error);
      }
    };
    fetchRoles();
  }, [user]);

  useEffect(() => {
    if (existingUser) {
      setValue('first_name', existingUser.first_name);
      setValue('last_name', existingUser.last_name);
      setValue('email', existingUser.email);
      setValue('phone', existingUser.phone);
      setValue('role_id', existingUser.role_id);
    }
  }, [existingUser, setValue]);

  const onSubmit = async (data) => {
    if (!user?.token) return;

    setLoading(true);
    setError('');

    try {
      if (existingUser) {
        await axios.patch(`${process.env.REACT_APP_BACKEND_URL}/users/${existingUser.id}`, data, {
          headers: { 
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        });
      } else {
        await axios.post(`${process.env.REACT_APP_BACKEND_URL}/users`, data, {
          headers: { 
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        });
      }
      onSuccess();
    } catch (error) {
      console.error('User form error:', error);
      setError(error.response?.data?.message || 'Failed to save user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{existingUser ? 'Edit User' : 'New User'}</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">First Name</label>
            <input 
              type="text" 
              id="first_name" 
              {...register('first_name', { required: 'First name is required' })} 
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            {errors.first_name && <p className="text-red-500 text-xs mt-1">{errors.first_name.message}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">Last Name</label>
            <input 
              type="text" 
              id="last_name" 
              {...register('last_name', { required: 'Last name is required' })} 
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            {errors.last_name && <p className="text-red-500 text-xs mt-1">{errors.last_name.message}</p>}
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
            <label htmlFor="role_id" className="block text-sm font-medium text-gray-700">Role</label>
            <select 
              id="role_id" 
              {...register('role_id', { required: 'Role is required', valueAsNumber: true })} 
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">Select a role</option>
              {roles.map(role => (
                <option key={role.id} value={role.id}>{role.name}</option>
              ))}
            </select>
            {errors.role_id && <p className="text-red-500 text-xs mt-1">{errors.role_id.message}</p>}
          </div>
          {!existingUser && (
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input 
                type="password" 
                id="password" 
                {...register('password', { required: 'Password is required' })} 
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>
          )}
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

export default UserForm;
