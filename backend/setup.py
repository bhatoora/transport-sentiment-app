#!/usr/bin/env python3
"""
Setup script for the Twitter scraping backend
"""

import subprocess
import sys
import os

def install_requirements():
    """Install required Python packages"""
    print("📦 Installing Python dependencies...")
    
    requirements = [
        "requests==2.31.0",
        "flask==2.3.3",
        "flask-cors==4.0.0",
        "textblob==0.17.1"
    ]
    
    for requirement in requirements:
        try:
            subprocess.check_call([sys.executable, "-m", "pip", "install", requirement])
            print(f"✅ Installed {requirement}")
        except subprocess.CalledProcessError as e:
            print(f"❌ Failed to install {requirement}: {e}")
            return False
    
    return True

def setup_textblob():
    """Download TextBlob corpora"""
    print("📚 Setting up TextBlob corpora...")
    try:
        import textblob
        textblob.download_corpora()
        print("✅ TextBlob corpora downloaded")
        return True
    except Exception as e:
        print(f"❌ Failed to setup TextBlob: {e}")
        return False

def create_directories():
    """Create necessary directories"""
    print("📁 Creating directories...")
    
    directories = ["backend", "backend/data"]
    
    for directory in directories:
        os.makedirs(directory, exist_ok=True)
        print(f"✅ Created directory: {directory}")

def main():
    """Main setup function"""
    print("🚀 Setting up Twitter Scraping Backend...")
    print("=" * 50)
    
    # Create directories
    create_directories()
    
    # Install requirements
    if not install_requirements():
        print("❌ Failed to install requirements")
        return False
    
    # Setup TextBlob
    if not setup_textblob():
        print("⚠️ TextBlob setup failed, but continuing...")
    
    print("\n✅ Setup completed successfully!")
    print("\n📋 Next steps:")
    print("1. Update your Twitter Bearer Token in twitter_scraper.py")
    print("2. Run: python backend/twitter_scraper.py")
    print("3. Start the React frontend")
    
    return True

if __name__ == "__main__":
    main()