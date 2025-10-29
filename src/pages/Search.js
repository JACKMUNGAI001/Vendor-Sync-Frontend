import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

function Search() {
    const { user } = useAuth();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [searching, setSearching] = useState(false);

    const handleSearch = async (searchQuery) => {
        setQuery(searchQuery);
        
        if (!searchQuery.trim()) {
            setResults([]);
            return;
        }

        setSearching(true);
        try {
            const response = await axios.get(`https://vendor-sync-backend-4bre.onrender.com/search?query=${encodeURIComponent(searchQuery)}`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setResults(response.data.hits || []);
        } catch (error) {
            console.error('Search error:', error);
            alert('Search failed. Please try again.');
        } finally {
            setSearching(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow p-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">Search</h1>
                    
                    <div className="relative mb-8">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => handleSearch(e.target.value)}
                            placeholder="Search vendors, orders, quotes..."
                            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {searching && (
                            <div className="absolute right-4 top-4">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                            </div>
                        )}
                    </div>

                    <div className="space-y-4">
                        {results.length === 0 && query && !searching ? (
                            <p className="text-gray-500 text-center py-8">No results found for "{query}"</p>
                        ) : (
                            results.map((result) => (
                                <div key={result.objectID} className="border rounded-lg p-6 bg-white hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-lg font-semibold text-blue-600">
                                                {result.name || `ID: ${result.id}`}
                                            </h3>
                                            <p className="text-gray-600 capitalize">{result.type}</p>
                                            {result.status && (
                                                <p className="text-gray-600">Status: {result.status}</p>
                                            )}
                                            {result.price && (
                                                <p className="text-gray-600">Price: ${result.price}</p>
                                            )}
                                        </div>
                                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm capitalize">
                                            {result.type}
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

export default Search;