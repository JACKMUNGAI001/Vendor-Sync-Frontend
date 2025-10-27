import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import dayjs from 'dayjs'; // ADD

function OrderList() {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const endpoint = user.role === 'vendor' ? '/orders/vendor' : '/orders';
        const response = await axios.get(`http://localhost:5000${endpoint}?page=${page}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setOrders(response.data);
      } catch (error) {
        alert(error.response.data.message);
      }
    };
    if (user) fetchOrders();
  }, [user, page]);

  const updateStatus = async (orderId, status) => {
    try {
      await axios.patch(`http://localhost:5000/orders/${orderId}`, { status }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setOrders(orders.map(o => o.id === orderId ? { ...o, status } : o));
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Orders</h1>
      <ul className="mt-4">
        {orders.map(order => (
          <li key={order.id} className="p-2 border-b">
            <p>Order #{order.id}: {order.status}</p>
            <p className="text-sm text-gray-500">
              {dayjs(order.created_at).format('MMM D, YYYY')}
            </p>
            {user.role === 'staff' && (
              <select
                onChange={(e) => updateStatus(order.id, e.target.value)}
                className="p-2 border rounded"
              >
                <option value="pending">Pending</option>
                <option value="delivered">Delivered</option>
                <option value="inspected">Inspected</option>
              </select>
            )}
          </li>
        ))}
      </ul>
      <div className="mt-4">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className="p-2 bg-gray-300 rounded mr-2"
        >
          Previous
        </button>
        <button
          onClick={() => setPage(page + 1)}
          className="p-2 bg-gray-300 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default OrderList;