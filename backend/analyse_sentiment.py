import json
import mysql.connector
from textblob import TextBlob
import emoji
import os
import re

# ---------- DATABASE CONFIG ----------
DB_CONFIG = {
    "host": "localhost",
    "user": "root",          # ← change if your user is different
    "password": "gadheullu12",          # ← set your MySQL password
    "database": "transport_sentiment_app"  # ← the DB you selected earlier
}

# ---------- INDIAN STATES AND CITIES MAPPING ----------
INDIAN_STATES_CITIES = {
    'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Kurnool', 'Rajahmundry', 'Tirupati'],
    'Arunachal Pradesh': ['Itanagar', 'Naharlagun', 'Pasighat', 'Tezpur'],
    'Assam': ['Guwahati', 'Silchar', 'Dibrugarh', 'Jorhat', 'Nagaon', 'Tinsukia'],
    'Bihar': ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Darbhanga', 'Bihar Sharif'],
    'Chhattisgarh': ['Raipur', 'Bhilai', 'Korba', 'Bilaspur', 'Durg', 'Rajnandgaon'],
    'Goa': ['Panaji', 'Margao', 'Vasco da Gama', 'Mapusa', 'Ponda'],
    'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar'],
    'Haryana': ['Gurgaon', 'Faridabad', 'Panipat', 'Ambala', 'Yamunanagar', 'Rohtak'],
    'Himachal Pradesh': ['Shimla', 'Dharamshala', 'Solan', 'Mandi', 'Kullu', 'Hamirpur'],
    'Jharkhand': ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro', 'Deoghar', 'Hazaribagh'],
    'Karnataka': ['Bangalore', 'Mysore', 'Hubli', 'Mangalore', 'Belgaum', 'Gulbarga'],
    'Kerala': ['Kochi', 'Thiruvananthapuram', 'Kozhikode', 'Thrissur', 'Kollam', 'Palakkad'],
    'Madhya Pradesh': ['Bhopal', 'Indore', 'Gwalior', 'Jabalpur', 'Ujjain', 'Sagar'],
    'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad', 'Solapur'],
    'Manipur': ['Imphal', 'Thoubal', 'Bishnupur', 'Churachandpur'],
    'Meghalaya': ['Shillong', 'Tura', 'Jowai', 'Nongstoin'],
    'Mizoram': ['Aizawl', 'Lunglei', 'Saiha', 'Champhai'],
    'Nagaland': ['Kohima', 'Dimapur', 'Mokokchung', 'Tuensang'],
    'Odisha': ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Berhampur', 'Sambalpur', 'Puri'],
    'Punjab': ['Chandigarh', 'Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda'],
    'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Bikaner', 'Ajmer'],
    'Sikkim': ['Gangtok', 'Namchi', 'Gyalshing', 'Mangan'],
    'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Salem', 'Tiruchirappalli', 'Tirunelveli'],
    'Telangana': ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Khammam', 'Mahbubnagar'],
    'Tripura': ['Agartala', 'Dharmanagar', 'Udaipur', 'Kailashahar'],
    'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Agra', 'Varanasi', 'Meerut', 'Allahabad'],
    'Uttarakhand': ['Dehradun', 'Haridwar', 'Roorkee', 'Haldwani', 'Rudrapur', 'Kashipur'],
    'West Bengal': ['Kolkata', 'Howrah', 'Durgapur', 'Siliguri', 'Asansol', 'Malda'],
    'Delhi': ['New Delhi', 'Gurgaon', 'Noida', 'Faridabad', 'Ghaziabad'],
    'Jammu and Kashmir': ['Srinagar', 'Jammu', 'Anantnag', 'Baramulla', 'Udhampur'],
    'Ladakh': ['Leh', 'Kargil', 'Nubra', 'Zanskar']
}

