import anthropic
import os
from dotenv import load_dotenv

# Load environment variables from .env file in the toprank directory
current_dir = os.path.dirname(os.path.abspath(__file__))
seo_analysis_dir = os.path.dirname(current_dir)
seo_dir = os.path.dirname(seo_analysis_dir)
project_root = os.path.dirname(seo_dir)
env_path = os.path.join(project_root, '.env')
load_dotenv(env_path)

print(f"Loading .env from: {env_path}")
print(f".env file exists: {os.path.exists(env_path)}")

api_key = os.environ.get("ANTHROPIC_API_KEY")
print(f"API Key found: {bool(api_key)}")
print(f"API Key length: {len(api_key) if api_key else 0}")
print(f"API Key starts with: {api_key[:10] if api_key else 'None'}...")

if not api_key:
    print("ERROR: API key not found!")
    exit(1)

try:
    print("Testing Claude API...")
    client = anthropic.Anthropic(api_key=api_key)
    
    message = client.messages.create(
        model="claude-3-5-sonnet-20241022",
        max_tokens=100,
        messages=[
            {"role": "user", "content": "Say 'Claude API is working!'"}
        ]
    )
    
    print("SUCCESS: Claude API is working!")
    print(f"Response: {message.content[0].text}")
    
except Exception as e:
    print(f"ERROR: Claude API call failed: {str(e)}")
    exit(1)
