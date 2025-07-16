import { IndianStateCoordinates } from '../types';

export const INDIAN_STATES: IndianStateCoordinates = {
  'Andhra Pradesh': { lat: 15.9129, lng: 79.7400, region: 'south' },
  'Arunachal Pradesh': { lat: 28.2180, lng: 94.7278, region: 'east' },
  'Assam': { lat: 26.2006, lng: 92.9376, region: 'east' },
  'Bihar': { lat: 25.0961, lng: 85.3131, region: 'east' },
  'Chhattisgarh': { lat: 21.2787, lng: 81.8661, region: 'central' },
  'Goa': { lat: 15.2993, lng: 74.1240, region: 'west' },
  'Gujarat': { lat: 23.0225, lng: 72.5714, region: 'west' },
  'Haryana': { lat: 29.0588, lng: 76.0856, region: 'north' },
  'Himachal Pradesh': { lat: 31.1048, lng: 77.1734, region: 'north' },
  'Jharkhand': { lat: 23.6102, lng: 85.2799, region: 'east' },
  'Karnataka': { lat: 15.3173, lng: 75.7139, region: 'south' },
  'Kerala': { lat: 10.8505, lng: 76.2711, region: 'south' },
  'Madhya Pradesh': { lat: 22.9734, lng: 78.6569, region: 'central' },
  'Maharashtra': { lat: 19.7515, lng: 75.7139, region: 'west' },
  'Manipur': { lat: 24.6637, lng: 93.9063, region: 'east' },
  'Meghalaya': { lat: 25.4670, lng: 91.3662, region: 'east' },
  'Mizoram': { lat: 23.1645, lng: 92.9376, region: 'east' },
  'Nagaland': { lat: 26.1584, lng: 94.5624, region: 'east' },
  'Odisha': { lat: 20.9517, lng: 85.0985, region: 'east' },
  'Punjab': { lat: 31.1471, lng: 75.3412, region: 'north' },
  'Rajasthan': { lat: 27.0238, lng: 74.2179, region: 'north' },
  'Sikkim': { lat: 27.5330, lng: 88.5122, region: 'east' },
  'Tamil Nadu': { lat: 11.1271, lng: 78.6569, region: 'south' },
  'Telangana': { lat: 18.1124, lng: 79.0193, region: 'south' },
  'Tripura': { lat: 23.9408, lng: 91.9882, region: 'east' },
  'Uttar Pradesh': { lat: 26.8467, lng: 80.9462, region: 'north' },
  'Uttarakhand': { lat: 30.0668, lng: 79.0193, region: 'north' },
  'West Bengal': { lat: 22.9868, lng: 87.8550, region: 'east' },
  'Delhi': { lat: 28.7041, lng: 77.1025, region: 'north' },
  'Jammu and Kashmir': { lat: 34.0837, lng: 74.7973, region: 'north' },
  'Ladakh': { lat: 34.1526, lng: 77.5771, region: 'north' }
};

export const MAJOR_CITIES = {
  'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik'],
  'Delhi': ['New Delhi', 'Gurgaon', 'Noida', 'Faridabad'],
  'Karnataka': ['Bangalore', 'Mysore', 'Hubli', 'Mangalore'],
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Salem'],
  'West Bengal': ['Kolkata', 'Howrah', 'Durgapur', 'Siliguri'],
  'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot'],
  'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota'],
  'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Agra', 'Varanasi'],
  'Telangana': ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar'],
  'Kerala': ['Kochi', 'Thiruvananthapuram', 'Kozhikode', 'Thrissur'],
  'Punjab': ['Chandigarh', 'Ludhiana', 'Amritsar', 'Jalandhar'],
  'Haryana': ['Gurgaon', 'Faridabad', 'Panipat', 'Ambala'],
  'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore'],
  'Madhya Pradesh': ['Bhopal', 'Indore', 'Gwalior', 'Jabalpur'],
  'Bihar': ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur'],
  'Odisha': ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Berhampur'],
  'Assam': ['Guwahati', 'Silchar', 'Dibrugarh', 'Jorhat'],
  'Jharkhand': ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro'],
  'Chhattisgarh': ['Raipur', 'Bhilai', 'Korba', 'Bilaspur'],
  'Uttarakhand': ['Dehradun', 'Haridwar', 'Roorkee', 'Haldwani'],
  'Himachal Pradesh': ['Shimla', 'Dharamshala', 'Solan', 'Mandi'],
  'Goa': ['Panaji', 'Margao', 'Vasco da Gama', 'Mapusa']
};

export const TRANSPORT_KEYWORDS = {
  bus: ['bus', 'बस', 'volvo', 'roadways', 'state transport', 'city bus', 'local bus'],
  metro: ['metro', 'मेट्रो', 'subway', 'underground', 'rapid transit', 'dmrc'],
  train: ['train', 'ट्रेन', 'railway', 'irctc', 'indian railways', 'local train', 'express'],
  auto: ['auto', 'ऑटो', 'rickshaw', 'three wheeler', 'tuk tuk'],
  taxi: ['taxi', 'टैक्सी', 'cab', 'ola', 'uber', 'car rental', 'private car']
};

export const HINDI_SENTIMENT_WORDS = {
  positive: ['अच्छा', 'बेहतरीन', 'शानदार', 'सुविधाजनक', 'तेज़', 'साफ', 'आरामदायक'],
  negative: ['बुरा', 'खराब', 'देर', 'गंदा', 'भीड़', 'महंगा', 'परेशानी', 'समस्या']
};