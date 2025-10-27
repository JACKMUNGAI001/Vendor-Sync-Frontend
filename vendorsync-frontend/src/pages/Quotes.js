import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import QuoteForm from '../components/QuoteForm';
import CloudinaryUpload from '../components/CloudinaryUpload';

function Quotes() {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [activeTab, setActiveTab] = useState('submit');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        if (user.role === 'vendor') {
          const ordersResponse = await axios.get('http://localhost:5000/orders/vendor', {
            headers: { Authorization: `Bearer ${user.token}` }
          });
          setOrders(ordersResponse.data);

          const quotesResponse = await axios.get('http://localhost:5000/quotes/vendor', {
            headers: { Authorization: `Bearer ${user.token}` }
          });
          setQuotes(quotesResponse.data);
        } else if (user.role === 'manager') {
          const quotesResponse = await axios.get('http://localhost:5000/quotes', {
            headers: { Authorization: `Bearer ${user.token}` }
          });
          setQuotes(quotesResponse.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        alert(error.response?.data?.message || 'Failed to fetch data');
      }
    };

    fetchData();
  }, [user, refreshTrigger]);

  const handleQuoteAccept = async (quoteId) => {
    if (!confirm('Are you sure you want to accept this quote?')) return;

    try {
      await axios.patch(`http://localhost:5000/quotes/${quoteId}`, 
        { status: 'accepted' }, 
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      alert('Quote accepted successfully!');
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error('Error accepting quote:', error);
      alert(error.response?.data?.message || 'Failed to accept quote');
    }
  };

  const handleQuoteReject = async (quoteId) => {
    if (!confirm('Are you sure you want to reject this quote?')) return;

    try {
      await axios.patch(`http://localhost:5000/quotes/${quoteId}`, 
        { status: 'rejected' }, 
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      alert('Quote rejected successfully!');
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error('Error rejecting quote:', error);
      alert(error.response?.data?.message || 'Failed to reject quote');
    }
  };

  const refreshData = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Quotes Management</h1>
          <p className="mt-2 text-gray-600">
            {user?.role === 'vendor' 
              ? 'Submit quotes for orders and track their status' 
              : 'Review and manage vendor quotes'}
          </p>
        </div>

        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {user?.role === 'vendor' && (
              <button
                onClick={() => setActiveTab('submit')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'submit'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Submit Quote
              </button>
            )}
            <button
              onClick={() => setActiveTab('review')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'review'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {user?.role === 'vendor' ? 'My Quotes' : 'Review Quotes'}
            </button>
            {user?.role === 'vendor' && (
              <button
                onClick={() => setActiveTab('uploads')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'uploads'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Document Uploads
              </button>
            )}
          </nav>
        </div>

        <div className="space-y-6">
          {activeTab === 'submit' && user?.role === 'vendor' && (
            <div className="grid gap-6">
              <h2 className="text-xl font-semibold">Available Orders for Quoting</h2>
              {orders.length === 0 ? (
                <div className="card text-center py-12">
                  <p className="text-gray-500">No orders available for quoting at the moment.</p>
                </div>
              ) : (
                orders.map(order => (
                  <div key={order.id} className="card">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">Order #{order.id}</h3>
                        <p className="text-gray-600">Materials: {order.material_list?.length || 0} items</p>
                        <p className="text-sm text-gray-500">Status: <span className="capitalize">{order.status}</span></p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'accepted' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <QuoteForm 
                      orderId={order.id} 
                      onSubmitSuccess={refreshData}
                    />
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'review' && (
            <div className="card">
              <h2 className="text-xl font-semibold mb-6">
                {user?.role === 'vendor' ? 'My Submitted Quotes' : 'Quotes for Review'}
              </h2>
              
              {quotes.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No quotes found.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Quote ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Order ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        {user?.role === 'manager' && (
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {quotes.map(quote => (
                        <tr key={quote.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            #{quote.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            Order #{quote.order_id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ${parseFloat(quote.price).toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              quote.status === 'accepted' ? 'bg-green-100 text-green-800' :
                              quote.status === 'rejected' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {quote.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(quote.created_at).toLocaleDateString()}
                          </td>
                          {user?.role === 'manager' && quote.status === 'pending' && (
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                              <button
                                onClick={() => handleQuoteAccept(quote.id)}
                                className="text-green-600 hover:text-green-900"
                              >
                                Accept
                              </button>
                              <button
                                onClick={() => handleQuoteReject(quote.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Reject
                              </button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'uploads' && user?.role === 'vendor' && (
            <div className="grid gap-6">
              <h2 className="text-xl font-semibold">Document Uploads</h2>
              {orders.map(order => (
                <div key={order.id} className="card">
                  <h3 className="text-lg font-semibold mb-4">Order #{order.id}</h3>
                  <CloudinaryUpload 
                    orderId={order.id}
                    fileType="invoice"
                    onUploadSuccess={refreshData}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Quotes;