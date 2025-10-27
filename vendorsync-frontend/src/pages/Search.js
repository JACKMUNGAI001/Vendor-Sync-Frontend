import React, { useState } from 'react';
import SearchBar from '../components/SearchBar';

function Search() {
  const [recentSearches, setRecentSearches] = useState([]);

  const addToRecentSearches = (query) => {
    if (query.trim() && !recentSearches.includes(query)) {
      setRecentSearches(prev => [query, ...prev.slice(0, 4)]);
    }
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Search VendorSync
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Find vendors, orders, and quotes quickly with our powerful search
          </p>
          
          <div className="mb-8">
            <SearchBar />
          </div>

          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Recent Searches</h2>
                <button
                  onClick={clearRecentSearches}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Clear all
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => addToRecentSearches(search)}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm transition-colors"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search Tips */}
          <div className="bg-white rounded-lg shadow-md p-6 mt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Search Tips</h2>
            <div className="grid md:grid-cols-2 gap-4 text-left">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">For Vendors</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Search by vendor name</li>
                  <li>• Search by contact email</li>
                  <li>• Filter by vendor type</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">For Orders & Quotes</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Search by order ID</li>
                  <li>• Search by material name</li>
                  <li>• Filter by status</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Search;