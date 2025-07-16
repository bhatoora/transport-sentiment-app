import { Tweet, StateData, SentimentTrend, Alert } from '../types';
import { analyzeSentiment, detectTransportType } from './sentimentAnalysis';
import { INDIAN_STATES, MAJOR_CITIES } from './indianStatesData';

const states = Object.keys(INDIAN_STATES);
const transportTypes: ('bus' | 'metro' | 'train' | 'auto' | 'taxi')[] = ['bus', 'metro', 'train', 'auto', 'taxi'];

// Real Indian transport complaints and compliments
const sampleTweets = [
  "Mumbai local trains are always overcrowded during peak hours! Need better frequency @WesternRly",
  "Delhi Metro service is excellent today, very clean and punctual. Kudos to @OfficialDMRC",
  "Bangalore traffic is horrible, auto drivers are charging extra fare again 😡",
  "Chennai bus service has improved a lot, new Volvo buses are comfortable",
  "Kolkata Metro breakdown again on Blue Line, daily commuters suffering",
  "Pune PMT buses are running on time today, good job by PMPML",
  "Hyderabad Metro connectivity is amazing, reached airport in 30 mins from Hitech City",
  "Mumbai taxi drivers refusing short distance rides, very frustrating experience",
  "Delhi DTC bus service needs improvement, buses are too old and dirty",
  "Kochi Metro is a game changer for the city, smooth and efficient service",
  "Jaipur city bus service is pathetic, no proper schedule or timing",
  "Gurgaon auto rickshaw drivers are looting passengers with high fares",
  "Ahmedabad BRTS is working well, good connectivity across the city",
  "Lucknow Metro has made travel so convenient, clean and affordable",
  "Bhopal city buses are overcrowded, need more buses on popular routes",
  "Indore public transport is improving with new bus services",
  "Patna auto rickshaws are in terrible condition, unsafe for passengers",
  "Thiruvananthapuram bus service timing is very irregular",
  "Chandigarh city transport is well organized and punctual",
  "Nagpur Metro construction causing traffic jams everywhere"
];

const hindiTweets = [
  "दिल्ली मेट्रो की सेवा आज बहुत अच्छी है, समय पर और साफ",
  "मुंबई लोकल ट्रेन में बहुत भीड़ है, यात्रा करना मुश्किल",
  "बैंगलोर में ऑटो वाले ज्यादा पैसे मांग रहे हैं",
  "चेन्नई बस सेवा में सुधार हुआ है, नई बसें अच्छी हैं",
  "कोलकाता मेट्रो फिर से खराब हो गई, रोज की समस्या",
  "हैदराबाद मेट्रो बहुत बढ़िया है, तेज़ और सुविधाजनक",
  "पुणे की बसें समय पर चल रही हैं आज",
  "जयपुर में सिटी बस की हालत खराब है",
  "लखनऊ मेट्रो से यात्रा करना आसान हो गया है"
];

export function generateMockTweet(): Tweet {
  const state = states[Math.floor(Math.random() * states.length)];
  const cities = MAJOR_CITIES[state] || [state];
  const city = cities[Math.floor(Math.random() * cities.length)];
  const transportType = transportTypes[Math.floor(Math.random() * transportTypes.length)];
  
  const isHindi = Math.random() < 0.3;
  const tweets = isHindi ? hindiTweets : sampleTweets;
  let text = tweets[Math.floor(Math.random() * tweets.length)];
  
  // Customize text for the selected state and transport type
  text = text.replace(/Mumbai|Delhi|Bangalore|Chennai|Kolkata/gi, city);
  text = text.replace(/Metro|train|bus|auto|taxi/gi, transportType);
  
  return {
    id: Math.random().toString(36).substr(2, 9),
    text,
    user: `user${Math.floor(Math.random() * 10000)}`,
    timestamp: new Date(),
    location: `${city}, ${state}`,
    transportType,
    sentiment: analyzeSentiment(text),
    state,
    city,
    language: isHindi ? 'hi' : Math.random() < 0.1 ? 'mixed' : 'en'
  };
}

