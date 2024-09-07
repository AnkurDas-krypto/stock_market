// import React from 'react';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';  // Import Routes instead of Switch
// import StockSummaryPage from './pages/StockSummaryPage';  // Import your StockSummaryPage component

// function App() {
//   return (
//     <Router>
//       <div className="App">
//         {/* Use Routes instead of Switch */}
//         <Routes>
//           <Route path="/stock-summary" element={<StockSummaryPage />} />  {/* Use 'element' instead of 'component' */}
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NewsPage from './pages/NewsPage';
import StockSummaryPage from './pages/StockSummaryPage';  // Stock summary page
import NewsTopicPage from './pages/NewsTopicPage';  // News topic page
import Navbar from './components/Navbar';  // Navbar component
import StockPerformancePage from './pages/StockPerformancePage';
import StockChatbot from './pages/StockChatbot';
import HomePage from './pages/HomePage'; 

function App() {
  return (
    <Router>
      <div>
        {/* Render the fixed Navbar */}
        <Navbar />
        <div className="pt-16"> {/* Add padding to avoid overlap with fixed navbar */}
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/stock_qa" element={<StockChatbot />} /> 
            <Route path="/news-sentiment" element={<NewsPage />} />
            <Route path="/stock-summary" element={<StockSummaryPage />} />
            <Route path="/news-topic" element={<NewsTopicPage />} />
            <Route path="/news-sentiment" element={<NewsPage />} />
            <Route path="/stock-performance" element={<StockPerformancePage />} />
            
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
