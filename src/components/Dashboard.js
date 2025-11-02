import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Building2, Users, Package, Plus, FileText, Search, LogOut } from 'lucide-react';
import axios from 'axios';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.token) return;
      try {
        setLoading(true);
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/dashboard`, {
          headers: { 
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        });
        setDashboardData(response.data);
        setError('');
      } catch (error) {
        console.error('Dashboard error:', error);
        setError(error.response?.data?.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'manager': return 'bg-blue-100 text-blue-800';
      case 'staff': return 'bg-green-100 text-green-800';
      case 'vendor': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'manager': return <Building2 className="h-5 w-5" />;
      case 'staff': return <Users className="h-5 w-5" />;
      case 'vendor': return <Package className="h-5 w-5" />;
      default: return <Building2 className="h-5 w-5" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-6xl mx-auto p-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="animate-pulse">Loading dashboard...</div>
          </div>
        </div>
      </div>
    );
  }

  const itemsToDisplay =
    user?.role === 'vendor'
      ? dashboardData?.pending_quotes
      : dashboardData?.recent_orders;

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Building2 className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-blue-600">VendorSync</span>
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(user?.role)}`}>
                {getRoleIcon(user?.role)}
                <span className="capitalize">{user?.role}</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user?.first_name}!</span>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.first_name}! Here's your overview.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Role</p>
                <p className="text-2xl font-bold text-gray-900 capitalize">{user?.role}</p>
              </div>
              <div className={`p-3 rounded-lg ${getRoleColor(user?.role).split(' ')[0]}`}>
                {getRoleIcon(user?.role)}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Items</p>
                <p className="text-2xl font-bold text-gray-900">{itemsToDisplay?.length || 0}</p>
              </div>
              <div className="p-3 rounded-lg bg-green-100">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Status</p>
                <p className="text-2xl font-bold text-gray-900">Active</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-100">
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div className="lg:col-span-1 bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link
                to="/orders"
                className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition"
              >
                <FileText className="h-5 w-5 text-blue-600" />
                <span>View Orders</span>
              </Link>
              <Link
                to="/search"
                className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition"
              >
                <Search className="h-5 w-5 text-blue-600" />
                <span>Search</span>
              </Link>
              {user?.role === 'manager' && (
                <Link
                  to="/orders/new"
                  className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition"
                >
                  <Plus className="h-5 w-5 text-blue-600" />
                  <span>Create Order</span>
                </Link>
              )}
              {user?.role === 'vendor' && (
                <Link
                  to="/quotes"
                  className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition"
                >
                  <FileText className="h-5 w-5 text-blue-600" />
                  <span>My Quotes</span>
                </Link>
              )}
              {user?.role === 'manager' && (
                <>
                  <Link
                    to="/requirements"
                    className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition"
                  >
                    <FileText className="h-5 w-5 text-blue-600" />
                    <span>Requirements</span>
                  </Link>
                  <Link
                    to="/vendor-categories"
                    className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition"
                  >
                    <Building2 className="h-5 w-5 text-blue-600" />
                    <span>Vendor Categories</span>
                  </Link>
                  <Link
                    to="/vendors"
                    className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition"
                  >
                    <Users className="h-5 w-5 text-blue-600" />
                    <span>Vendors</span>
                  </Link>
                  <Link
                    to="/users"
                    className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition"
                  >
                    <Users className="h-5 w-5 text-blue-600" />
                    <span>Users</span>
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="lg:col-span-3 bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">
                {user?.role === 'manager' && 'My Orders'}
                {user?.role === 'staff' && 'Assigned Orders'}
                {user?.role === 'vendor' && 'My Orders & Quotes'}
              </h3>
              <span className="text-sm text-gray-500">{itemsToDisplay?.length || 0} items</span>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                {error}
              </div>
            )}

            {!itemsToDisplay || itemsToDisplay.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No items found.</p>
                {user?.role === 'manager' && (
                  <Link
                    to="/orders/new"
                    className="inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                  >
                    Create Your First Order
                  </Link>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {itemsToDisplay.map((item) => (
                  <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">{item.order_number || item.description}</p>
                        <p className="text-sm text-gray-500 capitalize">{item.status || 'N/A'}</p>
                        {item.created_at && (
                          <p className="text-xs text-gray-400">
                            Created: {new Date(item.created_at).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.status === 'completed' ? 'bg-green-100 text-green-800' :
                        item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        item.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {item.status || 'active'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
