import requests
import time
import json
from datetime import datetime, timedelta, timezone
import os

# --- CONFIGURATION ---

# Replace with your actual Bearer Token.
# It's recommended to use environment variables for sensitive data like tokens.
BEARER_TOKEN = "AAAAAAAAAAAAAAAAAAAAAI9g3AEAAAAAJmkjy7NDkkQhX4pUj0dxn6nROv4%3DfbKReZFwCQP2YRdQC7HlRqikYlzOCMgQT05bpwxFnyhDD3Ghfg" 

# Transport-related queries
QUERIES = ["bus", "metro", "train"]
TWEETS_PER_QUERY = 50  # Max 100

# --- SCRIPT START ---

# 1. Add a check to ensure the user has replaced the placeholder token.
if not BEARER_TOKEN or BEARER_TOKEN == "...":
    print("❌ CRITICAL ERROR: Please replace the '...' in the BEARER_TOKEN variable with your actual Twitter API Bearer Token.")
    exit()

# Headers for Twitter API authentication
HEADERS = {
    "Authorization": f"Bearer {BEARER_TOKEN}"
}

# --- TIME CALCULATION FUNCTION ---
# We put this in a function so we can call it again after a rate-limit sleep.
def get_valid_time_window():
    """
    Calculates a safe start and end time for the Twitter API's 7-day recent search.
    Returns formatted start and end time strings.
    """
    now = datetime.now(timezone.utc)
    # End time must be at least 10 seconds before the request. A 30-second buffer is safe.
    end_time = now - timedelta(seconds=30)
    # Start time is set safely within the 7-day window.
    start_time = end_time - timedelta(days=6, hours=23, minutes=50)
    
    # Format timestamps to the exact RFC 3339 format required by the Twitter API.
    start_time_str = start_time.strftime('%Y-%m-%dT%H:%M:%SZ')
    end_time_str = end_time.strftime('%Y-%m-%dT%H:%M:%SZ')
    
    return start_time_str, end_time_str

# Get the initial time window
start_time_str, end_time_str = get_valid_time_window()

print(f"\n🔍 Fetching tweets from {start_time_str} to {end_time_str}\n")

all_tweets = []

# --- MAIN LOOP ---

for query in QUERIES:
    full_query = f"{query} lang:en -is:retweet"
    
    # Use the latest time window for the parameters
    params = {
        "query": full_query,
        "max_results": TWEETS_PER_QUERY,
        "start_time": start_time_str,
        "end_time": end_time_str,
        "tweet.fields": "created_at,lang,author_id,text"
    }

    print(f"🚦 Query: {full_query}")

    url = "https://api.twitter.com/2/tweets/search/recent"

    try:
        response = requests.get(url, headers=HEADERS, params=params)

        if response.status_code == 401:
            print("❌ Error: 401 Unauthorized. Your Bearer Token is invalid or expired.")
            print("   Please check your token and try again. Halting script.")
            break 

        # --- FIXED RATE LIMIT HANDLER ---
        if response.status_code == 429:
            resume_time = datetime.now() + timedelta(minutes=15)
            print(f"⏳ Rate limit hit. The script will sleep for 15 minutes.")
            print(f"   Will resume automatically at approximately {resume_time.strftime('%I:%M:%S %p')}.")
            time.sleep(15 * 60)
            
            print("   Resuming request... Recalculating time window.")
            # **THE FIX**: Recalculate the time window to ensure it's valid after the sleep.
            new_start_time, new_end_time = get_valid_time_window()
            params['start_time'] = new_start_time
            params['end_time'] = new_end_time
            print(f"   New Window: {new_start_time} to {new_end_time}")

            response = requests.get(url, headers=HEADERS, params=params) # Retry request with new times

        # Check the status of the final response
        if response.status_code == 200:
            data = response.json()
            tweets = data.get("data", [])
            print(f"✅ Retrieved {len(tweets)} tweets for '{query}'\n")
            all_tweets.extend(tweets)
        else:
            print(f"❌ Error: {response.status_code} {response.reason}")
            print(f"Response Body: {response.text}")

    except requests.exceptions.RequestException as e:
        print(f"❌ A request exception occurred: {e}")

# --- SAVE RESULTS ---

if all_tweets:
    os.makedirs("backend", exist_ok=True)
    
    with open("backend/data.json", "w", encoding="utf-8") as f:
        json.dump(all_tweets, f, indent=2, ensure_ascii=False)
    print(f"\n💾 Saved {len(all_tweets)} tweets to 'backend/data.json'")
else:
    print("\n⚠️ No tweets were found or saved.")
