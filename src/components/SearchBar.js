import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Search, Building2, FileText, DollarSign, Package } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);
  const { user } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = async (searchQuery) => {
    setQuery(searchQuery);
    
    if (!searchQuery.trim()) {
      setResults([]);
      setShowResults(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/search`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        params: { query: searchQuery },
      });
      
      setResults(response.data);
      setShowResults(true);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getResultIcon = (type) => {
    switch (type) {
      case 'vendor': return <Building2 className="h-4 w-4" />;
      case 'order': return <FileText className="h-4 w-4" />;
      case 'quote': return <DollarSign className="h-4 w-4" />;
      case 'requirement': return <Package className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getResultColor = (type) => {
    switch (type) {
      case 'vendor': return 'text-blue-600';
      case 'order': return 'text-green-600';
      case 'quote': return 'text-purple-600';
      case 'requirement': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  const formatResultText = (result) => {
    switch (result.type) {
      case 'vendor':
        return `Vendor • ${result.email || 'No email'}`;
      case 'order':
        return `Order • ${result.order_number || 'N/A'} • ${result.status || 'Unknown status'}`;
      case 'quote':
        return `Quote • $${result.price ? result.price.toLocaleString() : '0.00'} • ${result.status || 'Pending'}`;
      case 'requirement':
        return `Requirement • ${result.item_name} • Qty: ${result.quantity}`;
      default:
        return 'Item';
    }
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search vendors, orders, quotes, requirements..."
          className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        {isLoading && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>

      {showResults && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-96 overflow-y-auto z-50">
          {results.map((result) => (
            <Link
              to={`/${result.type}s/${result.id}`}
              key={`${result.type}-${result.id}`}
              className="block px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors duration-150"
            >
              <div className="flex items-center space-x-3">
                <span className={`flex-shrink-0 ${getResultColor(result.type)}`}>
                  {getResultIcon(result.type)}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-gray-900 truncate">
                      {result.name || result.item_name || result.order_number || `ID: ${result.id}`}
                    </h4>
                    <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full capitalize flex-shrink-0 ml-2">
                      {result.type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">
                    {formatResultText(result)}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {showResults && query && !isLoading && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 p-4">
          <p className="text-gray-500 text-center">No results found for "{query}"</p>
        </div>
      )}
    </div>
  );
};

export default SearchBar;