import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { Building2, UserCircle } from "lucide-react";
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const RegisterForm = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm({ mode: "onTouched" });
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const password = watch("password", "");
  const selectedRole = watch("role", "");

  const onSubmit = async (data) => {
    setIsLoading(true);
    setSubmitError('');
    
    try {
      const [firstName, lastName = ""] = data.fullName.split(" ");
      
      let payload = {
        first_name: firstName,
        last_name: lastName,
        email: data.email,
        password: data.password,
        phone: data.phone || "",
        role: data.role
      };

      if (data.role === 'vendor') {
        payload.company_name = data.companyName || "";
        payload.address = data.address || "";
        payload.contact_person = `${firstName} ${lastName}`;
      }

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/register`,
        payload
      );
      
      if (response.status === 201) {
        const { token, user } = response.data;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify({ ...user, token }));
        
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setSubmitError(error.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
      <div className="flex flex-col items-center mb-6">
        <Building2 className="h-12 w-12 text-blue-600 mb-2" />
        <h2 className="text-2xl font-semibold">Create Account</h2>
        <p className="text-sm text-gray-500">Get started with VendorSync</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700">
            Register As *
          </label>
          <div className="relative">
            <select
              id="role"
              {...register("role", { required: "Please select your role" })}
              className="mt-1 w-full p-3 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
            >
              <option value="">Select your role</option>
              <option value="manager">Procurement Manager</option>
              <option value="staff">Staff Member</option>
              <option value="vendor">Vendor/Supplier</option>
            </select>
            <UserCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
          </div>
          {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>}
        </div>

        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name *</label>
          <input
            id="fullName"
            type="text"
            {...register("fullName", { required: "Full name is required" })}
            className="mt-1 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="John Doe"
          />
          {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email *</label>
          <input
            id="email"
            type="email"
            {...register("email", { 
              required: "Email is required", 
              pattern: { value: /^\S+@\S+$/i, message: "Invalid email" } 
            })}
            className="mt-1 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="your.email@company.com"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>

        {selectedRole === 'vendor' && (
          <>
            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">Company Name *</label>
              <input
                id="companyName"
                type="text"
                {...register("companyName", { 
                  required: selectedRole === 'vendor' ? "Company name is required for vendors" : false 
                })}
                className="mt-1 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="ABC Construction Co."
              />
              {errors.companyName && <p className="text-red-500 text-sm mt-1">{errors.companyName.message}</p>}
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
              <input
                id="address"
                type="text"
                {...register("address")}
                className="mt-1 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="123 Main Street, Nairobi"
              />
            </div>
          </>
        )}

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
          <input
            id="phone"
            type="text"
            {...register("phone")}
            className="mt-1 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0712 345 678"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password *</label>
          <input
            id="password"
            type="password"
            {...register("password", { 
              required: "Password is required", 
              minLength: { value: 6, message: "Min 6 characters" } 
            })}
            className="mt-1 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="••••••••"
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password *</label>
          <input
            id="confirmPassword"
            type="password"
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) => value === password || "Passwords do not match"
            })}
            className="mt-1 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="••••••••"
          />
          {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
        </div>

        {selectedRole === 'vendor' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> Vendor accounts require manager approval before you can submit quotes.
            </p>
          </div>
        )}

        {submitError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {submitError}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition disabled:bg-blue-300 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </button>

        <div className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 underline">Log in here</Link>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;