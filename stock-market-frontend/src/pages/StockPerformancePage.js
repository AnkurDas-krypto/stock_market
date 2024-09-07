// import React, { useState } from 'react';
// import axios from 'axios';

// const StockPerformancePage = () => {
//   const [date, setDate] = useState('');  // For storing the selected date
//   const [hour, setHour] = useState('');  // For storing the optional hour
//   const [minute, setMinute] = useState('');  // For storing the optional minute
//   const [performanceData, setPerformanceData] = useState([]);  // For storing the fetched stock data
//   const [loading, setLoading] = useState(false);  // Loading state
//   const [error, setError] = useState(null);  // Error state

//   // Fetch stock performance data from the backend
//   const handleFetchPerformance = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await axios.get('http://127.0.0.1:5000/stock_performance', {
//         params: { date, hour, minute }  // Passing date, hour, and minute as query params
//       });
//       setPerformanceData(response.data || []);
//     } catch (err) {
//       setError('Failed to fetch stock performance data.');
//     }
//     setLoading(false);
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
//       <div className="max-w-7xl mx-auto w-full px-4">
//         <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-8">
//           Stock Performance
//         </h1>

//         {/* Input Fields */}
//         <div className="flex justify-center mb-6 space-x-4">
//           <input
//             type="date"
//             className="p-3 rounded-lg shadow-md border border-gray-300 focus:ring-2 focus:ring-blue-500"
//             value={date}
//             onChange={(e) => setDate(e.target.value)}
//           />
//           <input
//             type="number"
//             min="0"
//             max="23"
//             placeholder="Hour (optional)"
//             className="p-3 rounded-lg shadow-md border border-gray-300 focus:ring-2 focus:ring-blue-500"
//             value={hour}
//             onChange={(e) => setHour(e.target.value)}
//           />
//           <input
//             type="number"
//             min="0"
//             max="59"
//             placeholder="Minute (optional)"
//             className="p-3 rounded-lg shadow-md border border-gray-300 focus:ring-2 focus:ring-blue-500"
//             value={minute}
//             onChange={(e) => setMinute(e.target.value)}
//           />
//           <button
//             className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             onClick={handleFetchPerformance}
//             disabled={loading || !date}
//           >
//             {loading ? 'Loading...' : 'Fetch Performance'}
//           </button>
//         </div>

//         {/* Error Handling */}
//         {error && <p className="text-center text-red-500">{error}</p>}

//         {/* Performance Data */}
//         <div className="flex flex-wrap justify-center gap-6">
//           {Object.keys(performanceData).length > 0 ? (
//             Object.keys(performanceData).map((symbol) => (
//               <div key={symbol} className="bg-white p-4 rounded-lg shadow w-64">
//                 <h2 className="text-xl font-bold">{symbol}</h2>
//                 {performanceData[symbol].map((dataPoint, index) => (
//                   <div key={index}>
//                     <p>Time: {dataPoint.timestamp}</p>
//                     <p>Close Price: {dataPoint.close_price}</p>
//                   </div>
//                 ))}
//               </div>
//             ))
//           ) : (
//             !loading && <p className="text-center text-gray-500">No performance data available for the selected date.</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StockPerformancePage;



