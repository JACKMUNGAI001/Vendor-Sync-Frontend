import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

function RegisterForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await axios.post('http://localhost:5000/signup', data);
      login(response.data);
      navigate('/dashboard');
    } catch (error) {
      console.error('Signup failed:', error.response?.data || error.message);
    }
  };
    return (
    <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-blue-600 mb-6 text-center">Register</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
          <input
            id="username"
            type="text"
            className="mt-1 w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
            {...register('username', { required: 'Username is required', minLength: { value: 3, message: 'Min 3 characters' } })}
          />
          {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>}
        </div>