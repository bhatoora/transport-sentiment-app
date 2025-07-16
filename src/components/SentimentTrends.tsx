import React from 'react';
import { SentimentTrend } from '../types';
import { getSentimentColor } from '../utils/sentimentAnalysis';

interface SentimentTrendsProps {
  trends: SentimentTrend[];
  selectedTransportType: string;
}

export const SentimentTrends: React.FC<SentimentTrendsProps> = ({ 
  trends, 
  selectedTransportType 
}) => {
  const filteredTrends = trends.filter(trend => 
    selectedTransportType === 'all' || trend.transportType === selectedTransportType
  );

  // Group trends by hour for visualization
  const hourlyTrends = filteredTrends.reduce((acc, trend) => {
    const hour = trend.timestamp.getHours();
    if (!acc[hour]) {
      acc[hour] = [];
    }
    acc[hour].push(trend.sentiment);
    return acc;
  }, {} as Record<number, number[]>);

  const chartData = Object.entries(hourlyTrends).map(([hour, sentiments]) => ({
    hour: parseInt(hour),
    avgSentiment: sentiments.reduce((sum, s) => sum + s, 0) / sentiments.length,
    count: sentiments.length
  })).sort((a, b) => a.hour - b.hour);

  const maxSentiment = Math.max(...chartData.map(d => d.avgSentiment));
  const minSentiment = Math.min(...chartData.map(d => d.avgSentiment));

  // Regional breakdown
  const regionalTrends = filteredTrends.reduce((acc, trend) => {
    if (!acc[trend.state]) {
      acc[trend.state] = [];
    }
    acc[trend.state].push(trend.sentiment);
    return acc;
  }, {} as Record<string, number[]>);

  const topStates = Object.entries(regionalTrends)
    .map(([state, sentiments]) => ({
      state,
      avgSentiment: sentiments.reduce((sum, s) => sum + s, 0) / sentiments.length,
      count: sentiments.length
    }))
    .sort((a, b) => b.avgSentiment - a.avgSentiment)
    .slice(0, 5);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-4">Sentiment Trends - Last 24 Hours</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2">
          <div className="relative h-64">
            {/* Y-axis */}
            <div className="absolute left-0 top-0 h-full w-12 flex flex-col justify-between text-sm text-gray-500">
              <span>{maxSentiment.toFixed(2)}</span>
              <span>0.00</span>
              <span>{minSentiment.toFixed(2)}</span>
            </div>
            
            {/* Chart area */}
            <div className="ml-12 h-full relative">
              {/* Grid lines */}
              <div className="absolute inset-0">
                {[0, 25, 50, 75, 100].map(percent => (
                  <div
                    key={percent}
                    className="absolute w-full border-t border-gray-200"
                    style={{ top: `${percent}%` }}
                  />
                ))}
              </div>
              
              {/* Area chart */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="sentimentGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3"/>
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.1"/>
                  </linearGradient>
                </defs>
                
                {/* Area fill */}
                <path
                  d={`M 0 100 ${chartData.map((point, index) => {
                    const x = (index / (chartData.length - 1)) * 100;
                    const y = 100 - ((point.avgSentiment - minSentiment) / (maxSentiment - minSentiment)) * 100;
                    return `L ${x} ${y}`;
                  }).join(' ')} L 100 100 Z`}
                  fill="url(#sentimentGradient)"
                />
                
                {/* Trend line */}
                <path
                  d={chartData.map((point, index) => {
                    const x = (index / (chartData.length - 1)) * 100;
                    const y = 100 - ((point.avgSentiment - minSentiment) / (maxSentiment - minSentiment)) * 100;
                    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
                  }).join(' ')}
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="2"
                  className="drop-shadow-sm"
                />
              </svg>
              
              {/* Data points */}
              {chartData.map((point, index) => (
                <div
                  key={index}
                  className="absolute w-3 h-3 rounded-full border-2 border-white shadow-md transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                  style={{
                    left: `${(index / (chartData.length - 1)) * 100}%`,
                    top: `${100 - ((point.avgSentiment - minSentiment) / (maxSentiment - minSentiment)) * 100}%`,
                    backgroundColor: getSentimentColor(point.avgSentiment)
                  }}
                >
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block">
                    <div className="bg-gray-800 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
                      {point.hour}:00 - {point.avgSentiment.toFixed(2)} ({point.count} msgs)
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* X-axis */}
            <div className="absolute bottom-0 left-12 right-0 flex justify-between text-sm text-gray-500">
              {chartData.map(point => (
                <span key={point.hour}>{point.hour}:00</span>
              ))}
            </div>
          </div>
        </div>
        
        {/* Top States */}
        <div>
          <h3 className="font-semibold mb-3">Top Performing States</h3>
          <div className="space-y-2">
            {topStates.map((state, index) => (
              <div key={state.state} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">#{index + 1}</span>
                  <span className="text-sm">{state.state}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: getSentimentColor(state.avgSentiment) }}
                  />
                  <span className="text-sm font-medium">{state.avgSentiment.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Summary stats */}
      <div className="mt-6 grid grid-cols-4 gap-4 text-center">
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="text-sm text-gray-600">Current Trend</div>
          <div className="text-lg font-semibold">
            {chartData.length > 1 && chartData[chartData.length - 1].avgSentiment > chartData[chartData.length - 2].avgSentiment 
              ? '📈 Improving' 
              : '📉 Declining'
            }
          </div>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="text-sm text-gray-600">Peak Sentiment</div>
          <div className="text-lg font-semibold">{maxSentiment.toFixed(2)}</div>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="text-sm text-gray-600">Lowest Sentiment</div>
          <div className="text-lg font-semibold">{minSentiment.toFixed(2)}</div>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="text-sm text-gray-600">Total Messages</div>
          <div className="text-lg font-semibold">{filteredTrends.length.toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
};