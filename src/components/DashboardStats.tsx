import React from 'react';
import { StateData, Tweet } from '../types';
import { TrendingUp, TrendingDown, MessageSquare, MapPin, Users, Activity } from 'lucide-react';

interface DashboardStatsProps {
  states: StateData[];
  tweets: Tweet[];
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ states, tweets }) => {
  const totalMessages = states.reduce((sum, state) => sum + state.totalMessages, 0);
  const overallSentiment = states.reduce((sum, state) => sum + state.sentimentScore, 0) / states.length;
  const positiveStates = states.filter(state => state.sentimentScore > 0).length;
  const improvingStates = states.filter(state => state.trend === 'improving').length;
  const totalPopulation = states.reduce((sum, state) => sum + state.population, 0);
  const activeStates = states.filter(state => state.totalMessages > 50).length;

  const stats = [
    {
      title: 'Total Messages',
      value: totalMessages.toLocaleString('en-IN'),
      icon: MessageSquare,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      subtitle: 'Across India'
    },
    {
      title: 'Overall Sentiment',
      value: overallSentiment.toFixed(2),
      icon: overallSentiment > 0 ? TrendingUp : TrendingDown,
      color: overallSentiment > 0 ? 'text-green-600' : 'text-red-600',
      bgColor: overallSentiment > 0 ? 'bg-green-100' : 'bg-red-100',
      subtitle: 'National average'
    },
    {
      title: 'Positive States',
      value: `${positiveStates}/${states.length}`,
      icon: MapPin,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      subtitle: 'Above neutral'
    },
    {
      title: 'Improving Trends',
      value: `${improvingStates}/${states.length}`,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      subtitle: 'Getting better'
    },
    {
      title: 'Population Covered',
      value: `${Math.round(totalPopulation / 10000000)}Cr`,
      icon: Users,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
      subtitle: 'People monitored'
    },
    {
      title: 'Active States',
      value: `${activeStates}/${states.length}`,
      icon: Activity,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      subtitle: 'High activity'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
              <p className="text-2xl font-bold mb-1">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.subtitle}</p>
            </div>
            <div className={`p-3 rounded-full ${stat.bgColor} ml-4`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};