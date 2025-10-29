import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

function Dashboard() {
    const { user } = useAuth();
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, [user]);

    const fetchDashboardData = async () => {
        try {
            const response = await axios.get('https://vendor-sync-backend-4bre.onrender.com/dashboard', {
                headers: { 
                    Authorization: `Bearer ${user.token}`,
                    'Content-Type': 'application/json'
                }
            });
            setDashboardData(response.data);
        } catch (error) {
            console.error('Dashboard error:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 p-8">
                <div className="max-w-6xl mx-auto">
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="animate-pulse">Loading dashboard...</div>
                    </div>
                </div>
            </div>
        );
    }

    if (!dashboardData) {
        return (
            <div className="min-h-screen bg-gray-100 p-8">
                <div className="max-w-6xl mx-auto">
                    <div className="bg-white rounded-lg shadow p-6">
                        <p className="text-red-500">Failed to load dashboard data.</p>
                    </div>
                </div>
            </div>
        );
    }

    const { stats, recent_activity } = dashboardData;

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-lg shadow p-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
                    <p className="text-gray-600 mb-6">Welcome back, {user.firstName}!</p>
                    
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {Object.entries(stats).map(([key, value]) => (
                            <div key={key} className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                <h3 className="font-semibold text-blue-800 capitalize">
                                    {key.replace(/_/g, ' ')}
                                </h3>
                                <p className="text-2xl font-bold text-blue-600">{value}</p>
                            </div>
                        ))}
                    </div>

                    {/* Quick Actions */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                        <div className="flex flex-wrap gap-4">
                            {user.role === 'manager' && (
                                <>
                                    <Link to="/orders/new" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
                                        Create New Order
                                    </Link>
                                    <Link to="/orders" className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition">
                                        Manage Orders
                                    </Link>
                                </>
                            )}
                            {user.role === 'vendor' && (
                                <Link to="/quotes" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
                                    Submit Quotes
                                </Link>
                            )}
                            {user.role === 'staff' && (
                                <Link to="/orders" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
                                    View Assigned Orders
                                </Link>
                            )}
                            <Link to="/search" className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition">
                                Search
                            </Link>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-gray-50 rounded-lg p-6">
                        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
                        {recent_activity.length === 0 ? (
                            <p className="text-gray-500">No recent activity.</p>
                        ) : (
                            <div className="space-y-4">
                                {recent_activity.map((activity) => (
                                    <div key={activity.id} className="bg-white p-4 rounded border">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-medium">{activity.description}</p>
                                                <p className="text-sm text-gray-500 capitalize">
                                                    {activity.type} • {activity.status}
                                                </p>
                                            </div>
                                            <span className="text-sm text-gray-400">
                                                {new Date(activity.created_at || activity.assigned_at).toLocaleDateString()}
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
}

export default Dashboard;