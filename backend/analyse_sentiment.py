import json
import mysql.connector
from textblob import TextBlob
import emoji
import os

# ---------- DATABASE CONFIG ----------
DB_CONFIG = {
    "host": "localhost",
    "user": "root",          # ← change if your user is different
    "password": "gadheullu12",          # ← set your MySQL password
    "database": "transport_sentiment_app"  # ← the DB you selected earlier
}
region = "Delhi"
# ---------- SENTIMENT ANALYSIS FUNCTION ----------
def analyze_sentiment(text):
    text_emojis = ''.join(c for c in text if c in emoji.EMOJI_DATA)
    blob = TextBlob(text)
    polarity = blob.sentiment.polarity

    # Add emoji sentiment if any
    if text_emojis:
        if any(e in text_emojis for e in ["😠", "😡", "🤬", "💢"]):
            polarity -= 0.4
        elif any(e in text_emojis for e in ["😊", "😁", "😄", "😍", "👍"]):
            polarity += 0.4

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
            author_id VARCHAR(50)
        )
    """)

    inserted = 0
    for tweet in tweets:
        tweet_id = tweet['id']
        text = tweet['text']
        sentiment = analyze_sentiment(text)
        created_at = tweet['created_at'].replace("Z", "")
        author_id = tweet['author_id']

        try:
            cursor.execute("""
                INSERT INTO tweet_sentiment (id, text, created_at, sentiment, region)
                VALUES (%s, %s, %s, %s, %s)
            """, (tweet_id, text, created_at, sentiment, region))
            inserted += 1
        except mysql.connector.IntegrityError:
            # Skip duplicates
            continue

    conn.commit()
    print(f"💾 Uploaded {inserted} new tweet records to MySQL.")

except mysql.connector.Error as e:
    print("❌ MySQL Error:", e)

finally:
    if 'cursor' in locals(): cursor.close()
    if 'conn' in locals(): conn.close()
