from flask import Flask, jsonify
from flask_cors import CORS
import mysql.connector
from collections import defaultdict

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
    text = text.lower()
    if "bus" in text:
        return "bus"
    elif "metro" in text:
        return "metro"
    elif "train" in text:
        return "train"
    elif "auto" in text:
        return "auto"
    elif "taxi" in text:
        return "taxi"
    else:
        return "bus"  # default fallback

def determine_sentiment_score(label):
    return {
        'positive': 1,
        'negative': -1,
        'neutral': 0
    }.get(label.lower(), 0)

# --- Routes ---

@app.route('/api/status')
def status():
    return jsonify({'status': 'API is running!'})

@app.route('/api/tweets')
def get_tweets():
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM tweet_sentiment")
        rows = cursor.fetchall()

        tweets = []
        for row in rows:
            sentiment_label = row.get('sentiment', 'neutral')
            transport_type = determine_transport_type(row['text'])
            tweets.append({
                "id": row['id'],
                "text": row['text'],
                "timestamp": row['created_at'].isoformat(),
                "location": row['region'],
                "state": row['region'],
                "transportType": transport_type,
                "sentiment": {
                    "polarity": determine_sentiment_score(sentiment_label),
                    "label": sentiment_label,
                    "confidence": 0.85  # dummy value
                }
            })

        return jsonify(tweets)

    except mysql.connector.Error as err:
        return jsonify({"error": str(err)}), 500

@app.route('/api/states')
def get_states_summary():
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM tweet_sentiment")
        rows = cursor.fetchall()

        state_summary = defaultdict(lambda: {
            "state": "",
            "sentimentScore": 0,
            "totalMessages": 0,
            "transportBreakdown": {
                "bus": 0,
                "metro": 0,
                "train": 0,
                "auto": 0,
                "taxi": 0
            },
            "sentimentBreakdown": {
                "positive": 0,
                "negative": 0,
                "neutral": 0
            }
        })

        for row in rows:
            state = row['region']
            sentiment_label = row.get('sentiment', 'neutral').lower()
            transport_type = determine_transport_type(row['text'])

            data = state_summary[state]
            data["state"] = state
            data["totalMessages"] += 1
            data["sentimentScore"] += determine_sentiment_score(sentiment_label)

            if transport_type in data["transportBreakdown"]:
                data["transportBreakdown"][transport_type] += 1
            if sentiment_label in data["sentimentBreakdown"]:
                data["sentimentBreakdown"][sentiment_label] += 1

        return jsonify(list(state_summary.values()))

    except mysql.connector.Error as err:
        return jsonify({"error": str(err)}), 500

# --- Run Server ---
if __name__ == '__main__':
    app.run(debug=True)
