import React from 'react';
import { StateData } from '../types';
import { getSentimentColor, getSentimentEmoji } from '../utils/sentimentAnalysis';
import { INDIAN_STATES } from '../utils/indianStatesData';

interface IndianMapVisualizationProps {
  states: StateData[];
  selectedTransportType: string;
}

export const IndianMapVisualization: React.FC<IndianMapVisualizationProps> = ({ 
  states, 
  selectedTransportType 
}) => {
  const filteredStates = states.filter(state => 
    selectedTransportType === 'all' || 
    state.transportBreakdown[selectedTransportType as keyof typeof state.transportBreakdown] > 0
  );

  // India boundary coordinates (simplified)
  // Accurate India boundary path based on actual map shape
  const indiaBoundary = `
    M 180 80 
    L 200 70 L 220 65 L 250 60 L 280 65 L 310 70 L 340 75 L 370 85 L 390 95 
    L 400 110 L 410 125 L 415 140 L 420 155 L 425 170 L 430 185 L 435 200 
    L 440 220 L 445 240 L 450 260 L 445 280 L 440 300 L 430 320 L 420 340 
    L 400 360 L 380 375 L 360 385 L 340 390 L 320 395 L 300 400 L 280 405 
    L 260 410 L 240 415 L 220 420 L 200 415 L 180 410 L 160 405 L 140 395 
    L 120 385 L 100 370 L 85 350 L 75 330 L 70 310 L 65 290 L 60 270 
    L 55 250 L 50 230 L 45 210 L 40 190 L 35 170 L 30 150 L 35 130 
    L 40 110 L 50 95 L 65 85 L 80 80 L 100 75 L 120 70 L 140 65 
    L 160 70 L 180 80 Z
    M 200 420 L 210 430 L 220 440 L 210 450 L 200 445 L 190 440 L 200 420 Z
    M 180 440 L 190 450 L 200 460 L 190 470 L 180 465 L 170 460 L 180 440 Z
    M 160 460 L 170 470 L 180 480 L 170 490 L 160 485 L 150 480 L 160 460 Z
  `;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">India Transport Sentiment Map</h2>
        <div className="text-sm text-gray-600">
          Real-time sentiment analysis across Indian states
        </div>
      </div>
      
      {/* Map Container */}
      <div className="relative bg-gradient-to-br from-blue-50 to-green-50 rounded-lg h-[500px] overflow-hidden">
        {/* Indian Map Image Background */}
        <div className="absolute inset-0 w-full h-full">
          <img 
            src="/MapChart_Map.png" 
            alt="Indian Map" 
            className="w-full h-full object-contain opacity-90"
            style={{ filter: 'brightness(1.1) contrast(1.05)' }}
            onError={(e) => {
              console.error('Map image failed to load:', e);
              e.currentTarget.style.display = 'none';
            }}
            onLoad={() => console.log('Map image loaded successfully')}
          />
        </div>
        
        {/* State Markers */}
        {filteredStates.map((state, index) => {
          const stateCoords = INDIAN_STATES[state.state];
          if (!stateCoords) return null;
          
          // Convert lat/lng to image coordinates based on the map image dimensions
          // Calibrated for the Indian map image provided
          const x = ((stateCoords.lng - 68) / (97 - 68)) * 85 + 7.5; // Adjusted for image bounds
          const y = ((37 - stateCoords.lat) / (37 - 6)) * 80 + 10; // Adjusted for image bounds
          
          return (
            <div
              key={state.state}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
              style={{ left: `${x}%`, top: `${y}%` }}
            >
              {/* Heatmap Circle */}
              <div
                className="w-12 h-12 rounded-full opacity-60 animate-pulse"
                style={{
                  backgroundColor: getSentimentColor(state.sentimentScore),
                  transform: `scale(${0.8 + Math.abs(state.sentimentScore) * 0.8})`,
                }}
              />
              
              {/* State Marker */}
              <div
                className="absolute inset-0 w-6 h-6 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-xs font-bold text-white m-3"
                style={{ backgroundColor: getSentimentColor(state.sentimentScore) }}
              >
                {getSentimentEmoji({ polarity: state.sentimentScore, subjectivity: 0.5, label: 'neutral', confidence: 0.8 })}
              </div>
              
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                <div className="bg-gray-800 text-white px-4 py-3 rounded-lg text-sm whitespace-nowrap shadow-xl">
                  <div className="font-semibold text-yellow-300">{state.state}</div>
                  <div className="text-xs text-gray-300 mb-2">
                    Cities: {state.majorCities.slice(0, 2).join(', ')}
                  </div>
                  <div className="space-y-1">
                    <div>Sentiment: <span className="font-medium">{state.sentimentScore.toFixed(2)}</span></div>
                    <div>Messages: <span className="font-medium">{state.totalMessages.toLocaleString()}</span></div>
                    <div>Trend: <span className={`font-medium ${
                      state.trend === 'improving' ? 'text-green-400' : 
                      state.trend === 'declining' ? 'text-red-400' : 'text-yellow-400'
                    }`}>{state.trend}</span></div>
                  </div>
                  <div className="mt-2 pt-2 border-t border-gray-600">
                    <div className="text-xs">
                      <div>🚌 Bus: {state.transportBreakdown.bus}</div>
                      <div>🚇 Metro: {state.transportBreakdown.metro}</div>
                      <div>🚂 Train: {state.transportBreakdown.train}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        
        {/* Regional Labels */}
        <div className="absolute top-4 left-4 text-xs text-gray-600 bg-white/80 p-2 rounded">
          <div className="font-semibold mb-1">Regions</div>
          <div>🔵 North • 🟢 South • 🟡 East • 🟠 West • 🟣 Central</div>
        </div>
      </div>
      
      {/* Legend */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-green-500"></div>
            <span className="text-sm">Positive Sentiment</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
            <span className="text-sm">Neutral Sentiment</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-red-500"></div>
            <span className="text-sm">Negative Sentiment</span>
          </div>
        </div>
        
        <div className="text-sm text-gray-500">
          Total States: {filteredStates.length} | 
          Last Updated: {new Date().toLocaleTimeString('en-IN')}
        </div>
      </div>
      
      {/* Quick Stats */}
      <div className="mt-4 grid grid-cols-5 gap-4 text-center">
        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="text-lg font-bold text-blue-600">
            {filteredStates.filter(s => INDIAN_STATES[s.state]?.region === 'north').length}
          </div>
          <div className="text-xs text-blue-600">North</div>
        </div>
        <div className="bg-green-50 p-3 rounded-lg">
          <div className="text-lg font-bold text-green-600">
            {filteredStates.filter(s => INDIAN_STATES[s.state]?.region === 'south').length}
          </div>
          <div className="text-xs text-green-600">South</div>
        </div>
        <div className="bg-yellow-50 p-3 rounded-lg">
          <div className="text-lg font-bold text-yellow-600">
            {filteredStates.filter(s => INDIAN_STATES[s.state]?.region === 'east').length}
          </div>
          <div className="text-xs text-yellow-600">East</div>
        </div>
        <div className="bg-orange-50 p-3 rounded-lg">
          <div className="text-lg font-bold text-orange-600">
            {filteredStates.filter(s => INDIAN_STATES[s.state]?.region === 'west').length}
          </div>
          <div className="text-xs text-orange-600">West</div>
        </div>
        <div className="bg-purple-50 p-3 rounded-lg">
          <div className="text-lg font-bold text-purple-600">
            {filteredStates.filter(s => INDIAN_STATES[s.state]?.region === 'central').length}
          </div>
          <div className="text-xs text-purple-600">Central</div>
        </div>
      </div>
    </div>
  );
};