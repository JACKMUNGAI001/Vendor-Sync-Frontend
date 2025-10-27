import React, { useState, useEffect, useRef } from 'react';
import algoliasearch from 'algoliasearch/lite';

const client = algoliasearch('NUF1223K4R', '0ba760722de94835fbcc6eda8b20d872');
const index = client.initIndex('vendorsync');

function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);

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
      const { hits } = await index.search(searchQuery, {
        hitsPerPage: 10,
        attributesToRetrieve: ['name', 'type', 'id', 'status', 'price', 'material_list', 'contact_email'],
        attributesToHighlight: ['name', 'material_list']
      });
      
      setResults(hits);
      setShowResults(true);
    } catch (error) {
      console.error('Search error:', error);
      alert('Search failed. Please try again.');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getResultIcon = (type) => {
    switch (type) {
      case 'vendor': return '';
      case 'order': return '';
      case 'quote': return '';
      default: return '';
    }
  };

  const getResultUrl = (result) => {
    switch (result.type) {
      case 'vendor': return `/vendors/${result.id}`;
      case 'order': return `/orders/${result.id}`;
      case 'quote': return `/quotes`;
      default: return '#';
    }
  };

  const formatResultText = (result) => {
    switch (result.type) {
      case 'vendor':
        return `Vendor • ${result.contact_email || 'No email'}`;
      case 'order':
        const materialCount = result.material_list ? 
          (Array.isArray(result.material_list) ? result.material_list.length : 1) : 0;
        return `Order • ${materialCount} materials • ${result.status || 'Unknown status'}`;
      case 'quote':
        return `Quote • $${result.price ? parseFloat(result.price).toFixed(2) : '0.00'} • ${result.status || 'Pending'}`;
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
          placeholder="Search vendors, orders, quotes..."
          className="input-field pl-10 pr-4 w-full"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        {isLoading && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>

      {showResults && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg mt-1 max-h-96 overflow-y-auto z-50">
          {results.map((result) => (
            <a
              key={result.objectID}
              href={getResultUrl(result)}
              className="block px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors duration-150"
              onClick={() => setShowResults(false)}
            >
              <div className="flex items-center space-x-3">
                <span className="text-lg flex-shrink-0">{getResultIcon(result.type)}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-gray-900 truncate">
                      {result._highlightResult?.name?.value || result.name || `ID: ${result.id}`}
                    </h4>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full capitalize flex-shrink-0 ml-2">
                      {result.type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">
                    {formatResultText(result)}
                  </p>
                  {result._highlightResult?.material_list?.value && (
                    <p className="text-xs text-gray-500 mt-1">
                      Materials: {result._highlightResult.material_list.value}
                    </p>
                  )}
                </div>
              </div>
            </a>
          ))}
        </div>
      )}

      {showResults && query && !isLoading && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg mt-1 p-4">
          <p className="text-gray-500 text-center">No results found for "{query}"</p>
        </div>
      )}
    </div>
  );
}

export default SearchBar;