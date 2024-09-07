// import React from 'react';

// const NewsCard = ({ article }) => {
//   return (
//     <div className="bg-white rounded-lg shadow-lg p-6">
//       <img
//         src={article.banner_image}
//         alt={article.title}
//         className="w-full h-48 object-cover rounded-md mb-4"
//       />
//       <h3 className="text-xl font-bold mb-2">{article.title}</h3>
//       <p className="text-gray-700 mb-4">{article.summary}</p>
//       <p className="text-sm text-gray-500">Source: {article.source}</p>
//       <p className="text-sm text-gray-500">Sentiment: {article.overall_sentiment_label}</p>
//       <a
//         href={article.url}
//         target="_blank"
//         rel="noopener noreferrer"
//         className="text-blue-500 hover:underline mt-2 block"
//       >
//         Read More
//       </a>
//     </div>
//   );
// };

// export default NewsCard;


import React from 'react';

const NewsCard = ({ article, title, summary, relevanceScore }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* If an article object is passed, show the detailed card */}
      {article ? (
        <>
          <img
            src={article.banner_image}
            alt={article.title}
            className="w-full h-48 object-cover rounded-md mb-4"
          />
          <h3 className="text-xl font-bold mb-2">{article.title}</h3>
          <p className="text-gray-700 mb-4">{article.summary}</p>
          <p className="text-sm text-gray-500">Source: {article.source}</p>
          <p className="text-sm text-gray-500">Sentiment: {article.overall_sentiment_label}</p>
          {/* Add relevance_score here */}
          <p className="text-sm text-gray-500">Relevance Score: {article.relevance_score}</p>
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline mt-2 block"
          >
            Read More
          </a>
        </>
      ) : (
        // Fallback for displaying title, summary, and relevance score
        <>
          <h3 className="text-xl font-bold mb-2">{title}</h3>
          <p className="text-gray-700 mb-4">{summary}</p>
          <p className="text-sm text-gray-500">Relevance Score: {relevanceScore}</p>
        </>
      )}
    </div>
  );
};

export default NewsCard;
