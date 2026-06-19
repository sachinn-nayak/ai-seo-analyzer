# AI SEO Analyzer

> **SEO Dashboard with Claude AI Integration**
>
> This is a customized fork of the Toprank project with an enhanced Next.js dashboard and Claude AI-powered SEO analysis.

A comprehensive SEO dashboard that integrates with Google Search Console and Claude AI to provide actionable SEO insights. Features include domain analysis, keyword tracking, cannibalization detection, CTR analysis, and AI-powered recommendations.

## ⚠️ Important Notice

**This is a fork/customized version of the original Toprank project.** If you clone this repository, you will need to set up your own credentials and API keys. This will not affect the original project or its owner.

## Features

- **Modern Dashboard**: Next.js-based UI with dark/light theme support
- **Google Search Console Integration**: Pull real traffic data, impressions, clicks, CTR, and position data
- **Claude AI Analysis**: AI-powered SEO recommendations and insights
- **Keyword Cannibalization Detection**: Find competing pages for the same keywords
- **CTR Analysis**: Identify high-impression, low-CTR opportunities
- **Data Period Selection**: Analyze data for 7, 30, 90, 180, or 365 days
- **Real-time Metrics**: Accurate data matching Google Search Console UI

## Quick Start

### Prerequisites

1. **Google Cloud SDK**: Install and authenticate with your Google account
2. **Google Search Console API**: Enable the Search Console API in Google Cloud Console
3. **Claude API Key**: Get your API key from [Anthropic](https://console.anthropic.com/)
4. **Node.js 18+**: Required for the Next.js dashboard
5. **Python 3.8+**: Required for the backend scripts

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/sachinn-nayak/ai-seo-analyzer.git
cd ai-seo-analyzer
```

2. **Install Python dependencies:**
```bash
cd backend
pip install -r requirements.txt
cd ..
```

3. **Install Node.js dependencies (for dashboard):**
```bash
cd frontend/seo-dashboard-next
npm install
cd ../..
```

4. **Set up environment variables:**
```bash
# Create .env file in the project root
cp .env.example .env
```

Edit the `.env` file and add your credentials:
```env
ANTHROPIC_API_KEY=your_anthropic_api_key_here
# Add any other required environment variables
```

5. **Authenticate with Google Cloud:**
```bash
gcloud auth application-default login \
  --scopes=https://www.googleapis.com/auth/webmasters,https://www.googleapis.com/auth/webmasters.readonly
```

6. **Start the FastAPI server:**
```bash
cd backend/scripts
python api_server.py
```

The server will start on `http://127.0.0.1:8000`

7. **Start the Next.js dashboard (in a new terminal):**
```bash
cd frontend/seo-dashboard-next
npm run dev
```

The dashboard will be available at `http://localhost:3000`

## Usage

1. Open `http://localhost:3000` in your browser
2. Enter your domain (e.g., `example.com` or `sc-domain:example.com`)
3. Select the data period (7, 30, 90, 180, or 365 days)
4. Click "Analyze Domain"
5. View your GSC data and AI-powered SEO insights

## Project Structure

```
ai-seo-analyzer/
├── frontend/                    # Next.js dashboard frontend
│   ├── seo-dashboard-next/      # Next.js app
│   │   ├── src/
│   │   │   ├── app/            # Next.js app router
│   │   │   ├── components/     # React components
│   │   │   └── lib/            # Utility functions
│   │   ├── package.json
│   │   └── tailwind.config.js
├── backend/                     # Python backend
│   ├── scripts/                # GSC analysis scripts
│   │   ├── analyze_gsc.py      # GSC data extraction
│   │   └── api_server.py       # FastAPI backend
│   └── requirements.txt        # Python dependencies
├── .env.example                # Environment variables template
├── .gitignore                  # Files to exclude from git
└── README.md                   # This file
```

## Credentials Required

You will need to set up the following credentials:

### Google Search Console
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Search Console API
4. Install Google Cloud SDK
5. Authenticate with: `gcloud auth application-default login`

### Claude AI
1. Go to [Anthropic Console](https://console.anthropic.com/)
2. Create an account or sign in
3. Get your API key from the API Keys section
4. Add it to your `.env` file: `ANTHROPIC_API_KEY=your_key_here`

## What's Different from Original

This version includes:
- ✅ Custom Next.js dashboard with modern UI
- ✅ Claude AI integration for SEO recommendations
- ✅ Data period selection (7, 30, 90, 180, 365 days)
- ✅ Fixed date range calculations to match GSC UI
- ✅ Improved markdown rendering for AI responses
- ✅ Dark/light theme support
- ✅ JSON upload feature (commented out by default)

## Troubleshooting

**"gcloud not found" error:**
- Install Google Cloud SDK from https://cloud.google.com/sdk/docs/install
- Restart your terminal after installation

**"Not authenticated" error:**
- Run: `gcloud auth application-default login --scopes=https://www.googleapis.com/auth/webmasters,https://www.googleapis.com/auth/webmasters.readonly`

**Data doesn't match GSC UI:**
- Ensure you're using the same date range
- Check that search type is set to "web"
- Verify you're using the correct property (domain vs sc-domain)

**Claude API errors:**
- Verify your API key is correct
- Check your API credit balance at https://console.anthropic.com/
- Ensure the model name is correct (using `claude-sonnet-4-6`)

## Original Project

This is a fork of the original Toprank project by [nowork-studio](https://github.com/nowork-studio/toprank). The original project provides SEO and Google Ads skills for Claude Code.

## License

MIT License - See [LICENSE](LICENSE) file for details

## Support

For issues specific to this fork, please open an issue on this repository.
For issues related to the original Toprank project, please visit: https://github.com/nowork-studio/toprank
