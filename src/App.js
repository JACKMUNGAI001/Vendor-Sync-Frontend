import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import NewOrder from './pages/NewOrder';
import Quotes from './pages/Quotes';
import Search from './pages/Search';
import Requirements from './pages/Requirements';
import VendorCategories from './pages/VendorCategories';
import Vendors from './pages/Vendors';
import Users from './pages/Users';
import VendorRequirements from './pages/VendorRequirements'; // Add this import

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/orders" 
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/orders/new" 
            element={
              <ProtectedRoute requiredRole="manager">
                <NewOrder />
              </ProtectedRoute>
            } 
          />

          {/* Manager Routes */}
          <Route 
            path="/requirements" 
            element={
              <ProtectedRoute requiredRole="manager">
                <Requirements />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/vendor-categories" 
            element={
              <ProtectedRoute requiredRole="manager">
                <VendorCategories />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/vendors" 
            element={
              <ProtectedRoute requiredRole="manager">
                <Vendors />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/users" 
            element={
              <ProtectedRoute requiredRole="manager">
                <Users />
              </ProtectedRoute>
            } 
          />

          {/* Vendor Routes */}
          <Route 
            path="/quotes" 
            element={
              <ProtectedRoute requiredRole="vendor">
                <Quotes />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/vendor/requirements" 
            element={
              <ProtectedRoute requiredRole="vendor">
                <VendorRequirements />
              </ProtectedRoute>
            } 
          />
          
          {/* General Protected Route */}
          <Route 
            path="/search" 
            element={
              <ProtectedRoute>
                <Search />
              </ProtectedRoute>
            } 
          />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;