export function generateStateData(): StateData[] {
  return states.map((state) => {
    const stateInfo = INDIAN_STATES[state];
    const cities = MAJOR_CITIES[state] || [state];
    
    return {
      state,
      stateCode: state.substring(0, 2).toUpperCase(),
      coordinates: [stateInfo.lat, stateInfo.lng] as [number, number],
      sentimentScore: (Math.random() - 0.5) * 0.8,
      totalMessages: Math.floor(Math.random() * 1000) + 100,
      transportBreakdown: {
        bus: Math.floor(Math.random() * 200) + 50,
        metro: state === 'Delhi' || state === 'Maharashtra' || state === 'Karnataka' ? Math.floor(Math.random() * 150) + 30 : Math.floor(Math.random() * 20),
        train: Math.floor(Math.random() * 100) + 20,
        auto: Math.floor(Math.random() * 80) + 15,
        taxi: Math.floor(Math.random() * 60) + 10
      },
      sentimentBreakdown: {
        positive: Math.floor(Math.random() * 60) + 20,
        negative: Math.floor(Math.random() * 40) + 10,
        neutral: Math.floor(Math.random() * 30) + 15
      },
      trend: ['improving', 'declining', 'stable'][Math.floor(Math.random() * 3)] as 'improving' | 'declining' | 'stable',
      lastUpdated: new Date(),
      majorCities: cities,
      population: Math.floor(Math.random() * 100000000) + 10000000
    };
  });
}

export function generateSentimentTrend(): SentimentTrend[] {
  const trends: SentimentTrend[] = [];
  const now = new Date();
  
  for (let i = 23; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000);
    states.slice(0, 10).forEach(state => { // Top 10 states for performance
      transportTypes.forEach(transportType => {
        trends.push({
          timestamp,
          sentiment: (Math.random() - 0.5) * 0.6,
          state,
          transportType
        });
      });
    });
  }
  
  return trends;
}

export function generateAlerts(): Alert[] {
  const alerts: Alert[] = [];
  const severities: ('high' | 'medium' | 'low')[] = ['high', 'medium', 'low'];
  
  for (let i = 0; i < 8; i++) {
    const state = states[Math.floor(Math.random() * states.length)];
    const cities = MAJOR_CITIES[state] || [state];
    const city = cities[Math.floor(Math.random() * cities.length)];
    const transportType = transportTypes[Math.floor(Math.random() * transportTypes.length)];
    const severity = severities[Math.floor(Math.random() * severities.length)];
    
    const messages = [
      `High negative sentiment detected in ${city} for ${transportType} service`,
      `Multiple complaints about ${transportType} delays in ${city}`,
      `${transportType} service disruption reported in ${state}`,
      `Overcrowding issues with ${transportType} in ${city}`,
      `Fare hike complaints for ${transportType} service in ${state}`
    ];
    
    alerts.push({
      id: Math.random().toString(36).substr(2, 9),
      state,
      city,
      severity,
      message: messages[Math.floor(Math.random() * messages.length)],
      timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
      sentimentScore: -0.3 - Math.random() * 0.4,
      transportType,
      affectedRoutes: [`Route ${Math.floor(Math.random() * 50) + 1}`, `Line ${Math.floor(Math.random() * 10) + 1}`]
    });
  }
  
  return alerts.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

// Simulate real-time data fetching (in production, this would connect to Twitter API, news APIs, etc.)
export async function fetchRealTimeData() {
  // This would integrate with:
  // - Twitter API v2 for real-time tweets
  // - News APIs for transport-related news
  // - Government transport APIs
  // - Social media monitoring tools
  
  return {
    tweets: Array.from({ length: 5 }, generateMockTweet),
    alerts: generateAlerts(),
    stateUpdates: generateStateData()
  };
}