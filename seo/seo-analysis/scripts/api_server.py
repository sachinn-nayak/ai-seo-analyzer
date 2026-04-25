from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import subprocess
import json
import re
import os
import anthropic
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

app = FastAPI()

class DomainRequest(BaseModel):
    domain: str
    days: int = 30  # Default to 30 days if not provided

@app.post("/analyze")
def analyze(request: DomainRequest):
    try:
        # Get the script directory
        script_dir = os.path.dirname(os.path.abspath(__file__))
        script_path = os.path.join(script_dir, "analyze_gsc.py")
        
        print(f"Script directory: {script_dir}")
        print(f"Script path: {script_path}")
        print(f"Domain: {request.domain}")
        print(f"Days: {request.days}")
        
        # Run the Python script with unbuffered output
        result = subprocess.run(
            ["python", "-u", script_path, "--site", request.domain, "--days", str(request.days)],
            capture_output=True,
            text=True,
            cwd=script_dir,
            env=os.environ.copy()
        )
        
        print(f"Return code: {result.returncode}")
        print(f"Stdout length: {len(result.stdout)}")
        print(f"Stderr length: {len(result.stderr)}")
        
        if result.returncode != 0:
            raise HTTPException(
                status_code=500,
                detail=f"Python script failed with code {result.returncode}: {result.stderr}"
            )
        
        # The script outputs to stderr, not stdout
        output_to_check = result.stderr if result.stderr else result.stdout
        print(f"Output to check length: {len(output_to_check)}")
        
        # Try multiple patterns to find the JSON path
        json_path_match = re.search(r'saved to (.+\.json)', output_to_check, re.IGNORECASE)
        if not json_path_match:
            # Try alternative pattern
            json_path_match = re.search(r'(.+\.json)', output_to_check)
        
        if not json_path_match:
            raise HTTPException(
                status_code=500,
                detail=f"Could not extract JSON path from script output. Output: {output_to_check[:1000]}"
            )
        
        json_path = json_path_match.group(1).strip()
        print(f"Extracted JSON path: {json_path}")
        
        # Read the JSON data
        with open(json_path, 'r') as f:
            gsc_data = json.load(f)
        
        # Call Claude API for SEO analysis
        api_key = os.environ.get("ANTHROPIC_API_KEY")
        print(f"API Key found: {bool(api_key)}")
        print(f"API Key length: {len(api_key) if api_key else 0}")
        print(f"API Key starts with: {api_key[:10] if api_key else 'None'}...")
        
        if not api_key:
            print("Warning: ANTHROPIC_API_KEY not found, returning raw data")
            return {
                "gscData": gsc_data,
                "message": "Data fetched successfully (Claude analysis skipped - API key not set)"
            }
        
        try:
            # Use direct HTTP request with correct headers and endpoint
            import requests
            
            # Create the SEO analysis prompt (summarized to avoid rate limits)
            summary = gsc_data.get('summary', {})
            cannibalization_count = len(gsc_data.get('cannibalization', []))
            top_queries = gsc_data.get('top_queries', [])[:5]  # Only top 5 queries
            top_pages = gsc_data.get('top_pages', [])[:5]  # Only top 5 pages
            
            prompt = f"""You are a senior SEO expert and strategist. Analyze this Google Search Console data and provide actionable SEO recommendations.

KEY METRICS:
- Total Clicks: {summary.get('clicks', 0)}
- Total Impressions: {summary.get('impressions', 0)}
- CTR: {summary.get('ctr', 0)}%
- Average Position: {summary.get('position', 0)}
- Cannibalization Issues: {cannibalization_count}

TOP QUERIES (by impressions):
{', '.join([f"{q.get('query', 'N/A')} ({q.get('impressions', 0)} impressions)" for q in top_queries])}

TOP PAGES (by clicks):
{', '.join([f"{p.get('page', 'N/A')[:50]}... ({p.get('clicks', 0)} clicks)" for p in top_pages])}

Provide your analysis in the following structured format:

## Overall Summary
Brief overview of the site's SEO performance and health.

## Critical Issues
Most urgent SEO problems needing immediate attention.

## Keyword Opportunities
High-potential keywords that could drive more traffic.

## Quick Wins
Easy improvements for quick SEO gains.

## 30-Day SEO Plan
Prioritized action items for the next 30 days.

Focus on the metrics provided above."""

            headers = {
                "Content-Type": "application/json",
                "x-api-key": api_key,
                "anthropic-version": "2023-06-01"
            }
            
            body = {
                "model": "claude-sonnet-4-6",
                "max_tokens": 4000,
                "messages": [
                    {
                        "role": "user",
                        "content": prompt
                    }
                ]
            }
            
            response = requests.post(
                "https://api.anthropic.com/v1/messages",
                headers=headers,
                json=body,
                timeout=120  # Increased timeout for large GSC datasets
            )
            
            if response.status_code == 200:
                data = response.json()
                claude_analysis = data["content"][0]["text"]
                print(f"Claude analysis completed, length: {len(claude_analysis)}")
                
                return {
                    "gscData": gsc_data,
                    "claudeAnalysis": claude_analysis,
                    "message": "Data fetched and analyzed successfully"
                }
            else:
                print(f"Claude API error: Status {response.status_code}, Response: {response.text}")
                return {
                    "gscData": gsc_data,
                    "message": f"Data fetched successfully, but Claude analysis failed: Status {response.status_code}"
                }
            
        except Exception as claude_error:
            print(f"Claude API error: {str(claude_error)}")
            return {
                "gscData": gsc_data,
                "message": f"Data fetched successfully, but Claude analysis failed: {str(claude_error)}"
            }
        
    except Exception as e:
        print(f"Error: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=f"Analysis failed: {str(e)}"
        )

@app.get("/")
def read_root():
    return {"status": "running", "message": "SEO Analysis API is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