# ---------- LOCATION DETECTION FUNCTION ----------
def detect_location_from_text(text):
    """
    Detect Indian state and city from tweet text
    """
    text_lower = text.lower()
    
    # Check for direct state mentions
    for state, cities in INDIAN_STATES_CITIES.items():
        if state.lower() in text_lower:
            # Try to find specific city
            for city in cities:
                if city.lower() in text_lower:
                    return state, city
            return state, cities[0]  # Return capital/major city as default
    
    # Check for city mentions
    for state, cities in INDIAN_STATES_CITIES.items():
        for city in cities:
            if city.lower() in text_lower:
                return state, city
    
    # Check for common abbreviations and nicknames
    location_mappings = {
        'mumbai': ('Maharashtra', 'Mumbai'),
        'delhi': ('Delhi', 'New Delhi'),
        'bangalore': ('Karnataka', 'Bangalore'),
        'bengaluru': ('Karnataka', 'Bangalore'),
        'chennai': ('Tamil Nadu', 'Chennai'),
        'kolkata': ('West Bengal', 'Kolkata'),
        'calcutta': ('West Bengal', 'Kolkata'),
        'hyderabad': ('Telangana', 'Hyderabad'),
        'pune': ('Maharashtra', 'Pune'),
        'ahmedabad': ('Gujarat', 'Ahmedabad'),
        'surat': ('Gujarat', 'Surat'),
        'jaipur': ('Rajasthan', 'Jaipur'),
        'lucknow': ('Uttar Pradesh', 'Lucknow'),
        'kanpur': ('Uttar Pradesh', 'Kanpur'),
        'nagpur': ('Maharashtra', 'Nagpur'),
        'patna': ('Bihar', 'Patna'),
        'indore': ('Madhya Pradesh', 'Indore'),
        'bhopal': ('Madhya Pradesh', 'Bhopal'),
        'ludhiana': ('Punjab', 'Ludhiana'),
        'agra': ('Uttar Pradesh', 'Agra'),
        'nashik': ('Maharashtra', 'Nashik'),
        'vadodara': ('Gujarat', 'Vadodara'),
        'gurgaon': ('Haryana', 'Gurgaon'),
        'gurugram': ('Haryana', 'Gurgaon'),
        'noida': ('Delhi', 'Noida'),
        'faridabad': ('Haryana', 'Faridabad'),
        'ghaziabad': ('Delhi', 'Ghaziabad'),
        'rajkot': ('Gujarat', 'Rajkot'),
        'kochi': ('Kerala', 'Kochi'),
        'cochin': ('Kerala', 'Kochi'),
        'coimbatore': ('Tamil Nadu', 'Coimbatore'),
        'madurai': ('Tamil Nadu', 'Madurai'),
        'jodhpur': ('Rajasthan', 'Jodhpur'),
        'raipur': ('Chhattisgarh', 'Raipur'),
        'kota': ('Rajasthan', 'Kota'),
        'guwahati': ('Assam', 'Guwahati'),
        'chandigarh': ('Punjab', 'Chandigarh'),
        'thiruvananthapuram': ('Kerala', 'Thiruvananthapuram'),
        'trivandrum': ('Kerala', 'Thiruvananthapuram'),
        'mysore': ('Karnataka', 'Mysore'),
        'mysuru': ('Karnataka', 'Mysore'),
        'salem': ('Tamil Nadu', 'Salem'),
        'meerut': ('Uttar Pradesh', 'Meerut'),
        'jabalpur': ('Madhya Pradesh', 'Jabalpur'),
        'gwalior': ('Madhya Pradesh', 'Gwalior'),
        'vijayawada': ('Andhra Pradesh', 'Vijayawada'),
        'visakhapatnam': ('Andhra Pradesh', 'Visakhapatnam'),
        'vizag': ('Andhra Pradesh', 'Visakhapatnam'),
        'ranchi': ('Jharkhand', 'Ranchi'),
        'jamshedpur': ('Jharkhand', 'Jamshedpur'),
        'dhanbad': ('Jharkhand', 'Dhanbad'),
        'amritsar': ('Punjab', 'Amritsar'),
        'jalandhar': ('Punjab', 'Jalandhar'),
        'allahabad': ('Uttar Pradesh', 'Allahabad'),
        'prayagraj': ('Uttar Pradesh', 'Allahabad'),
        'varanasi': ('Uttar Pradesh', 'Varanasi'),
        'banaras': ('Uttar Pradesh', 'Varanasi'),
        'howrah': ('West Bengal', 'Howrah'),
        'durgapur': ('West Bengal', 'Durgapur'),
        'siliguri': ('West Bengal', 'Siliguri'),
        'asansol': ('West Bengal', 'Asansol')
    }
    
    for keyword, (state, city) in location_mappings.items():
        if keyword in text_lower:
            return state, city
    
    # Default fallback - could be improved with more sophisticated NLP
    return 'Delhi', 'New Delhi'

# ---------- TRANSPORT TYPE DETECTION ----------
def detect_transport_type(text):
    """
    Detect transport type from tweet text
    """
    text_lower = text.lower()
    
    # Metro keywords
    if any(keyword in text_lower for keyword in ['metro', 'मेट्रो', 'subway', 'dmrc', 'bmrcl', 'kmrl', 'mmrc']):
        return 'metro'
    
    # Train keywords
    if any(keyword in text_lower for keyword in ['train', 'ट्रेन', 'railway', 'irctc', 'local train', 'express', 'rajdhani', 'shatabdi']):
        return 'train'
    
    # Auto rickshaw keywords
    if any(keyword in text_lower for keyword in ['auto', 'ऑटो', 'rickshaw', 'three wheeler', 'tuk tuk']):
        return 'auto'
    
    # Taxi keywords
    if any(keyword in text_lower for keyword in ['taxi', 'टैक्सी', 'cab', 'ola', 'uber', 'car rental']):
        return 'taxi'
    
    # Bus keywords (default)
    return 'bus'

