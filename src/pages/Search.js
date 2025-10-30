import React from 'react';
import SearchBar from '../components/SearchBar';

const Search = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Search</h1>
          <SearchBar />
        </div>
      </div>
    </div>
  );
};

export default Search;