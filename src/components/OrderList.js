// OrderList component will be implemented here
import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

function OrderList() {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError('');
      try {
        const endpoint = user.role === 'vendor' ? '/orders/vendor' : '/orders';
        const response = await axios.get(`http://localhost:5000${endpoint}?page=${page}&per_page=10`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        
        // Handle both array and paginated response formats
        if (Array.isArray(response.data)) {
          setOrders(response.data);
          setTotalPages(1);
        } else if (response.data.orders) {
          setOrders(response.data.orders);
          setTotalPages(response.data.total_pages || 1);
        } else {
          setOrders(response.data);
          setTotalPages(1);
        }
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to fetch orders');
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (user) fetchOrders();
  }, [user, page]);


  const updateStatus = async (orderId, status) => {
    try {
      await axios.patch(`http://localhost:5000/orders/${orderId}`, 
        { status }, 
        {
          headers: { Authorization: `Bearer ${user.token}` }
        }
      );
      // Update local state
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status } : order
      ));
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update order status');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }
