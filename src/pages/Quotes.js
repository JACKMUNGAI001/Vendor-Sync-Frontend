import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

function Quotes() {
    const { user } = useAuth();
    const [quotes, setQuotes] = useState([]);
    const [orders, setOrders] = useState([]);
    const [showQuoteForm, setShowQuoteForm] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchQuotes();
        if (user.role === 'vendor') {
            fetchOrdersForQuoting();
        }
    }, [user]);

    const fetchQuotes = async () => {
        try {
            const response = await axios.get('https://vendor-sync-backend-4bre.onrender.com/quotes', {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setQuotes(response.data.quotes || []);
        } catch (error) {
            console.error('Error fetching quotes:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchOrdersForQuoting = async () => {
        try {
            const response = await axios.get('https://vendor-sync-backend-4bre.onrender.com/orders', {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setOrders(response.data.orders || []);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    const submitQuote = async (orderId, price, notes) => {
        try {
            await axios.post('https://vendor-sync-backend-4bre.onrender.com/quotes', {
                order_id: orderId,
                price: parseFloat(price),
                notes: notes
            }, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            alert('Quote submitted successfully!');
            setShowQuoteForm(false);
            fetchQuotes();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to submit quote');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 p-8">
                <div className="max-w-6xl mx-auto">
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="animate-pulse">Loading quotes...</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-lg shadow p-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">Quotes</h1>

                    {user.role === 'vendor' && (
                        <div className="mb-8">
                            <button
                                onClick={() => setShowQuoteForm(!showQuoteForm)}
                                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
                            >
                                {showQuoteForm ? 'Cancel' : 'Submit New Quote'}
                            </button>

                            {showQuoteForm && (
                                <div className="mt-6 p-6 border rounded-lg bg-gray-50">
                                    <h3 className="text-xl font-semibold mb-4">Submit Quote</h3>
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
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    placeholder="Price"
                                                    id="quotePrice"
                                                    className="p-3 border rounded-md w-full"
                                                />
                                                <textarea
                                                    placeholder="Notes (optional)"
                                                    id="quoteNotes"
                                                    className="p-3 border rounded-md w-full"
                                                    rows="3"
                                                />
                                                <button
                                                    onClick={() => {
                                                        const price = document.getElementById('quotePrice').value;
                                                        const notes = document.getElementById('quoteNotes').value;
                                                        if (price) {
                                                            submitQuote(selectedOrder.id, price, notes);
                                                        } else {
                                                            alert('Please enter a price');
                                                        }
                                                    }}
                                                    className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
                                                >
                                                    Submit Quote
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="space-y-4">
                        {quotes.length === 0 ? (
                            <p className="text-gray-500 text-center py-8">No quotes found.</p>
                        ) : (
                            quotes.map(quote => (
                                <div key={quote.id} className="border rounded-lg p-6 bg-white">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-lg font-semibold">
                                                Quote #{quote.id} for Order #{quote.order_id}
                                            </h3>
                                            <p className="text-gray-600">Price: ${quote.price}</p>
                                            <p className="text-gray-600">Status: 
                                                <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                                                    quote.status === 'accepted' ? 'bg-green-100 text-green-800' :
                                                    quote.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                    'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                    {quote.status}
                                                </span>
                                            </p>
                                            {quote.notes && (
                                                <p className="text-gray-600 mt-2">Notes: {quote.notes}</p>
                                            )}
                                        </div>
                                        <span className="text-sm text-gray-500">
                                            {new Date(quote.created_at).toLocaleDateString()}
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

export default Quotes;