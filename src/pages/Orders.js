import React from 'react';
import OrderList from '../components/OrderList';

function Orders() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <OrderList />
      </div>
    </div>
  );
}

export default Orders;