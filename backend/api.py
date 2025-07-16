from flask import Flask, jsonify
from flask_cors import CORS
import mysql.connector
from collections import defaultdict
import datetime

app = Flask(__name__)
CORS(app)

# --- MySQL Configuration ---
db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': 'gadheullu12',  # your password if any
    'database': 'transport_sentiment_app'
}

# --- Helper Functions ---
def determine_transport_type(text):
    """Enhanced transport type detection"""
    text = text.lower()
    if any(keyword in text for keyword in ['metro', 'मेट्रो', 'subway', 'dmrc']):
        return "metro"
    elif any(keyword in text for keyword in ['train', 'ट्रेन', 'railway', 'irctc', 'local train']):
        return "train"
    elif any(keyword in text for keyword in ['auto', 'ऑटो', 'rickshaw', 'three wheeler']):
        return "auto"
    elif any(keyword in text for keyword in ['taxi', 'टैक्सी', 'cab', 'ola', 'uber']):
        return "taxi"
    else:
        return "bus"  # default fallback

def determine_sentiment_score(label):
    return {
        'positive': 1,
        'negative': -1,
        'neutral': 0
    }.get(label.lower(), 0)

def get_db_connection():
    """Get database connection with error handling"""
    try:
        return mysql.connector.connect(**db_config)
    except mysql.connector.Error as err:
        print(f"Database connection error: {err}")
        return None

# --- Routes ---

@app.route('/api/status')
def status():
    """API health check"""
    try:
        conn = get_db_connection()
        if conn:
            cursor = conn.cursor()
            cursor.execute("SELECT COUNT(*) FROM tweet_sentiment")
            count = cursor.fetchone()[0]
            cursor.close()
            conn.close()
            return jsonify({
                'status': 'API is running!',
                'database': 'connected',
                'total_tweets': count
            })
        else:
            return jsonify({
                'status': 'API is running!',
                'database': 'disconnected',
                'total_tweets': 0
            }), 500
    except Exception as e:
        return jsonify({
            'status': 'API is running!',
            'database': 'error',
            'error': str(e)
        }), 500

@app.route('/api/tweets')
def get_tweets():
    """Get recent tweets with sentiment analysis"""
    try:
        conn = get_db_connection()
        if not conn:
            return jsonify({"error": "Database connection failed"}), 500
            
        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
            SELECT * FROM tweet_sentiment 
            ORDER BY created_at DESC 
            LIMIT 100
        """)
        rows = cursor.fetchall()

        tweets = []
        for row in rows:
            sentiment_label = row.get('sentiment', 'neutral')
            transport_type = row.get('transport_type', 'bus')
            
            tweets.append({
                "id": row['id'],
                "text": row['text'],
                "timestamp": row['created_at'].isoformat() if row['created_at'] else datetime.datetime.now().isoformat(),
                "location": f"{row.get('city', 'Unknown')}, {row.get('state', 'Unknown')}",
                "state": row.get('state', 'Unknown'),
                "city": row.get('city', 'Unknown'),
                "transportType": transport_type,
                "sentiment": {
                    "polarity": float(row.get('polarity', 0)),
                    "label": sentiment_label,
                    "confidence": 0.85  # dummy value, can be enhanced
                }
            })

        cursor.close()
        conn.close()
        return jsonify(tweets)

    except mysql.connector.Error as err:
        return jsonify({"error": f"Database error: {str(err)}"}), 500
    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500

@app.route('/api/states')
def get_states_summary():
    """Get aggregated sentiment data by state"""
    try:
        conn = get_db_connection()
        if not conn:
            return jsonify({"error": "Database connection failed"}), 500
            
        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
            SELECT 
                state,
                COUNT(*) as total_messages,
                AVG(polarity) as avg_sentiment,
                SUM(CASE WHEN sentiment = 'positive' THEN 1 ELSE 0 END) as positive_count,
                SUM(CASE WHEN sentiment = 'negative' THEN 1 ELSE 0 END) as negative_count,
                SUM(CASE WHEN sentiment = 'neutral' THEN 1 ELSE 0 END) as neutral_count,
                SUM(CASE WHEN transport_type = 'bus' THEN 1 ELSE 0 END) as bus_count,
                SUM(CASE WHEN transport_type = 'metro' THEN 1 ELSE 0 END) as metro_count,
                SUM(CASE WHEN transport_type = 'train' THEN 1 ELSE 0 END) as train_count,
                SUM(CASE WHEN transport_type = 'auto' THEN 1 ELSE 0 END) as auto_count,
                SUM(CASE WHEN transport_type = 'taxi' THEN 1 ELSE 0 END) as taxi_count
            FROM tweet_sentiment 
            GROUP BY state
            ORDER BY total_messages DESC
        """)
        rows = cursor.fetchall()

        states_data = []
        for row in rows:
            states_data.append({
                "state": row['state'],
                "sentimentScore": float(row['avg_sentiment'] or 0),
                "totalMessages": row['total_messages'],
                "transportBreakdown": {
                    "bus": row['bus_count'] or 0,
                    "metro": row['metro_count'] or 0,
                    "train": row['train_count'] or 0,
                    "auto": row['auto_count'] or 0,
                    "taxi": row['taxi_count'] or 0
                },
                "sentimentBreakdown": {
                    "positive": row['positive_count'] or 0,
                    "negative": row['negative_count'] or 0,
                    "neutral": row['neutral_count'] or 0
                }
            })

        cursor.close()
        conn.close()
        return jsonify(states_data)

    except mysql.connector.Error as err:
        return jsonify({"error": f"Database error: {str(err)}"}), 500
    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500

