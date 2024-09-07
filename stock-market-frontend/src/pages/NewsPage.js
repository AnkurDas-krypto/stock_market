// import React, { useState, useEffect } from 'react';
// import { fetchNewsSentiment } from '../services/api';
// import NewsCard from '../components/NewsCard';

// const NewsPage = () => {
//   const [tickers, setTickers] = useState('AAPL');  // Default tickers
//   const [news, setNews] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const handleFetchNews = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const data = await fetchNewsSentiment(tickers);
//       console.log("Fetched News:", data);  // Log the fetched data
//       setNews(data.feed || []);  // Check if feed is correctly populated
//     } catch (err) {
//       setError("Failed to load news sentiment.");
//     }
//     setLoading(false);
//   };

//   useEffect(() => {
//     handleFetchNews();  // Fetch news when component loads
//   }, []);

//   console.log("News state:", news);  // Log the current state

//   return (
//     <div className="news-page">
//       <h1>Stock News Sentiment</h1>
//       <input
//         type="text"
//         value={tickers}
//         onChange={(e) => setTickers(e.target.value)}
//         placeholder="Enter stock tickers (e.g., AAPL,TSLA)"
//       />
//       <button onClick={handleFetchNews}>Fetch News</button>

//       {loading && <p>Loading...</p>}
//       {error && <p>{error}</p>}
//       <div className="news-list">
//         {news.length > 0 ? (
//           news.map((article, index) => <NewsCard key={index} article={article} />)
//         ) : (
//           <p>No news available for the selected tickers.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default NewsPage;


import React, { useState, useEffect } from 'react';
import { fetchNewsSentiment } from '../services/api';
import NewsCard from '../components/NewsCard';

const NewsPage = () => {
  const [tickers, setTickers] = useState('AAPL'); // Default tickers
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFetchNews = async () => {
    setLoading(true);
    setError(null); // Reset error state
    try {
      const data = await fetchNewsSentiment(tickers);
      if (data && data.feed) {
        setNews(data.feed);
      } else {
        setError('No news data found for the selected tickers.');
      }
    } catch (err) {
      setError('Failed to load news sentiment. Please try again.');
    }
    setLoading(false);
  };

  useEffect(() => {
    handleFetchNews(); // Fetch news when component loads
  }, []); // Empty dependency array to ensure it runs only once on mount

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-8 text-gray-900">Stock News Sentiment</h1>

      <div className="flex space-x-4 mb-6">
        <input
          className="p-3 rounded-lg shadow-md border border-gray-300 focus:ring-2 focus:ring-blue-500"
          type="text"
          value={tickers}
          onChange={(e) => setTickers(e.target.value)}
          placeholder="Enter stock tickers (e.g., AAPL, TSLA)"
        />
        <button
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={handleFetchNews}
          disabled={loading || !tickers.trim()}
        >
          {loading ? 'Loading...' : 'Fetch News'}
        </button>
      </div>

      {loading && <p>Loading news data...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.length > 0 ? (
          news.map((article, index) => <NewsCard key={index} article={article} />)
        ) : (
          !loading && <p>No news available for the selected tickers.</p>
        )}
      </div>
    </div>
  );
};

export default NewsPage;