import React, { useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const StockPerformancePage = () => {
  const [date, setDate] = useState('');  // For storing the selected date
  const [hour, setHour] = useState('');  // For storing the selected hour
  const [minute, setMinute] = useState('');  // For storing the selected minute
  const [hourlyData, setHourlyData] = useState([]);  // For storing hourly graph data
  const [minuteData, setMinuteData] = useState([]);  // For storing minute-based close price
  const [loading, setLoading] = useState(false);  // Loading state
  const [error, setError] = useState(null);  // Error state

  // Fetch stock performance data for the entire hour (for the graph)
  const fetchHourlyData = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/stock_performance_hour', {
        params: { date, hour }  // Passing date and hour for the graph
      });
      setHourlyData(response.data || []);
    } catch (err) {
      setError('Failed to fetch hourly stock performance data.');
    }
  };

  // Fetch stock performance data for the specific minute
  const fetchMinuteData = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/stock_performance', {
        params: { date, hour, minute }  // Passing date, hour, and minute for the specific close price
      });
      setMinuteData(response.data || []);
    } catch (err) {
      setError('Failed to fetch minute-based stock performance data.');
    }
  };

  // Handle fetching both hourly and minute data
  const handleFetchPerformance = () => {
    setLoading(true);
    setError(null);
    fetchHourlyData();  // Fetch graph data for the hour
    fetchMinuteData();  // Fetch the specific minute data
    setLoading(false);
  };

  // Function to format data for Chart.js (hourly data)
  const formatChartData = (symbolData) => {
    return {
      labels: symbolData.map(dataPoint => dataPoint.timestamp),  // Y-axis (timestamps)
      datasets: [
        {
          label: 'Close Price',
          data: symbolData.map(dataPoint => dataPoint.close_price),  // X-axis (close prices)
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          fill: false,
        }
      ],
    };
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="max-w-7xl mx-auto w-full px-4">
        <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-8">
          Stock Performance
        </h1>

        {/* Input Fields */}
        <div className="flex justify-center mb-6 space-x-4">
          <input
            type="date"
            className="p-3 rounded-lg shadow-md border border-gray-300 focus:ring-2 focus:ring-blue-500"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <input
            type="number"
            min="0"
            max="23"
            placeholder="Hour"
            className="p-3 rounded-lg shadow-md border border-gray-300 focus:ring-2 focus:ring-blue-500"
            value={hour}
            onChange={(e) => setHour(e.target.value)}
          />
          <input
            type="number"
            min="0"
            max="59"
            placeholder="Minute"
            className="p-3 rounded-lg shadow-md border border-gray-300 focus:ring-2 focus:ring-blue-500"
            value={minute}
            onChange={(e) => setMinute(e.target.value)}
          />
          <button
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={handleFetchPerformance}
            disabled={loading || !date || !hour || !minute}
          >
            {loading ? 'Loading...' : 'Fetch Performance'}
          </button>
        </div>

        {/* Error Handling */}
        {error && <p className="text-center text-red-500">{error}</p>}

        {/* Specific Minute Data */}
        <div className="flex flex-wrap justify-center gap-6 mb-6">
          {Object.keys(minuteData).length > 0 ? (
            Object.keys(minuteData).map((symbol) => (
              <div key={symbol} className="bg-white p-4 rounded-lg shadow w-full md:w-1/3 lg:w-1/4">
                <h2 className="text-xl font-bold mb-4">{symbol}</h2>
                {minuteData[symbol].length > 0 ? (
                  <>
                    <p>Time: {minuteData[symbol][0]?.timestamp}</p>
                    <p>Close Price: {minuteData[symbol][0]?.close_price}</p>
                  </>
                ) : (
                  <p>No data for the selected minute.</p>
                )}
              </div>
            ))
          ) : (
            !loading && <p className="text-center text-gray-500">No data available for the selected minute.</p>
          )}
        </div>

        {/* Performance Data (Graph for Hourly Data) */}
        <div className="flex flex-wrap justify-center gap-6">
          {Object.keys(hourlyData).length > 0 ? (
            Object.keys(hourlyData).map((symbol) => (
              <div key={symbol} className="bg-white p-4 rounded-lg shadow w-full md:w-1/2 lg:w-1/3">
                <h2 className="text-xl font-bold mb-4">{symbol}</h2>
                <Line
                  data={formatChartData(hourlyData[symbol])}
                  options={{
                    scales: {
                      y: {
                        title: {
                          display: true,
                          text: 'Timestamp (Minutes)',
                        }
                      },
                      x: {
                        title: {
                          display: true,
                          text: 'Close Price',
                        }
                      }
                    }
                  }}
                />
              </div>
            ))
          ) : (
            !loading && <p className="text-center text-gray-500">No performance data available for the selected hour.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StockPerformancePage;
