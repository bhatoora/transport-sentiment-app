import React from 'react';
import { Filter } from 'lucide-react';

interface FilterPanelProps {
  selectedTransportType: string;
  onTransportTypeChange: (type: string) => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  selectedTransportType,
  onTransportTypeChange
}) => {
  const transportTypes = [
    { value: 'all', label: 'All Transport', icon: '🚌' },
    { value: 'bus', label: 'Bus', icon: '🚌' },
    { value: 'metro', label: 'Metro', icon: '🚇' },
    { value: 'train', label: 'Train', icon: '🚂' },
    { value: 'auto', label: 'Auto Rickshaw', icon: '🛺' },
    { value: 'taxi', label: 'Taxi/Cab', icon: '🚕' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-4 flex items-center space-x-2">
        <Filter className="w-5 h-5 text-gray-500" />
        <span>Transport Filters</span>
      </h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Transport Mode
          </label>
          <div className="grid grid-cols-1 gap-2">
            {transportTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => onTransportTypeChange(type.value)}
                className={`p-3 rounded-lg border text-left transition-all duration-200 ${
                  selectedTransportType === type.value
                    ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-xl">{type.icon}</span>
                  <div>
                    <div className="text-sm font-medium">{type.label}</div>
                    {type.value !== 'all' && (
                      <div className="text-xs text-gray-500">
                        {type.value === 'bus' && 'City buses, state transport'}
                        {type.value === 'metro' && 'Subway, rapid transit'}
                        {type.value === 'train' && 'Railways, local trains'}
                        {type.value === 'auto' && 'Three-wheelers, rickshaws'}
                        {type.value === 'taxi' && 'Cabs, ride-sharing'}
                      </div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="pt-4 border-t border-gray-200">
          <div className="text-sm font-medium text-gray-700 mb-2">Quick Stats</div>
          <div className="space-y-1 text-xs text-gray-600">
            <div>🇮🇳 Covering 31 Indian states</div>
            <div>🏙️ 100+ major cities monitored</div>
            <div>📱 Real-time social media tracking</div>
            <div>🔄 Updates every 3 seconds</div>
          </div>
        </div>
      </div>
    </div>
  );
};