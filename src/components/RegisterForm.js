import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { Building2 } from "lucide-react";
import axios from "axios";

function RegisterForm() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm({ mode: "onTouched" });
  const navigate = useNavigate();
  const password = watch("password", "");

  const onSubmit = async (data) => {
    try {
      const nameParts = data.fullName.split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";
      
      const payload = {
        first_name: firstName,
        last_name: lastName,
        email: data.email,
        password: data.password,
        phone: data.phone || "",
        company_name: data.companyName || ""
      };

      const response = await axios.post("https://vendor-sync-backend-4bre.onrender.com/register", payload);
      
      if (response.status === 201) {
        alert("Registration successful! You can now log in.");
        navigate("/login");
      } else {
        alert(response.data.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Signup failed:", error);
      const errorMessage = error.response?.data?.message || error.message || "An error occurred during signup.";
      alert(errorMessage);
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
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
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
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input
            id="email"
            type="email"
            {...register("email", { required: "Email is required", pattern: { value: /^\S+@\S+$/i, message: "Invalid email" } })}
            className="mt-1 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="your.email@company.com"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">Company Name</label>
          <input
            id="companyName"
            type="text"
            {...register("companyName", { required: "Company name is required" })}
            className="mt-1 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="ABC Construction Co."
          />
          {errors.companyName && <p className="text-red-500 text-sm mt-1">{errors.companyName.message}</p>}
        </div>

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
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
          <input
            id="password"
            type="password"
            {...register("password", { required: "Password is required", minLength: { value: 6, message: "Min 6 characters" } })}
            className="mt-1 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="••••••••"
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
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

        <button
          type="submit"
          className="w-full mt-2 bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition"
        >
          Create Account
        </button>

        <div className="text-center mt-3 text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">Log in here</Link>
        </div>
      </form>
    </div>
  );
}

export default RegisterForm;