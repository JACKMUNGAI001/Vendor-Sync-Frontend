import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import QuoteForm from '../components/QuoteForm';
import { FileText, DollarSign, Clock, CheckCircle, XCircle } from 'lucide-react';

const Quotes = () => {
  const { user } = useAuth();
  const [quotes, setQuotes] = useState([]);
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role === 'vendor') {
      loadVendorQuotes();
    }
  }, [user]);

  const loadVendorQuotes = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/dashboard`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        const quoteData = data.filter(item => item.type === 'quote');
        setQuotes(quoteData);
      }
    } catch (error) {
      console.error('Failed to load quotes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewQuote = (orderId) => {
    setSelectedOrderId(orderId);
    setShowQuoteForm(true);
  };

  const handleQuoteSubmitted = () => {
    setShowQuoteForm(false);
    setSelectedOrderId(null);
    loadVendorQuotes();
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'accepted': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (showQuoteForm) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-2xl mx-auto">
          <QuoteForm 
            orderId={selectedOrderId}
            onSubmitSuccess={handleQuoteSubmitted}
            onCancel={() => setShowQuoteForm(false)}
          />
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
                <h1 className="text-2xl font-bold text-gray-900">My Quotes</h1>
                <p className="text-gray-600">Manage your quote submissions</p>
              </div>
              <button
                onClick={() => handleNewQuote('new')}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition flex items-center gap-2"
              >
                <DollarSign className="h-4 w-4" />
                <span>New Quote</span>
              </button>
            </div>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : quotes.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Quotes Yet</h3>
                <p className="text-gray-500 mb-6">
                  You haven't submitted any quotes yet. Start by creating your first quote.
                </p>
                <button
                  onClick={() => handleNewQuote('new')}
                  className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition flex items-center gap-2 mx-auto"
                >
                  <DollarSign className="h-4 w-4" />
                  <span>Submit Your First Quote</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {quotes.map((quote) => (
                  <div key={quote.id} className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 transition">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{quote.description}</h3>
                        <p className="text-gray-600">Quote #{quote.id}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(quote.status)}
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(quote.status)}`}>
                          {quote.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Price</p>
                        <p className="text-lg font-semibold text-gray-900">
                          ${quote.price ? quote.price.toLocaleString() : '0.00'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Submitted</p>
                        <p className="text-gray-900">
                          {quote.created_at ? new Date(quote.created_at).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Order</p>
                        <p className="text-gray-900">#{quote.id}</p>
                      </div>
                    </div>

                    {quote.notes && (
                      <div className="mt-4">
                        <p className="text-sm text-gray-600 mb-1">Notes</p>
                        <p className="text-gray-900 bg-gray-50 p-3 rounded">{quote.notes}</p>
                      </div>
                    )}
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

export default Quotes;