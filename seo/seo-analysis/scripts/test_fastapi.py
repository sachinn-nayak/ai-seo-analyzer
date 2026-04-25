import requests
import json

try:
    print("Testing FastAPI server...")
    response = requests.post(
        "http://127.0.0.1:8000/analyze",
        json={"domain": "sc-domain:thegeekonomy.com"},
        timeout=120  # Increased timeout for Claude API call
    )
    
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
    
    if response.status_code == 200:
        data = response.json()
        print(f"Claude Analysis Present: {'claudeAnalysis' in data}")
        print(f"Message: {data.get('message')}")
    
except Exception as e:
    print(f"Error: {str(e)}")
