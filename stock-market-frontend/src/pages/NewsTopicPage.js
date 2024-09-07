import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NewsCard from '../components/NewsCard';

const NewsTopicPage = () => {
  const [topics, setTopics] = useState([]); // State to store fetched topics
  const [selectedTopic, setSelectedTopic] = useState(''); // State to store selected topic
  const [newsItems, setNewsItems] = useState([]); // State to store fetched news
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state

  // Fetch topics from the Flask API when the component mounts
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/get_topics'); // Fetch topics
        setTopics(response.data); // Store fetched topics
      } catch (error) {
        console.error("Error fetching topics:", error);
      }
    };

    fetchTopics();
  }, []);

  // Fetch news based on the selected topic
  const handleFetchNews = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://127.0.0.1:5000/get_news_by_topic', {
        params: { topic: selectedTopic },
      });
      setNewsItems(response.data || []); // Store fetched news
    } catch (err) {
      setError('Failed to fetch news for the selected topic.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-8">
          Select a News Topic
        </h1>

        {/* Topic selection */}
        <div className="flex justify-center mb-6">
          <select
            className="p-3 rounded-lg shadow-md border border-gray-300 focus:ring-2 focus:ring-blue-500 w-96"
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
          >
            <option value="">-- Select Topic --</option>
            {topics.map((topic, index) => (
              <option key={index} value={topic}>
                {topic}
              </option>
            ))}
          </select>
          <button
            className="ml-4 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={handleFetchNews}
            disabled={loading || !selectedTopic}
          >
            {loading ? 'Loading...' : 'Fetch News'}
          </button>
        </div>

        {/* Error message */}
        {error && <p className="text-center text-red-500">{error}</p>}

        {/* News Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newsItems.length > 0 ? (
            newsItems.map((article, index) => <NewsCard key={index} article={article} />)
          ) : (
            !loading && <p className="text-center text-gray-500">No news available for the selected topic.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsTopicPage;
