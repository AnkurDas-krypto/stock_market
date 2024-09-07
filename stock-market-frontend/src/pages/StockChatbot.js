import React, { useState } from 'react';
import axios from 'axios';

const StockChatbot = () => {
  const [question, setQuestion] = useState('');
  const [symbol, setSymbol] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = { question, symbol };

    try {
      const res = await axios.post('http://127.0.0.1:5000/stock_qa', data, {
        headers: { 'Content-Type': 'application/json' },
      });

      // Accessing the response from the Axios request
      setResponse(res.data.response);
    } catch (error) {
      console.error('Error fetching stock data:', error);
      setResponse('There was an error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Stock Chatbot</h1>
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-6">
          <div>
            <label htmlFor="symbol" className="block text-lg font-medium mb-2">
              Stock Symbol
            </label>
            <input
              type="text"
              id="symbol"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              placeholder="Enter stock symbol..."
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <div>
            <label htmlFor="question" className="block text-lg font-medium mb-2">
              Question
            </label>
            <input
              type="text"
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask your stock-related question..."
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-600 transition duration-200"
          >
            Ask Question
          </button>
        </form>

        {loading && <div className="mt-4 text-blue-600 font-bold">Loading...</div>}

        {response && (
          <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Response:</h2>
            <pre className="whitespace-pre-wrap">{response}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default StockChatbot;
