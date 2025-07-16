import { SentimentScore } from '../types';
import { HINDI_SENTIMENT_WORDS } from './indianStatesData';

// Enhanced lexicon for Indian context
const positiveWords = [
  'good', 'great', 'excellent', 'amazing', 'fantastic', 'wonderful', 'awesome',
  'fast', 'efficient', 'clean', 'comfortable', 'reliable', 'convenient', 'smooth',
  'quick', 'punctual', 'helpful', 'friendly', 'safe', 'accessible', 'modern',
  'affordable', 'value', 'satisfied', 'happy', 'pleased', 'impressed',
  // Indian context
  'sahi', 'badhiya', 'mast', 'zabardast', 'kamaal', 'perfect', 'superb'
];

const negativeWords = [
  'bad', 'terrible', 'awful', 'horrible', 'disgusting', 'worst', 'hate',
  'slow', 'delayed', 'late', 'dirty', 'crowded', 'expensive', 'unreliable',
  'broken', 'cancelled', 'stuck', 'frustrated', 'annoyed', 'disappointed', 'angry',
  'pathetic', 'useless', 'waste', 'fraud', 'cheat', 'scam', 'overpriced',
  // Indian context
  'bakwas', 'faltu', 'bekar', 'ghatiya', 'nautanki', 'dhokha', 'looting'
];

const intensifiers = ['very', 'extremely', 'really', 'quite', 'totally', 'absolutely', 'bahut', 'bilkul'];
const negators = ['not', 'never', 'no', 'dont', "don't", 'cannot', 'cant', "can't", 'nahi', 'nahin'];

export function analyzeSentiment(text: string): SentimentScore {
  const words = text.toLowerCase().split(/\s+/);
  let positiveScore = 0;
  let negativeScore = 0;
  let subjectivityScore = 0;
  
  // Check for Hindi words
  const hindiPositive = HINDI_SENTIMENT_WORDS.positive.some(word => text.includes(word));
  const hindiNegative = HINDI_SENTIMENT_WORDS.negative.some(word => text.includes(word));
  
  if (hindiPositive) positiveScore += 1;
  if (hindiNegative) negativeScore += 1;
  
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const prevWord = i > 0 ? words[i - 1] : '';
    
    // Check for intensifiers
    const isIntensified = intensifiers.includes(prevWord);
    const isNegated = negators.includes(prevWord);
    const multiplier = isIntensified ? 1.5 : 1;
    
    if (positiveWords.includes(word)) {
      const score = 1 * multiplier;
      positiveScore += isNegated ? -score : score;
      subjectivityScore += 0.5;
    }
    
    if (negativeWords.includes(word)) {
      const score = 1 * multiplier;
      negativeScore += isNegated ? -score : score;
      subjectivityScore += 0.5;
    }
  }
  
  const totalWords = words.length;
  const normalizedPositive = positiveScore / totalWords;
  const normalizedNegative = negativeScore / totalWords;
  const polarity = normalizedPositive - normalizedNegative;
  const subjectivity = Math.min(subjectivityScore / totalWords, 1);
  
  // Determine label and confidence
  let label: 'positive' | 'negative' | 'neutral';
  let confidence: number;
  
  if (polarity > 0.1) {
    label = 'positive';
    confidence = Math.min(polarity * 2, 1);
  } else if (polarity < -0.1) {
    label = 'negative';
    confidence = Math.min(Math.abs(polarity) * 2, 1);
  } else {
    label = 'neutral';
    confidence = 1 - Math.abs(polarity);
  }
  
  return {
    polarity: Math.max(-1, Math.min(1, polarity)),
    subjectivity,
    label,
    confidence
  };
}

export function getSentimentEmoji(sentiment: SentimentScore): string {
  if (sentiment.polarity > 0.3) return '😊';
  if (sentiment.polarity > 0.1) return '🙂';
  if (sentiment.polarity > -0.1) return '😐';
  if (sentiment.polarity > -0.3) return '😟';
  return '😞';
}

export function getSentimentColor(score: number): string {
  if (score > 0.2) return '#10B981'; // green
  if (score > 0) return '#F59E0B'; // yellow
  if (score > -0.2) return '#EF4444'; // red
  return '#DC2626'; // dark red
}

export function detectTransportType(text: string): 'bus' | 'metro' | 'train' | 'auto' | 'taxi' {
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes('metro') || lowerText.includes('मेट्रो') || lowerText.includes('dmrc')) return 'metro';
  if (lowerText.includes('train') || lowerText.includes('ट्रेन') || lowerText.includes('railway') || lowerText.includes('irctc')) return 'train';
  if (lowerText.includes('auto') || lowerText.includes('ऑटो') || lowerText.includes('rickshaw')) return 'auto';
  if (lowerText.includes('taxi') || lowerText.includes('टैक्सी') || lowerText.includes('cab') || lowerText.includes('ola') || lowerText.includes('uber')) return 'taxi';
  
  return 'bus'; // default
}