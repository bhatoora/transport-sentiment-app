import { useState, useEffect, useCallback } from 'react';
import { apiService, RealTimeTweet, RealTimeStateData } from '../utils/apiService';
import { Tweet, StateData } from '../types';
import { generateMockTweet, generateStateData } from '../utils/mockData';

export const useRealTimeData = () => {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [states, setStates] = useState<StateData[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Transform real-time tweet to app format
  const transformRealTimeTweet = useCallback((realTweet: RealTimeTweet): Tweet => {
    return {
      id: realTweet.id,
      text: realTweet.text,
      user: `user_${realTweet.id.slice(-4)}`,
      timestamp: new Date(realTweet.timestamp),
      location: realTweet.location,
      transportType: realTweet.transportType,
      sentiment: {
        polarity: realTweet.sentiment.polarity,
        subjectivity: 0.5, // Default value
        label: realTweet.sentiment.label,
        confidence: realTweet.sentiment.confidence
      },
      state: realTweet.state,
      city: realTweet.location.split(',')[0] || realTweet.state,
      language: 'en' as const
    };
  }, []);

  // Transform real-time state data to app format
  const transformRealTimeState = useCallback((realState: RealTimeStateData): StateData => {
    const stateCoords = {
      'Maharashtra': [19.7515, 75.7139],
      'Delhi': [28.7041, 77.1025],
      'Karnataka': [15.3173, 75.7139],
      'Tamil Nadu': [11.1271, 78.6569],
      'West Bengal': [22.9868, 87.8550],
      // Add more coordinates as needed
    };

    const coords = stateCoords[realState.state as keyof typeof stateCoords] || [20, 77];

    return {
      state: realState.state,
      stateCode: realState.state.substring(0, 2).toUpperCase(),
      coordinates: coords as [number, number],
      sentimentScore: realState.sentimentScore,
      totalMessages: realState.totalMessages,
      transportBreakdown: realState.transportBreakdown,
      sentimentBreakdown: realState.sentimentBreakdown,
      trend: realState.sentimentScore > 0 ? 'improving' : 
             realState.sentimentScore < -0.2 ? 'declining' : 'stable',
      lastUpdated: new Date(),
      majorCities: [], // Will be populated from static data
      population: 50000000 // Default value
    };
  }, []);

  // Check API connection
  const checkConnection = useCallback(async () => {
    try {
      const connected = await apiService.checkConnection();
      setIsConnected(connected);
      if (!connected) {
        setError('Backend server not running. Using mock data. Start backend with: python backend/twitter_scraper.py');
      } else {
        setError(null);
      }
    } catch (err) {
      setIsConnected(false);
      setError('Backend server not running. Using mock data. Start backend with: python backend/twitter_scraper.py');
    }
  }, []);

  // Fetch real-time data
  const fetchRealTimeData = useCallback(async () => {
    try {
      if (isConnected) {
        // Fetch real tweets
        const realTweets = await apiService.fetchRealTimeTweets();
        const transformedTweets = realTweets.map(transformRealTimeTweet);
        
        // Fetch real state data
        const realStates = await apiService.fetchRealTimeStates();
        const transformedStates = realStates.map(transformRealTimeState);
        
        if (transformedTweets.length > 0) {
          setTweets(prev => {
            const newTweets = [...transformedTweets, ...prev];
            return newTweets.slice(0, 100); // Keep only latest 100 tweets
          });
        }
        
        if (transformedStates.length > 0) {
          setStates(transformedStates);
        }
      } else {
        // Fallback to mock data
        const mockTweet = generateMockTweet();
        setTweets(prev => [mockTweet, ...prev.slice(0, 49)]);
        
        // Update mock states occasionally
        if (Math.random() < 0.3) {
          setStates(generateStateData());
        }
      }
    } catch (err) {
      console.error('Error fetching real-time data:', err);
      // Fallback to mock data on error
      const mockTweet = generateMockTweet();
      setTweets(prev => [mockTweet, ...prev.slice(0, 49)]);
    }
  }, [isConnected, transformRealTimeTweet, transformRealTimeState]);

  // Initialize data
  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true);
      await checkConnection();
      
      // Set initial data
      if (isConnected) {
        await fetchRealTimeData();
      } else {
        // Initialize with mock data
        setStates(generateStateData());
        const initialTweets = Array.from({ length: 15 }, generateMockTweet);
        setTweets(initialTweets);
      }
      
      setIsLoading(false);
    };

    initializeData();
  }, []);

  // Set up real-time updates
  useEffect(() => {
    const interval = setInterval(async () => {
      await fetchRealTimeData();
    }, isConnected ? 5000 : 3000); // 5s for real data, 3s for mock

    return () => clearInterval(interval);
  }, [fetchRealTimeData, isConnected]);

  // Periodic connection check
  useEffect(() => {
    const connectionCheck = setInterval(checkConnection, 30000); // Check every 30 seconds
    return () => clearInterval(connectionCheck);
  }, [checkConnection]);

  return {
    tweets,
    states,
    isConnected,
    isLoading,
    error,
    refreshConnection: checkConnection
  };
};