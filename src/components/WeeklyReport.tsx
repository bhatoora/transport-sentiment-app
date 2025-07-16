import React from 'react';
import { WeeklyReport } from '../types';
import { TrendingUp, TrendingDown, BarChart3, Award, AlertTriangle, MapPin } from 'lucide-react';

interface WeeklyReportProps {
  report: WeeklyReport;
}

export const WeeklyReportComponent: React.FC<WeeklyReportProps> = ({ report }) => {
  const getSentimentIcon = (score: number) => {
    return score > 0 ? <TrendingUp className="w-5 h-5 text-green-500" /> : <TrendingDown className="w-5 h-5 text-red-500" />;
  };

  const getSentimentColor = (score: number) => {
    if (score > 0.2) return 'text-green-600';
    if (score > 0) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRegionalColor = (region: string) => {
    const colors = {
      north: 'bg-blue-100 text-blue-800',
      south: 'bg-green-100 text-green-800',
      east: 'bg-yellow-100 text-yellow-800',
      west: 'bg-orange-100 text-orange-800',
      central: 'bg-purple-100 text-purple-800'
    };
    return colors[region as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-4 flex items-center space-x-2">
        <BarChart3 className="w-5 h-5 text-blue-500" />
        <span>Weekly Transport Sentiment Report</span>
      </h2>
      
      <div className="mb-6">
        <div className="text-sm text-gray-600 mb-2">Week of {report.week}</div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            {getSentimentIcon(report.overallSentiment)}
            <span className={`text-3xl font-bold ${getSentimentColor(report.overallSentiment)}`}>
              {report.overallSentiment.toFixed(2)}
            </span>
          </div>
          <div className="text-sm text-gray-600">
            Overall Sentiment Score across India
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {/* Performance Highlights */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-3 flex items-center space-x-2">
            <Award className="w-4 h-4 text-green-500" />
            <span>State Performance</span>
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Best Performing:</span>
              <span className="font-medium text-green-600 flex items-center space-x-1">
                <span>🏆</span>
                <span>{report.statePerformance.best}</span>
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Needs Attention:</span>
              <span className="font-medium text-red-600 flex items-center space-x-1">
                <span>⚠️</span>
                <span>{report.statePerformance.worst}</span>
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Messages:</span>
              <span className="font-medium">{report.totalMessages.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Transport Performance */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-3">Transport Mode Performance</h3>
          <div className="space-y-2">
            {Object.entries(report.transportPerformance).map(([mode, score]) => (
              <div key={mode} className="flex justify-between items-center">
                <span className="text-sm text-gray-600 capitalize flex items-center space-x-1">
                  <span>
                    {mode === 'bus' ? '🚌' : 
                     mode === 'metro' ? '🚇' : 
                     mode === 'train' ? '🚂' : 
                     mode === 'auto' ? '🛺' : '🚕'}
                  </span>
                  <span>{mode}:</span>
                </span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${score > 0 ? 'bg-green-500' : 'bg-red-500'}`}
                      style={{ width: `${Math.abs(score) * 50 + 50}%` }}
                    />
                  </div>
                  <span className={`text-sm font-medium ${getSentimentColor(score)}`}>
                    {score.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Regional Breakdown */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-3 flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-blue-500" />
            <span>Regional Analysis</span>
          </h3>
          <div className="space-y-2">
            {Object.entries(report.regionalHighlights).map(([region, score]) => (
              <div key={region} className="flex justify-between items-center">
                <span className={`text-xs px-2 py-1 rounded-full capitalize ${getRegionalColor(region)}`}>
                  {region}
                </span>
                <div className="flex items-center space-x-2">
                  <div className="w-12 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${score > 0 ? 'bg-green-500' : 'bg-red-500'}`}
                      style={{ width: `${Math.abs(score) * 50 + 50}%` }}
                    />
                  </div>
                  <span className={`text-sm font-medium ${getSentimentColor(score)}`}>
                    {score.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Key Insights */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-3 flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 text-blue-500" />
          <span>Key Insights & Recommendations</span>
        </h3>
        <ul className="space-y-2">
          {report.insights.map((insight, index) => (
            <li key={index} className="text-sm text-gray-700 flex items-start space-x-2">
              <span className="text-blue-500 mt-1">•</span>
              <span>{insight}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-gray-200 text-center">
        <div className="text-sm text-gray-500">
          Report generated on {new Date().toLocaleDateString('en-IN')} • 
          Data sourced from social media, news, and transport APIs • 
          Next report: {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN')}
        </div>
      </div>
    </div>
  );
};