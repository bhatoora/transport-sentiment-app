export interface Tweet {
  id: string;
  text: string;
  user: string;
  timestamp: Date;
  location: string;
  transportType: 'bus' | 'metro' | 'train' | 'auto' | 'taxi';
  sentiment: SentimentScore;
  state: string;
  city: string;
  language: 'en' | 'hi' | 'mixed';
}

export interface SentimentScore {
  polarity: number; // -1 to 1
  subjectivity: number; // 0 to 1
  label: 'positive' | 'negative' | 'neutral';
  confidence: number; // 0 to 1
}

export interface StateData {
  state: string;
  stateCode: string;
  coordinates: [number, number];
  sentimentScore: number;
  totalMessages: number;
  transportBreakdown: {
    bus: number;
    metro: number;
    train: number;
    auto: number;
    taxi: number;
  };
  sentimentBreakdown: {
    positive: number;
    negative: number;
    neutral: number;
  };
  trend: 'improving' | 'declining' | 'stable';
  lastUpdated: Date;
  majorCities: string[];
  population: number;
}

export interface SentimentTrend {
  timestamp: Date;
  sentiment: number;
  state: string;
  transportType: string;
}

export interface Alert {
  id: string;
  state: string;
  city: string;
  severity: 'high' | 'medium' | 'low';
  message: string;
  timestamp: Date;
  sentimentScore: number;
  transportType: string;
  affectedRoutes?: string[];
}

export interface WeeklyReport {
  week: string;
  overallSentiment: number;
  totalMessages: number;
  statePerformance: {
    best: string;
    worst: string;
  };
  transportPerformance: {
    bus: number;
    metro: number;
    train: number;
    auto: number;
    taxi: number;
  };
  insights: string[];
  regionalHighlights: {
    north: number;
    south: number;
    east: number;
    west: number;
    central: number;
  };
}

export interface IndianStateCoordinates {
  [key: string]: {
    lat: number;
    lng: number;
    region: 'north' | 'south' | 'east' | 'west' | 'central';
  };
}