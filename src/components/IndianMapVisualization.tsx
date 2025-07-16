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

  // More accurate state coordinates based on the actual map image
  const stateCoordinates: { [key: string]: { x: number; y: number } } = {
    'Jammu and Kashmir': { x: 25, y: 15 },
    'Ladakh': { x: 35, y: 12 },
    'Himachal Pradesh': { x: 28, y: 22 },
    'Punjab': { x: 22, y: 25 },
    'Haryana': { x: 28, y: 30 },
    'Delhi': { x: 30, y: 32 },
    'Uttarakhand': { x: 35, y: 28 },
    'Uttar Pradesh': { x: 40, y: 38 },
    'Rajasthan': { x: 20, y: 40 },
    'Gujarat': { x: 15, y: 50 },
    'Madhya Pradesh': { x: 35, y: 50 },
    'Bihar': { x: 55, y: 42 },
    'Jharkhand': { x: 55, y: 50 },
    'West Bengal': { x: 60, y: 48 },
    'Sikkim': { x: 62, y: 40 },
    'Assam': { x: 70, y: 42 },
    'Arunachal Pradesh': { x: 75, y: 35 },
    'Nagaland': { x: 75, y: 45 },
    'Manipur': { x: 75, y: 48 },
    'Mizoram': { x: 72, y: 52 },
    'Tripura': { x: 68, y: 52 },
    'Meghalaya': { x: 68, y: 45 },
    'Chhattisgarh': { x: 45, y: 55 },
    'Odisha': { x: 55, y: 58 },
    'Maharashtra': { x: 30, y: 62 },
    'Goa': { x: 25, y: 70 },
    'Karnataka': { x: 32, y: 72 },
    'Telangana': { x: 42, y: 68 },
    'Andhra Pradesh': { x: 45, y: 75 },
    'Tamil Nadu': { x: 40, y: 82 },
    'Kerala': { x: 32, y: 85 }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">India Transport Sentiment Map</h2>
        <div className="text-sm text-gray-600">
          Real-time sentiment analysis across Indian states
        </div>
      </div>
      
      {/* Map Container */}
      <div className="relative rounded-lg h-[500px] overflow-hidden bg-transparent">
        {/* Indian Map Image with Transparent Background */}
        <div className="absolute inset-0 w-full h-full">
          <img 
            src="/MapChart_Map.png" 
            alt="Indian Map" 
            className="w-full h-full object-contain"
            style={{ 
              filter: 'brightness(1.1) contrast(1.05)',
              mixBlendMode: 'multiply',
              backgroundColor: 'transparent'
            }}
            onError={(e) => {
              console.error('Map image failed to load:', e);
              e.currentTarget.style.display = 'none';
            }}
            onLoad={() => console.log('Map image loaded successfully')}
          />
        </div>
        
        {/* State Markers with Accurate Positioning */}
        {filteredStates.map((state, index) => {
          const coords = stateCoordinates[state.state];
          if (!coords) return null;
          
          return (
            <div
              key={state.state}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-10"
              style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
            >
              {/* Heatmap Circle */}
              <div
                className="w-8 h-8 rounded-full opacity-70 animate-pulse"
                style={{
                  backgroundColor: getSentimentColor(state.sentimentScore),
                  transform: `scale(${0.8 + Math.abs(state.sentimentScore) * 1.2})`,
                }}
              />
              
              {/* State Marker */}
              <div
                className="absolute inset-0 w-6 h-6 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-xs font-bold text-white m-1"
                style={{ backgroundColor: getSentimentColor(state.sentimentScore) }}
              >
                {getSentimentEmoji({ polarity: state.sentimentScore, subjectivity: 0.5, label: 'neutral', confidence: 0.8 })}
              </div>
              
              {/* Enhanced Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-20">
                <div className="bg-gray-900 text-white px-4 py-3 rounded-lg text-sm whitespace-nowrap shadow-2xl border border-gray-700">
                  <div className="font-semibold text-yellow-300 mb-1">{state.state}</div>
                  <div className="text-xs text-gray-300 mb-2">
                    Cities: {state.majorCities.slice(0, 2).join(', ')}
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span>Sentiment:</span>
                      <span className={`font-medium ${
                        state.sentimentScore > 0 ? 'text-green-400' : 
                        state.sentimentScore < 0 ? 'text-red-400' : 'text-yellow-400'
                      }`}>
                        {state.sentimentScore.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Messages:</span>
                      <span className="font-medium">{state.totalMessages.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Trend:</span>
                      <span className={`font-medium ${
                        state.trend === 'improving' ? 'text-green-400' : 
                        state.trend === 'declining' ? 'text-red-400' : 'text-yellow-400'
                      }`}>
                        {state.trend === 'improving' ? '📈' : state.trend === 'declining' ? '📉' : '➡️'} {state.trend}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 pt-2 border-t border-gray-600">
                    <div className="text-xs grid grid-cols-2 gap-1">
                      <div>🚌 Bus: {state.transportBreakdown.bus}</div>
                      <div>🚇 Metro: {state.transportBreakdown.metro}</div>
                      <div>🚂 Train: {state.transportBreakdown.train}</div>
                      <div>🛺 Auto: {state.transportBreakdown.auto}</div>
                      <div>🚕 Taxi: {state.transportBreakdown.taxi}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        
        {/* Regional Labels */}
        <div className="absolute top-4 left-4 text-xs text-gray-700 bg-white/90 p-3 rounded-lg shadow-md backdrop-blur-sm">
          <div className="font-semibold mb-2">Regional Coverage</div>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span>North India</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>South India</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span>East India</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
              <span>West India</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-purple-500"></div>
              <span>Central India</span>
            </div>
          </div>
        </div>

        {/* Live Status Indicator */}
        <div className="absolute top-4 right-4 text-xs text-gray-700 bg-white/90 p-3 rounded-lg shadow-md backdrop-blur-sm">
          <div className="flex items-center space-x-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="font-semibold">Live Data</span>
          </div>
          <div>Updated: {new Date().toLocaleTimeString('en-IN')}</div>
        </div>
      </div>
      
      {/* Enhanced Legend */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-green-500"></div>
            <span className="text-sm">Positive (>0.1)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
            <span className="text-sm">Neutral (-0.1 to 0.1)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-red-500"></div>
            <span className="text-sm">Negative (<-0.1)</span>
          </div>
        </div>
        
        <div className="text-sm text-gray-500">
          States: {filteredStates.length}/31 | 
          Transport: {selectedTransportType === 'all' ? 'All Modes' : selectedTransportType.charAt(0).toUpperCase() + selectedTransportType.slice(1)}
        </div>
      </div>
      
      {/* Regional Statistics */}
      <div className="mt-4 grid grid-cols-5 gap-4 text-center">
        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
          <div className="text-lg font-bold text-blue-600">
            {filteredStates.filter(s => INDIAN_STATES[s.state]?.region === 'north').length}
          </div>
          <div className="text-xs text-blue-600 font-medium">North India</div>
          <div className="text-xs text-gray-500 mt-1">
            Avg: {(filteredStates
              .filter(s => INDIAN_STATES[s.state]?.region === 'north')
              .reduce((sum, s) => sum + s.sentimentScore, 0) / 
              filteredStates.filter(s => INDIAN_STATES[s.state]?.region === 'north').length || 0
            ).toFixed(2)}
          </div>
        </div>
        <div className="bg-green-50 p-3 rounded-lg border border-green-200">
          <div className="text-lg font-bold text-green-600">
            {filteredStates.filter(s => INDIAN_STATES[s.state]?.region === 'south').length}
          </div>
          <div className="text-xs text-green-600 font-medium">South India</div>
          <div className="text-xs text-gray-500 mt-1">
            Avg: {(filteredStates
              .filter(s => INDIAN_STATES[s.state]?.region === 'south')
              .reduce((sum, s) => sum + s.sentimentScore, 0) / 
              filteredStates.filter(s => INDIAN_STATES[s.state]?.region === 'south').length || 0
            ).toFixed(2)}
          </div>
        </div>
        <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
          <div className="text-lg font-bold text-yellow-600">
            {filteredStates.filter(s => INDIAN_STATES[s.state]?.region === 'east').length}
          </div>
          <div className="text-xs text-yellow-600 font-medium">East India</div>
          <div className="text-xs text-gray-500 mt-1">
            Avg: {(filteredStates
              .filter(s => INDIAN_STATES[s.state]?.region === 'east')
              .reduce((sum, s) => sum + s.sentimentScore, 0) / 
              filteredStates.filter(s => INDIAN_STATES[s.state]?.region === 'east').length || 0
            ).toFixed(2)}
          </div>
        </div>
        <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
          <div className="text-lg font-bold text-orange-600">
            {filteredStates.filter(s => INDIAN_STATES[s.state]?.region === 'west').length}
          </div>
          <div className="text-xs text-orange-600 font-medium">West India</div>
          <div className="text-xs text-gray-500 mt-1">
            Avg: {(filteredStates
              .filter(s => INDIAN_STATES[s.state]?.region === 'west')
              .reduce((sum, s) => sum + s.sentimentScore, 0) / 
              filteredStates.filter(s => INDIAN_STATES[s.state]?.region === 'west').length || 0
            ).toFixed(2)}
          </div>
        </div>
        <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
          <div className="text-lg font-bold text-purple-600">
            {filteredStates.filter(s => INDIAN_STATES[s.state]?.region === 'central').length}
          </div>
          <div className="text-xs text-purple-600 font-medium">Central India</div>
          <div className="text-xs text-gray-500 mt-1">
            Avg: {(filteredStates
              .filter(s => INDIAN_STATES[s.state]?.region === 'central')
              .reduce((sum, s) => sum + s.sentimentScore, 0) / 
              filteredStates.filter(s => INDIAN_STATES[s.state]?.region === 'central').length || 0
            ).toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
};