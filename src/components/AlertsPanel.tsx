import React from 'react';
import { Alert } from '../types';
import { AlertTriangle, Clock, MapPin, Zap, Train, Bus, Car } from 'lucide-react';

interface AlertsPanelProps {
  alerts: Alert[];
}

export const AlertsPanel: React.FC<AlertsPanelProps> = ({ alerts }) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return <AlertTriangle className="w-4 h-4" />;
      case 'medium': return <Zap className="w-4 h-4" />;
      case 'low': return <Clock className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getTransportIcon = (type: string) => {
    switch (type) {
      case 'metro': return '🚇';
      case 'train': return '🚂';
      case 'bus': return '🚌';
      case 'auto': return '🛺';
      case 'taxi': return '🚕';
      default: return '🚌';
    }
  };

  const highAlerts = alerts.filter(a => a.severity === 'high');
  const mediumAlerts = alerts.filter(a => a.severity === 'medium');
  const lowAlerts = alerts.filter(a => a.severity === 'low');

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5 text-orange-500" />
          <span>Transport Alerts</span>
        </h2>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>{highAlerts.length} High</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span>{mediumAlerts.length} Medium</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>{lowAlerts.length} Low</span>
          </div>
        </div>
      </div>
      
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {alerts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No active alerts</p>
            <p className="text-sm">All transport services running smoothly</p>
          </div>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-lg border ${getSeverityColor(alert.severity)} transition-all duration-200 hover:shadow-md`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  {getSeverityIcon(alert.severity)}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium capitalize">{alert.severity}</span>
                      <span className="text-sm opacity-75">•</span>
                      <span className="text-lg">{getTransportIcon(alert.transportType)}</span>
                      <span className="text-sm opacity-75 capitalize">{alert.transportType}</span>
                    </div>
                    <p className="text-sm mb-2">{alert.message}</p>
                    
                    {alert.affectedRoutes && (
                      <div className="mb-2">
                        <div className="text-xs text-gray-600 mb-1">Affected Routes:</div>
                        <div className="flex flex-wrap gap-1">
                          {alert.affectedRoutes.map((route, index) => (
                            <span key={index} className="px-2 py-1 bg-white/50 rounded text-xs">
                              {route}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-4 text-xs opacity-75">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3" />
                        <span>{alert.city}, {alert.state}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{alert.timestamp.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">
                    {alert.sentimentScore.toFixed(2)}
                  </div>
                  <div className="text-xs opacity-75">sentiment</div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      {alerts.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-600 text-center">
            Last updated: {new Date().toLocaleString('en-IN')} IST
          </div>
        </div>
      )}
    </div>
  );
};