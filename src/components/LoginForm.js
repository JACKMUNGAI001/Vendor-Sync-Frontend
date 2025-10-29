import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { Building2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function LoginForm() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { login } = useAuth();
    const navigate = useNavigate();
    const [submitError, setSubmitError] = useState('');

    const onSubmit = async (data) => {
        setSubmitError('');
        const result = await login(data.email, data.password);
        
        if (result.success) {
            navigate('/dashboard');
        } else {
            setSubmitError(result.error);
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
                        {...register('email', { 
                            required: 'Email is required',
                            pattern: {
                                value: /^\S+@\S+$/i,
                                message: 'Invalid email address'
                            }
                        })}
                        className="mt-1 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="your.email@company.com"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                    <input
                        id="password"
                        type="password"
                        {...register('password', { 
                            required: 'Password is required',
                            minLength: {
                                value: 6,
                                message: 'Password must be at least 6 characters'
                            }
                        })}
                        className="mt-1 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="••••••••"
                    />
                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                </div>

                {submitError && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        {submitError}
                    </div>
                )}

                <button
                    type="submit"
                    className="w-full mt-2 bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition disabled:bg-blue-300"
                >
                    Log In
                </button>

                <div className="text-center mt-3 text-sm text-gray-600">
                    Don't have an account? <Link to="/register" className="text-blue-600 hover:underline">Register here</Link>
                </div>
            </form>
        </div>
    );
}

export default LoginForm;