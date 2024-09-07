import axios from 'axios';

// Base URL for the Flask backend
const API_BASE_URL = "http://localhost:5000/api";

// Fetch news sentiment data based on tickers
export const fetchNewsSentiment = async (tickers) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/news-sentiment`, {
      params: { tickers },
    });
    console.log("API Response:", response.data);  // Log the response here
    return response.data;
  } catch (error) {
    console.error("Error fetching news sentiment:", error);
    throw error;
  }
};
