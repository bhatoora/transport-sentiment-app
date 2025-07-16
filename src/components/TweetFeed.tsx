import React from 'react';
import { Tweet } from '../types';
import { getSentimentEmoji } from '../utils/sentimentAnalysis';
import { Clock, MapPin, User, Globe } from 'lucide-react';

interface TweetFeedProps {
  tweets: Tweet[];
  selectedTransportType: string;
}

export const TweetFeed: React.FC<TweetFeedProps> = ({ tweets, selectedTransportType }) => {
  const filteredTweets = tweets.filter(tweet => 
    selectedTransportType === 'all' || tweet.transportType === selectedTransportType
  );

  const getSentimentBadgeColor = (label: string) => {
    switch (label) {
      case 'positive': return 'bg-green-100 text-green-800';
      case 'negative': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLanguageFlag = (language: string) => {
    switch (language) {
      case 'hi': return '🇮🇳';
      case 'mixed': return '🌐';
      default: return '🇬🇧';
    }
  };

  const getTransportEmoji = (type: string) => {
    switch (type) {
      case 'metro': return '🚇';
      case 'train': return '🚂';
      case 'bus': return '🚌';
      case 'auto': return '🛺';
      case 'taxi': return '🚕';
      default: return '🚌';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Live Social Media Feed</h2>
        <div className="text-sm text-gray-600">
          {filteredTweets.length} messages • Real-time updates
        </div>
      </div>
      
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {filteredTweets.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Globe className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No messages for selected transport type</p>
          </div>
        ) : (
          filteredTweets.map((tweet) => (
            <div
              key={tweet.id}
              className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200 hover:border-blue-300"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium">@{tweet.user}</span>
                  <span className="text-xs text-gray-500">•</span>
                  <span className="text-xs text-gray-500">
                    {tweet.timestamp.toLocaleTimeString('en-IN')}
                  </span>
                  <span className="text-sm">{getLanguageFlag(tweet.language)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg">
                    {getSentimentEmoji(tweet.sentiment)}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getSentimentBadgeColor(tweet.sentiment.label)}`}
                  >
                    {tweet.sentiment.label}
                  </span>
                </div>
              </div>
              
              <p className="text-gray-800 mb-3 leading-relaxed">{tweet.text}</p>
              
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-3 h-3" />
                    <span>{tweet.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-lg">{getTransportEmoji(tweet.transportType)}</span>
                    <span className="capitalize">{tweet.transportType}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs">
                    Confidence: {(tweet.sentiment.confidence * 100).toFixed(0)}%
                  </div>
                  <div className="text-xs">
                    Score: {tweet.sentiment.polarity.toFixed(2)}
                  </div>
                </div>
              </div>
              
              {/* Additional metadata for Indian context */}
              <div className="mt-2 pt-2 border-t border-gray-100">
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>State: {tweet.state}</span>
                  <span>City: {tweet.city}</span>
                  <span>Language: {tweet.language.toUpperCase()}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      {filteredTweets.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Showing latest {filteredTweets.length} messages</span>
            <span>Updates every 3 seconds</span>
          </div>
        </div>
      )}
    </div>
  );
};