@app.route('/api/states/<state_name>')
def get_state_details(state_name):
    """Get detailed data for a specific state"""
    try:
        conn = get_db_connection()
        if not conn:
            return jsonify({"error": "Database connection failed"}), 500
            
        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
            SELECT 
                city,
                COUNT(*) as total_messages,
                AVG(polarity) as avg_sentiment,
                transport_type,
                sentiment
            FROM tweet_sentiment 
            WHERE state = %s
            GROUP BY city, transport_type, sentiment
            ORDER BY total_messages DESC
        """, (state_name,))
        rows = cursor.fetchall()

        cursor.close()
        conn.close()
        return jsonify(rows)

    except mysql.connector.Error as err:
        return jsonify({"error": f"Database error: {str(err)}"}), 500
    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500

@app.route('/api/analytics/trends')
def get_sentiment_trends():
    """Get sentiment trends over time"""
    try:
        conn = get_db_connection()
        if not conn:
            return jsonify({"error": "Database connection failed"}), 500
            
        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
            SELECT 
                DATE(created_at) as date,
                HOUR(created_at) as hour,
                state,
                transport_type,
                AVG(polarity) as avg_sentiment,
                COUNT(*) as message_count
            FROM tweet_sentiment 
            WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
            GROUP BY DATE(created_at), HOUR(created_at), state, transport_type
            ORDER BY date DESC, hour DESC
        """)
        rows = cursor.fetchall()

        cursor.close()
        conn.close()
        return jsonify(rows)

    except mysql.connector.Error as err:
        return jsonify({"error": f"Database error: {str(err)}"}), 500
    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500

# --- Run Server ---
if __name__ == '__main__':
    print("🚀 Starting Indian Transport Sentiment API...")
    print("📊 Serving data for all Indian states")
    print("🔗 API endpoints:")
    print("   - /api/status - Health check")
    print("   - /api/tweets - Recent tweets")
    print("   - /api/states - State-wise summary")
    print("   - /api/states/<state> - State details")
    print("   - /api/analytics/trends - Sentiment trends")
    app.run(debug=True, host='0.0.0.0', port=5000)