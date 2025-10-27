import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { Building2 } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: { role: 'procurement' } });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {

      await login(data.email, data.password, data.role);
      navigate('/dashboard');
    } catch (error) {
      const message = error?.message || 'Login failed';
      alert(message);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
      <div className="flex flex-col items-center mb-6">
        <Building2 className="h-12 w-12 text-blue-600 mb-2" />
        <h2 className="text-2xl font-semibold">Welcome Back</h2>
        <p className="text-sm text-gray-500">Log in to your account</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input
            id="email"
            type="email"
            {...register('email', { required: 'Email is required' })}
            className="mt-1 w-full p-3 bg-gray-100 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="your.email@company.com"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
          <input
            id="password"
            type="password"
            {...register('password', { required: 'Password is required' })}
            className="mt-1 w-full p-3 bg-gray-100 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="••••••••"
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
        </div>

        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700">Login As</label>
          <select
            id="role"
            {...register('role')}
            className="mt-1 w-full p-3 bg-gray-100 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="procurement">Procurement Manager</option>
            <option value="vendor">Vendor</option>
            <option value="staff">Staff</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full mt-2 bg-slate-900 text-white py-3 rounded-md hover:bg-slate-800 transition"
        >
          Log In
        </button>

        <div className="text-center mt-3 text-sm text-gray-600">
          Don't have an account? <Link to="/register" className="text-blue-600 underline">Register here</Link>
        </div>
      </form>
    </div>
  );
}

export default LoginForm;