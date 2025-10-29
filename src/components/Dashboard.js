import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function Dashboard() {
    const { user } = useAuth();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await axios.get('https://vendor-sync-backend-4bre.onrender.com/dashboard', {
                    headers: { 
                        Authorization: `Bearer ${user.token}`,
                        'Content-Type': 'application/json'
                    }
                });
                setData(response.data);
                setError('');
            } catch (error) {
                console.error('Dashboard error:', error);
                setError(error.response?.data?.message || 'Failed to load dashboard');
            } finally {
                setLoading(false);
            }
        };
        
        if (user && user.token) {
            fetchData();
        }
    }, [user]);

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

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-lg shadow p-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
                    <p className="text-gray-600 mb-6">Welcome back, {user.firstName}!</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <h3 className="font-semibold text-blue-800">Role</h3>
                            <p className="text-2xl font-bold text-blue-600 capitalize">{user.role}</p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg">
                            <h3 className="font-semibold text-green-800">Items</h3>
                            <p className="text-2xl font-bold text-green-600">{data.length}</p>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg">
                            <h3 className="font-semibold text-purple-800">Status</h3>
                            <p className="text-2xl font-bold text-purple-600">Active</p>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                            {error}
                        </div>
                    )}

                    <div className="bg-gray-50 rounded-lg p-6">
                        <h2 className="text-xl font-semibold mb-4">Your {user.role === 'vendor' ? 'Orders' : 'Activities'}</h2>
                        {data.length === 0 ? (
                            <p className="text-gray-500">No items found.</p>
                        ) : (
                            <div className="space-y-4">
                                {data.map((item) => (
                                    <div key={item.id} className="bg-white p-4 rounded border">
                                        <p className="font-medium">{item.description}</p>
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