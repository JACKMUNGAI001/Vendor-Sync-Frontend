import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Package, Calendar, DollarSign, FileText, AlertCircle } from 'lucide-react';

const VendorRequirements = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [requirements, setRequirements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // all, available, quoted

  useEffect(() => {
    if (user?.role === 'vendor') {
      fetchRequirements();
    }
  }, [user]);

  const fetchRequirements = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/requirements`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch requirements');
      }

      const data = await response.json();
      
      // Handle different response formats
      const requirementsArray = Array.isArray(data) 
        ? data 
        : (data.requirements || data.data || []);
      
      setRequirements(requirementsArray);
    } catch (err) {
      console.error('Failed to load requirements:', err);
      setError('Failed to load requirements. Please try again.');
      setRequirements([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitQuote = (requirementId) => {
    // Navigate to quotes page with requirement ID
    navigate(`/quotes?requirement_id=${requirementId}`);
  };

  const filteredRequirements = requirements.filter(req => {
    if (filter === 'available') {
      return req.status === 'open' || req.status === 'pending';
    }
    if (filter === 'quoted') {
      return req.has_quoted === true;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Requirements</h1>
                <p className="text-gray-600">View and submit quotes for available requirements</p>
              </div>
              
              {/* Filter Tabs */}
              <div className="flex gap-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 rounded-md transition ${
                    filter === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter('available')}
                  className={`px-4 py-2 rounded-md transition ${
                    filter === 'available'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Available
                </button>
                <button
                  onClick={() => setFilter('quoted')}
                  className={`px-4 py-2 rounded-md transition ${
                    filter === 'quoted'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  My Quotes
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
              </div>
            ) : filteredRequirements.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Requirements Found
                </h3>
                <p className="text-gray-500">
                  {filter === 'available' 
                    ? 'There are no open requirements at the moment.'
                    : filter === 'quoted'
                    ? "You haven't submitted any quotes yet."
                    : 'No requirements available.'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredRequirements.map((req) => (
                  <div
                    key={req.id}
                    className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 transition"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {req.product_name}
                          </h3>
                          {req.has_quoted && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                              Quoted
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600">Requirement #{req.id}</p>
                      </div>
                      
                      {!req.has_quoted && (req.status === 'open' || req.status === 'pending') && (
                        <button
                          onClick={() => handleSubmitQuote(req.id)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition flex items-center gap-2"
                        >
                          <DollarSign className="h-4 w-4" />
                          Submit Quote
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-start gap-3">
                        <Package className="h-5 w-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-600">Quantity</p>
                          <p className="text-gray-900 font-medium">
                            {req.quantity} {req.unit || 'units'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-600">Delivery Date</p>
                          <p className="text-gray-900 font-medium">
                            {req.delivery_date 
                              ? new Date(req.delivery_date).toLocaleDateString()
                              : 'Not specified'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <FileText className="h-5 w-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-600">Status</p>
                          <p className="text-gray-900 font-medium capitalize">
                            {req.status || 'Open'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {req.description && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-sm text-gray-600 mb-1">Description</p>
                        <p className="text-gray-900">{req.description}</p>
                      </div>
                    )}

                    {req.specifications && (
                      <div className="mt-3">
                        <p className="text-sm text-gray-600 mb-1">Specifications</p>
                        <p className="text-gray-900 bg-gray-50 p-3 rounded">
                          {req.specifications}
                        </p>
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

export default VendorRequirements;