# ---------- SENTIMENT ANALYSIS FUNCTION ----------
def analyze_sentiment(text):
    """
    Enhanced sentiment analysis for Indian context
    """
    # Remove emojis for TextBlob analysis
    text_clean = ''.join(c for c in text if c not in emoji.EMOJI_DATA)
    
    # Get emoji sentiment
    text_emojis = ''.join(c for c in text if c in emoji.EMOJI_DATA)
    emoji_sentiment = 0
    
    if text_emojis:
        positive_emojis = ["😊", "😁", "😄", "😍", "👍", "✅", "💚", "🎉", "👌", "😀"]
        negative_emojis = ["😠", "😡", "🤬", "💢", "👎", "❌", "💔", "😞", "😢", "😤"]
        
        for emoji_char in text_emojis:
            if emoji_char in positive_emojis:
                emoji_sentiment += 0.3
            elif emoji_char in negative_emojis:
                emoji_sentiment -= 0.3
    
    # TextBlob sentiment
    blob = TextBlob(text_clean)
    polarity = blob.sentiment.polarity + emoji_sentiment
    
    # Clamp polarity between -1 and 1
    polarity = max(-1, min(1, polarity))
    
    if polarity > 0.1:
        return "positive"
    elif polarity < -0.1:
        return "negative"
    else:
        return "neutral"

# ---------- LOAD TWEETS ----------
input_path = "backend/data.json"
if not os.path.exists(input_path):
    print("❌ 'data.json' not found. Run scraper first.")
    exit()

with open(input_path, "r", encoding="utf-8") as f:
    tweets = json.load(f)

if not tweets:
    print("⚠️ No tweets to process.")
    exit()

# ---------- CONNECT TO MYSQL ----------
try:
    conn = mysql.connector.connect(**DB_CONFIG)
    cursor = conn.cursor()
    print("✅ Connected to MySQL.")

    # ---------- CREATE TABLE IF NOT EXISTS ----------
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS tweet_sentiment (
            id VARCHAR(50) PRIMARY KEY,
            text TEXT,
            sentiment VARCHAR(10),
            created_at DATETIME,
            author_id VARCHAR(50),
            state VARCHAR(100),
            city VARCHAR(100),
            transport_type VARCHAR(20),
            polarity DECIMAL(3,2) DEFAULT 0.00
        )
    """)

    inserted = 0
    for tweet in tweets:
        tweet_id = tweet['id']
        text = tweet['text']
        sentiment = analyze_sentiment(text)
        created_at = tweet['created_at'].replace("Z", "")
        author_id = tweet['author_id']
        
        # Detect location and transport type
        state, city = detect_location_from_text(text)
        transport_type = detect_transport_type(text)
        
        # Calculate polarity score
        blob = TextBlob(text)
        polarity = blob.sentiment.polarity

        try:
            cursor.execute("""
                INSERT INTO tweet_sentiment (id, text, created_at, sentiment, author_id, state, city, transport_type, polarity)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, (tweet_id, text, created_at, sentiment, author_id, state, city, transport_type, polarity))
            inserted += 1
        except mysql.connector.IntegrityError:
            # Skip duplicates
            continue

    conn.commit()
    print(f"💾 Uploaded {inserted} new tweet records to MySQL.")
    
    # Print summary by state
    cursor.execute("""
        SELECT state, COUNT(*) as count, 
               AVG(polarity) as avg_sentiment,
               SUM(CASE WHEN sentiment = 'positive' THEN 1 ELSE 0 END) as positive,
               SUM(CASE WHEN sentiment = 'negative' THEN 1 ELSE 0 END) as negative,
               SUM(CASE WHEN sentiment = 'neutral' THEN 1 ELSE 0 END) as neutral
        FROM tweet_sentiment 
        GROUP BY state 
        ORDER BY count DESC
    """)
    
    results = cursor.fetchall()
    print("\n📊 STATE-WISE SUMMARY:")
    print("=" * 80)
    for row in results:
        state, count, avg_sentiment, positive, negative, neutral = row
        print(f"{state:20} | Messages: {count:4} | Sentiment: {avg_sentiment:+.2f} | +{positive} -{negative} ={neutral}")

except mysql.connector.Error as e:
    print("❌ MySQL Error:", e)

finally:
    if 'cursor' in locals(): cursor.close()
    if 'conn' in locals(): conn.close()