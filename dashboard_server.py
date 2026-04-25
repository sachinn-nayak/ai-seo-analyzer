#!/usr/bin/env python3
"""
Simple web server for SEO Dashboard
"""

import json
import subprocess
import sys
import os
from http.server import HTTPServer, SimpleHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import threading
import webbrowser
import time

class DashboardHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        parsed_path = urlparse(self.path)
        
        # Serve the main dashboard
        if parsed_path.path == '/' or parsed_path.path == '/index.html':
            self.serve_file('seo_dashboard.html', 'text/html')
        else:
            # Serve static files
            super().do_GET()
    
    def do_POST(self):
        parsed_path = urlparse(self.path)
        
        if parsed_path.path == '/api/analyze':
            self.handle_analysis()
        else:
            self.send_error(404, "API endpoint not found")
    
    def serve_file(self, filename, content_type):
        try:
            with open(filename, 'r', encoding='utf-8') as f:
                content = f.read()
            
            self.send_response(200)
            self.send_header('Content-type', content_type)
            self.send_header('Content-length', str(len(content)))
            self.end_headers()
            self.wfile.write(content.encode('utf-8'))
        except FileNotFoundError:
            self.send_error(404, f"File {filename} not found")
    
    def handle_analysis(self):
        try:
            # Read request body
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            request_data = json.loads(post_data.decode('utf-8'))
            
            site = request_data.get('site')
            days = request_data.get('days', 90)
            
            # Run the SEO analysis
            result = self.run_seo_analysis(site, days)
            
            # Send response
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(result).encode('utf-8'))
            
        except Exception as e:
            print(f"Error in analysis: {e}", file=sys.stderr)
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({"error": str(e)}).encode('utf-8'))
    
    def run_seo_analysis(self, site, days):
        """Run the SEO analysis and return results"""
        try:
            # Get the directory where this script is located
            script_dir = os.path.dirname(os.path.abspath(__file__))
            analyze_script = os.path.join(script_dir, 'seo', 'seo-analysis', 'scripts', 'analyze_gsc.py')
            
            # Create temporary output file
            import tempfile
            temp_file = tempfile.NamedTemporaryFile(mode='w', suffix='.json', delete=False)
            temp_file.close()
            
            # Run the analysis
            cmd = [
                sys.executable, analyze_script,
                '--site', site,
                '--days', str(days),
                '--output', temp_file.name
            ]
            
            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                timeout=300,  # 5 minute timeout
                cwd=script_dir
            )
            
            if result.returncode != 0:
                raise Exception(f"Analysis failed: {result.stderr}")
            
            # Read the results
            with open(temp_file.name, 'r') as f:
                data = json.load(f)
            
            # Clean up temp file
            os.unlink(temp_file.name)
            
            return data
            
        except subprocess.TimeoutExpired:
            raise Exception("Analysis timed out after 5 minutes")
        except Exception as e:
            raise Exception(f"Error running analysis: {str(e)}")

def start_server(port=8080):
    """Start the dashboard server"""
    server_address = ('', port)
    httpd = HTTPServer(server_address, DashboardHandler)
    
    print(f"SEO Dashboard Server starting...")
    print(f"Open your browser and go to: http://localhost:{port}")
    print(f"Press Ctrl+C to stop the server")
    
    # Open browser after a short delay
    def open_browser():
        time.sleep(1)
        webbrowser.open(f'http://localhost:{port}')
    
    threading.Thread(target=open_browser, daemon=True).start()
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")
        httpd.shutdown()

if __name__ == "__main__":
    port = 8080
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
        except ValueError:
            print("Invalid port number. Using default port 8080.")
    
    start_server(port)
