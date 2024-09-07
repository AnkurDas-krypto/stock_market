import React, { useState } from 'react';
import axios from 'axios';

const StockSummaryPage = () => {
  const [symbol, setSymbol] = useState('');  // Stock symbol input from user
  const [summary, setSummary] = useState(null);  // State to hold summary data
  const [loading, setLoading] = useState(false);  // Loading state
  const [error, setError] = useState(null);  // Error state

  // Function to fetch stock summary from backend API
  const fetchStockSummary = async () => {
    setLoading(true);  // Start loading
    setError(null);  // Reset error state
    setSummary(null);  // Reset summary state
    try {
      const response = await axios.get(`http://localhost:5000/api/stock-summary/${symbol}`);
      setSummary(response.data);  // Store the summary data
    } catch (err) {
      setError('Failed to fetch stock summary. Please check the stock symbol or try again later.');
    }
    setLoading(false);  // Stop loading
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-4xl font-bold mb-6 text-gray-900">Stock Summary</h1>
      <div className="flex space-x-4 mb-6">
        <input
          className="p-3 rounded-lg shadow-md border border-gray-300 focus:ring-2 focus:ring-blue-500"
          type="text"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          placeholder="Enter stock symbol (e.g., AAPL)"
        />
        <button
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={fetchStockSummary}
          disabled={loading || !symbol.trim()}
        >
          {loading ? 'Loading...' : 'Fetch Summary'}
        </button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}  {/* Display error if exists */}

      {/* Display stock summary if fetched */}
      {summary && (
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-3xl w-full">
          <h2 className="text-2xl font-semibold mb-4">Summary for {summary.symbol}</h2>
          <p className="text-lg text-gray-700">{summary.summary}</p>
        </div>
      )}

      {/* Display a message when no summary */}
      {!summary && !loading && <p className="text-gray-600">Enter a stock symbol to get the stock summary.</p>}
    </div>
  );
};

export default StockSummaryPage;
