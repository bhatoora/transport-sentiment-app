import React, { useState, useEffect } from 'react';
import { Tweet, StateData, SentimentTrend, Alert, WeeklyReport } from './types';
import { generateSentimentTrend, generateAlerts } from './utils/mockData';
import { useRealTimeData } from './hooks/useRealTimeData';
import { IndianMapVisualization } from './components/IndianMapVisualization';
import { SentimentTrends } from './components/SentimentTrends';
import { AlertsPanel } from './components/AlertsPanel';
import { TweetFeed } from './components/TweetFeed';
import { WeeklyReportComponent } from './components/WeeklyReport';
import { FilterPanel } from './components/FilterPanel';
import { DashboardStats } from './components/DashboardStats';
import { Activity, Bell, BarChart3, Map, TrendingUp, RefreshCw, Globe, Wifi, WifiOff } from 'lucide-react';

function App() {
  // Use real-time data hook
  const { tweets, states, isConnected, isLoading, error, refreshConnection } = useRealTimeData();
  
  const [trends, setTrends] = useState<SentimentTrend[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [selectedTransportType, setSelectedTransportType] = useState('all');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'map' | 'trends' | 'alerts' | 'report'>('dashboard');

  // Mock weekly report data for India
  const weeklyReport: WeeklyReport = {
    week: new Date().toLocaleDateString('en-IN'),
    overallSentiment: 0.12,
    totalMessages: 125000,
    statePerformance: {
      best: 'Kerala',
      worst: 'Delhi'
    },
    transportPerformance: {
      bus: -0.05,
      metro: 0.35,
      train: 0.08,
      auto: -0.15,
      taxi: 0.22
    },
    regionalHighlights: {
      north: -0.08,
      south: 0.25,
      east: 0.05,
      west: 0.18,
      central: 0.02
    },
    insights: [
      'South Indian states show consistently positive transport sentiment',
      'Metro services across major cities receive highest satisfaction ratings',
      'Auto rickshaw services need significant improvement in pricing and service quality',
      'Delhi transport system faces challenges with air quality and overcrowding',
      'Kerala leads in public transport satisfaction with well-maintained bus services',
      'Mumbai local trains show mixed sentiment due to overcrowding vs reliability',
      'Bangalore traffic congestion impacts overall transport sentiment negatively',
      'Hyderabad Metro expansion has significantly improved regional connectivity'
    ]
  };

  // Initialize data
  useEffect(() => {
    setTrends(generateSentimentTrend());
    setAlerts(generateAlerts());
  }, []);

  // Simulate real-time updates
  useEffect(() => {

    const interval = setInterval(() => {
      // Update trends
      if (Math.random() < 0.4) {
        setTrends(generateSentimentTrend());
      }

      // Update alerts occasionally
      if (Math.random() < 0.15) {
        setAlerts(generateAlerts());
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const tabs = [
    { key: 'dashboard', label: 'Dashboard', icon: Activity },
    { key: 'map', label: 'India Map', icon: Map },
    { key: 'trends', label: 'Trends', icon: TrendingUp },
    { key: 'alerts', label: 'Alerts', icon: Bell },
    { key: 'report', label: 'Weekly Report', icon: BarChart3 }
  ] as const;

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <DashboardStats states={states} tweets={tweets} />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <IndianMapVisualization states={states} selectedTransportType={selectedTransportType} />
              </div>
              <div className="space-y-6">
                <FilterPanel 
                  selectedTransportType={selectedTransportType}
                  onTransportTypeChange={setSelectedTransportType}
                />
                <div className="bg-white rounded-lg shadow-md p-4">
                  <h3 className="font-semibold mb-2">System Status</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span>Data Sources:</span>
                      <span className="text-green-600">🟢 Active</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>API Status:</span>
                      <span className="text-green-600">🟢 Online</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Last Update:</span>
                      <span>{new Date().toLocaleTimeString('en-IN')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'map':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <IndianMapVisualization states={states} selectedTransportType={selectedTransportType} />
            </div>
            <div className="space-y-6">
              <FilterPanel 
                selectedTransportType={selectedTransportType}
                onTransportTypeChange={setSelectedTransportType}
              />
              <TweetFeed tweets={tweets} selectedTransportType={selectedTransportType} />
            </div>
          </div>
        );
      case 'trends':
        return (
          <div className="space-y-6">
            <SentimentTrends trends={trends} selectedTransportType={selectedTransportType} />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <TweetFeed tweets={tweets} selectedTransportType={selectedTransportType} />
              </div>
              <div>
                <FilterPanel 
                  selectedTransportType={selectedTransportType}
                  onTransportTypeChange={setSelectedTransportType}
                />
              </div>
            </div>
          </div>
        );
      case 'alerts':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AlertsPanel alerts={alerts} />
            <TweetFeed tweets={tweets} selectedTransportType={selectedTransportType} />
          </div>
        );
      case 'report':
        return (
          <div className="space-y-6">
            <WeeklyReportComponent report={weeklyReport} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SentimentTrends trends={trends} selectedTransportType={selectedTransportType} />
              <FilterPanel 
                selectedTransportType={selectedTransportType}
                onTransportTypeChange={setSelectedTransportType}
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Globe className="w-8 h-8 text-orange-500" />
                <span className="text-2xl">🇮🇳</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Indian Transport Sentiment Monitor
                </h1>
                <p className="text-sm text-gray-600">Real-time analysis across 31 states</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={refreshConnection}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  isConnected 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {isConnected ? (
                  <Wifi className="w-4 h-4" />
                ) : (
                  <WifiOff className="w-4 h-4" />
                )}
                <span className="text-sm font-medium">
                  {isConnected ? 'Real-time Data' : 'Mock Data'}
                </span>
              </button>
              
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>IST:</span>
                <span className="font-mono">{new Date().toLocaleTimeString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center space-x-2 px-1 py-4 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.key
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Error Banner */}
      {error && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
              <p className="text-gray-600">Loading real-time transport data...</p>
            </div>
          </div>
        ) : (
        renderContent()
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-600">
            <p>🇮🇳 Indian Transport Sentiment Analysis System • Real-time monitoring across all states</p>
            <p className="mt-1">
              Data sources: {isConnected ? 'Live Twitter API, News feeds' : 'Mock data simulation'} • 
              Updated every {isConnected ? '5' : '3'} seconds
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;