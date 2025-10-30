import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, Edit, Trash2, Plus, FileText, DollarSign } from 'lucide-react';
import axios from 'axios';
import QuoteForm from './QuoteForm';

const OrderList = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.token) return;
      
      try {
        setLoading(true);
        const response = await axios.get('https://vendor-sync-backend-4bre.onrender.com/orders', {
          headers: { 
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        });
        setOrders(response.data.orders || []);
        setError('');
      } catch (error) {
        console.error('Orders fetch error:', error);
        setError(error.response?.data?.message || 'Failed to load orders');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, [user]);

  const handleQuoteSubmit = (orderId) => {
    setSelectedOrderId(orderId);
    setShowQuoteForm(true);
  };

  const handleQuoteSubmitted = () => {
    setShowQuoteForm(false);
    setSelectedOrderId(null);
    // Refresh orders to reflect any status changes
    fetchOrders();
  };

  const fetchOrders = async () => {
    if (!user?.token) return;
    
    try {
      const response = await axios.get('https://vendor-sync-backend-4bre.onrender.com/orders', {
        headers: { 
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        }
      });
      setOrders(response.data.orders || []);
    } catch (error) {
      console.error('Orders fetch error:', error);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order?')) {
      return;
    }

    try {
      await axios.delete(`https://vendor-sync-backend-4bre.onrender.com/orders/${orderId}`, {
        headers: { 
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        }
      });
      
      // Remove the order from the local state
      setOrders(orders.filter(order => order.id !== orderId));
      alert('Order deleted successfully!');
    } catch (error) {
      console.error('Delete order error:', error);
      alert(error.response?.data?.message || 'Failed to delete order');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'ordered': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-purple-100 text-purple-800';
      case 'inspected': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (showQuoteForm) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-4">
            <button
              onClick={() => setShowQuoteForm(false)}
              className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
            >
              ← Back to Orders
            </button>
          </div>
          <QuoteForm 
            orderId={selectedOrderId}
            onSubmitSuccess={handleQuoteSubmitted}
            onCancel={() => setShowQuoteForm(false)}
          />
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="animate-pulse flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                <p>Loading orders...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
                <p className="text-gray-600">Manage your purchase orders</p>
              </div>
              {user?.role === 'manager' && (
                <Link
                  to="/orders/new"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>New Order</span>
                </Link>
              )}
            </div>
          </div>

          <div className="p-6">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                {error}
              </div>
            )}

            {orders.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg mb-2">No orders found</p>
                <p className="text-gray-400 mb-6">Get started by creating your first order</p>
                {user?.role === 'manager' && (
                  <Link
                    to="/orders/new"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition inline-flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Create Order</span>
                  </Link>
                )}
                {user?.role === 'vendor' && (
                  <p className="text-gray-500">You will see orders here when they are assigned to you.</p>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order #
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Vendor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Materials
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Delivery Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">#{order.id}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{order.vendor_name || 'N/A'}</div>
                          <div className="text-sm text-gray-500">{order.manager_email || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {order.material_list && Object.keys(order.material_list).map(material => (
                              <div key={material} className="mb-1">
                                <span className="font-medium">{material}</span>: {order.material_list[material].quantity} {order.material_list[material].unit}
                                {order.material_list[material].specifications && (
                                  <div className="text-xs text-gray-500 mt-1">
                                    {order.material_list[material].specifications}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.delivery_date ? new Date(order.delivery_date).toLocaleDateString() : 'Not set'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(order.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button 
                              className="text-blue-600 hover:text-blue-900"
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            
                            {user?.role === 'manager' && (
                              <>
                                <button 
                                  className="text-green-600 hover:text-green-900"
                                  title="Edit Order"
                                >
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button 
                                  onClick={() => handleDeleteOrder(order.id)}
                                  className="text-red-600 hover:text-red-900"
                                  title="Delete Order"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </>
                            )}
                            
                            {/* Vendor Quote Submission */}
                            {user?.role === 'vendor' && order.status === 'pending' && (
                              <button 
                                onClick={() => handleQuoteSubmit(order.id)}
                                className="text-green-600 hover:text-green-900"
                                title="Submit Quote"
                              >
                                <DollarSign className="h-4 w-4" />
                              </button>
                            )}
                            
                            {/* Staff Actions */}
                            {user?.role === 'staff' && (
                              <button 
                                className="text-purple-600 hover:text-purple-900"
                                title="Update Status"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Order Statistics */}
        {orders.length > 0 && (
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {orders.filter(order => order.status === 'pending').length}
              </div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {orders.filter(order => order.status === 'completed').length}
              </div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {orders.filter(order => order.status === 'ordered').length}
              </div>
              <div className="text-sm text-gray-600">Ordered</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {orders.filter(order => order.status === 'delivered').length}
              </div>
              <div className="text-sm text-gray-600">Delivered</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderList;