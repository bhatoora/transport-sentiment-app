import React from 'react';
import { RegionData } from '../types';
import { getSentimentColor, getSentimentEmoji } from '../utils/sentimentAnalysis';

interface MapVisualizationProps {
  regions: RegionData[];
  selectedTransportType: string;
}

export const MapVisualization: React.FC<MapVisualizationProps> = ({ 
  regions, 
  selectedTransportType 
}) => {
  const filteredRegions = regions.filter(region => 
    selectedTransportType === 'all' || 
    region.transportBreakdown[selectedTransportType as keyof typeof region.transportBreakdown] > 0
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-4">Regional Sentiment Map</h2>
      
      {/* Simulated Map Container */}
      <div className="relative bg-gray-100 rounded-lg h-96 overflow-hidden">
        {/* Map Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50">
          <div className="absolute inset-0 opacity-20">
            <svg width="100%" height="100%" viewBox="0 0 400 300">
              {/* Simulated map lines */}
              <path d="M50 50 L350 50 L350 250 L50 250 Z" stroke="#cbd5e1" strokeWidth="2" fill="none"/>
              <path d="M100 100 L300 100 L300 200 L100 200 Z" stroke="#cbd5e1" strokeWidth="1" fill="none"/>
              <path d="M75 75 L325 225" stroke="#cbd5e1" strokeWidth="1"/>
              <path d="M325 75 L75 225" stroke="#cbd5e1" strokeWidth="1"/>
            </svg>
          </div>
        </div>
        
        {/* Region Markers */}
        {filteredRegions.map((region, index) => (
          <div
            key={region.region}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
            style={{
              left: `${20 + (index % 5) * 15}%`,
              top: `${25 + Math.floor(index / 5) * 20}%`,
            }}
          >
            {/* Heatmap Circle */}
            <div
              className="w-16 h-16 rounded-full opacity-70 animate-pulse"
              style={{
                backgroundColor: getSentimentColor(region.sentimentScore),
                transform: `scale(${1 + Math.abs(region.sentimentScore) * 0.5})`,
              }}
            />
            
            {/* Region Marker */}
            <div
              className="absolute inset-0 w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-sm font-bold text-white m-4"
              style={{ backgroundColor: getSentimentColor(region.sentimentScore) }}
            >
              {getSentimentEmoji({ polarity: region.sentimentScore, subjectivity: 0.5, label: 'neutral', confidence: 0.8 })}
            </div>
            
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block">
              <div className="bg-gray-800 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap">
                <div className="font-semibold">{region.region}</div>
                <div>Sentiment: {region.sentimentScore.toFixed(2)}</div>
                <div>Messages: {region.totalMessages}</div>
                <div>Trend: {region.trend}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Legend */}
      <div className="mt-4 flex items-center justify-center space-x-6">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded-full bg-green-500"></div>
          <span className="text-sm">Positive</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
          <span className="text-sm">Neutral</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded-full bg-red-500"></div>
          <span className="text-sm">Negative</span>
        </div>
      </div>
    </div>
  );
};