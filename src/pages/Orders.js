import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

function Orders() {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [staffMembers, setStaffMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAssignmentForm, setShowAssignmentForm] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        fetchOrders();
        if (user.role === 'manager') {
            fetchStaffMembers();
        }
    }, [user]);

    const fetchOrders = async () => {
        try {
            const response = await axios.get('https://vendor-sync-backend-4bre.onrender.com/orders', {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setOrders(response.data.orders || []);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStaffMembers = async () => {
        // In a real app, you'd have a staff endpoint. For now, we'll use the seed data
        setStaffMembers([
            { id: 2, name: 'Jane Staff', email: 'staff@vendorsync.com' }
        ]);
    };

    const assignOrder = async (orderId, staffId, notes) => {
        try {
            await axios.post('https://vendor-sync-backend-4bre.onrender.com/order-assignments', {
                order_id: orderId,
                staff_id: staffId,
                notes: notes
            }, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            alert('Order assigned successfully!');
            setShowAssignmentForm(false);
            fetchOrders();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to assign order');
        }
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            await axios.patch(`https://vendor-sync-backend-4bre.onrender.com/orders/${orderId}`, {
                status: newStatus
            }, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            alert('Order status updated!');
            fetchOrders();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to update order status');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 p-8">
                <div className="max-w-6xl mx-auto">
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="animate-pulse">Loading orders...</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-lg shadow p-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">Orders</h1>

                    {user.role === 'manager' && (
                        <div className="mb-6">
                            <button
                                onClick={() => setShowAssignmentForm(!showAssignmentForm)}
                                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
                            >
                                {showAssignmentForm ? 'Cancel Assignment' : 'Assign Order to Staff'}
                            </button>

                            {showAssignmentForm && (
                                <div className="mt-4 p-6 border rounded-lg bg-gray-50">
                                    <h3 className="text-xl font-semibold mb-4">Assign Order</h3>
                                    <div className="grid gap-4">
                                        <select
                                            onChange={(e) => setSelectedOrder(orders.find(o => o.id === parseInt(e.target.value)))}
                                            className="p-3 border rounded-md"
                                        >
                                            <option value="">Select Order</option>
                                            {orders.map(order => (
                                                <option key={order.id} value={order.id}>
                                                    Order #{order.id} - {order.material_list && Object.keys(order.material_list)[0]}
                                                </option>
                                            ))}
                                        </select>

                                        {selectedOrder && (
                                            <div className="space-y-4">
                                                <select id="staffSelect" className="p-3 border rounded-md w-full">
                                                    <option value="">Select Staff Member</option>
                                                    {staffMembers.map(staff => (
                                                        <option key={staff.id} value={staff.id}>
                                                            {staff.name} - {staff.email}
                                                        </option>
                                                    ))}
                                                </select>
                                                <textarea
                                                    placeholder="Assignment notes (optional)"
                                                    id="assignmentNotes"
                                                    className="p-3 border rounded-md w-full"
                                                    rows="3"
                                                />
                                                <button
                                                    onClick={() => {
                                                        const staffId = document.getElementById('staffSelect').value;
                                                        const notes = document.getElementById('assignmentNotes').value;
                                                        if (staffId) {
                                                            assignOrder(selectedOrder.id, staffId, notes);
                                                        } else {
                                                            alert('Please select a staff member');
                                                        }
                                                    }}
                                                    className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
                                                >
                                                    Assign Order
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="space-y-6">
                        {orders.length === 0 ? (
                            <p className="text-gray-500 text-center py-8">No orders found.</p>
                        ) : (
                            orders.map(order => (
                                <div key={order.id} className="border rounded-lg p-6 bg-white">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <h3 className="text-xl font-semibold">Order #{order.id}</h3>
                                            <p className="text-gray-600">Vendor: {order.vendor_name || 'Unknown'}</p>
                                            <p className="text-gray-600">Status: 
                                                <span className={`ml-2 px-2 py-1 rounded-full text-sm ${
                                                    order.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                    order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                    order.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                    {order.status}
                                                </span>
                                            </p>
                                            
                                            {order.material_list && Object.entries(order.material_list).map(([material, details]) => (
                                                <div key={material} className="mt-2 p-3 bg-gray-50 rounded">
                                                    <p className="font-medium">{material}</p>
                                                    <p>Quantity: {details.quantity} {details.unit}</p>
                                                    {details.specifications && (
                                                        <p>Specifications: {details.specifications}</p>
                                                    )}
                                                </div>
                                            ))}

                                            {(user.role === 'staff' || user.role === 'vendor') && (
                                                <div className="mt-4">
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Update Status:
                                                    </label>
                                                    <select
                                                        value={order.status}
                                                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                                        className="p-2 border rounded-md"
                                                    >
                                                        <option value="pending">Pending</option>
                                                        <option value="in_progress">In Progress</option>
                                                        <option value="delivered">Delivered</option>
                                                        <option value="completed">Completed</option>
                                                        <option value="cancelled">Cancelled</option>
                                                    </select>
                                                </div>
                                            )}
                                        </div>
                                        <span className="text-sm text-gray-500">
                                            {new Date(order.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Orders;