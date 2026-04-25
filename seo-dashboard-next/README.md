# SEO Audit Dashboard - AI-Powered Google Search Console Analysis

A production-ready, modern SEO audit dashboard built with Next.js 14, Tailwind CSS, and AI-powered analysis. Enter your domain to get comprehensive SEO audits powered by Claude AI, with automatic Google Search Console data fetching and actionable recommendations.

## Features

### Core Functionality
- **Domain-Based Analysis**: Enter your domain to automatically fetch GSC data
- **AI-Powered SEO Audit**: Comprehensive analysis powered by Claude AI
- **Automatic Data Fetching**: Python script integration for GSC data retrieval
- **Detailed Audit Reports**: 
  - Overall performance summary
  - Critical issues identification
  - Page-level problems
  - Keyword opportunities
  - Exact fixes with title/meta suggestions
  - Quick wins for immediate traffic
  - 30-day SEO action plan

### UI/UX Features
- **Dark/Light Mode**: Toggle between themes
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern Interface**: Clean SaaS-style design similar to Ahrefs/SEMrush
- **Interactive Elements**: Hover states, transitions, and micro-interactions

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **UI Components**: Custom components with Radix UI
- **TypeScript**: Full type safety
- **Theme**: Next-themes for dark/light mode

## Project Structure

```
seo-dashboard-next/
src/
  app/
    layout.tsx          # Root layout with theme provider
    page.tsx            # Main dashboard page
    globals.css         # Global styles and theme variables
  components/
    ui/                 # Reusable UI components
      button.tsx
      card.tsx
      input.tsx
      tabs.tsx
    overview-cards.tsx  # Metrics overview cards
    charts-section.tsx  # Traffic charts and visualizations
    pages-table.tsx     # Pages performance table
    queries-table.tsx   # Queries performance table
    cannibalization-section.tsx  # Keyword cannibalization
    insights-panel.tsx   # AI-powered insights
    theme-provider.tsx  # Theme context provider
  lib/
    utils.ts            # Utility functions
package.json
tsconfig.json
tailwind.config.js
next.config.js
```

## Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Python 3+ (for GSC data fetching script)
- Google Cloud SDK with gcloud configured
- Anthropic API key (for Claude AI analysis)

### Setup

1. **Install Node.js dependencies**:
```bash
cd seo-dashboard-next
npm install
```

2. **Set up environment variables**:
```bash
cp .env.example .env.local
# Edit .env.local and add your ANTHROPIC_API_KEY
```

3. **Configure Python script path**:
The dashboard expects the GSC analysis script at:
```
../seo/seo-analysis/scripts/analyze_gsc.py
```

4. **Run development server**:
```bash
npm run dev
```

5. **Open your browser**:
Navigate to `http://localhost:3000` (or the port shown in terminal)

### Production Build

```bash
npm run build
npm start
```

## Usage

### 1. Enter Your Domain
- Input your domain (e.g., `sc-domain:thegeekonomy.com` or `example.com`)
- Click "Analyze Domain" 
- The system will automatically fetch GSC data using the Python script

### 2. Review AI-Powered Audit

The dashboard will display comprehensive SEO analysis including:

- **📊 Overall Summary**: Key metrics and performance indicators
- **🚨 Critical Issues**: High-priority SEO problems requiring immediate attention
- **🔍 Page-Level Problems**: Specific page analysis and recommendations
- **🎯 Keyword Opportunities**: High-value keywords to target
- **🛠️ Exact Fixes**: Specific title tags, meta descriptions, and content improvements
- **🚀 Quick Wins**: Immediate actions to boost traffic
- **📈 30-Day SEO Plan**: Step-by-step action plan for improvement

### 3. Take Action

Based on the audit recommendations:
- Implement the suggested title tags and meta descriptions
- Follow the content improvement suggestions
- Build internal links as recommended
- Execute the 30-day SEO plan

## Configuration

### API Key Setup
1. Get your Anthropic API key from https://console.anthropic.com/
2. Add it to `.env.local`:
```
ANTHROPIC_API_KEY=your_actual_api_key_here
```

### Python Script Configuration
The dashboard expects the GSC analysis script at:
```
../seo/seo-analysis/scripts/analyze_gsc.py
```

If your script is located elsewhere, update the path in:
`src/app/api/analyze-seo/route.ts`

## Customization

### Modifying the Audit Prompt
The Claude AI prompt is in `src/app/api/analyze-seo/route.ts`. You can customize the prompt to change the analysis depth, focus areas, or output format.

### UI Customization
- Modify `src/app/page.tsx` to change the audit display layout
- Update `src/app/globals.css` and `tailwind.config.js` for theme customization
- Add new sections or modify existing ones as needed

### Adding Additional Analysis
You can extend the API route to include:
- Competitor analysis
- Backlink data integration
- Technical SEO checks
- Content gap analysis

## Performance

### Optimization Features
- **Lazy loading**: Components load as needed
- **Efficient rendering**: React.memo and useMemo optimizations
- **Responsive images**: Optimized for different screen sizes
- **Minimal bundle**: Tree-shaking and code splitting

### Analytics Ready
- **Event tracking**: Ready for Google Analytics integration
- **Performance monitoring**: Built-in performance metrics
- **SEO optimized**: Meta tags and structured data

## Troubleshooting

### Common Issues

**"Failed to fetch GSC data"**
- Ensure Python is installed and accessible
- Check that the GSC script path is correct
- Verify Google Cloud SDK authentication

**"Failed to analyze with Claude"**
- Check your ANTHROPIC_API_KEY is set correctly
- Ensure you have API credits available
- Verify network connectivity to Anthropic API

**Script path errors**
- Update the script path in `src/app/api/analyze-seo/route.ts`
- Ensure the relative path matches your project structure

## Deployment

### Important Notes for Deployment
This dashboard requires:
- Python runtime for GSC data fetching
- Google Cloud SDK authentication
- Anthropic API access

### Vercel (Recommended for Frontend Only)
1. Connect your GitHub repository
2. Configure build settings
3. Deploy automatically on push
4. Set environment variables in Vercel dashboard

Note: You'll need a separate backend service for Python script execution on Vercel.

### Docker (Recommended for Full Stack)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

Include Python and Google Cloud SDK in your Docker setup for full functionality.

## Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature-name`
3. Make changes and test
4. Commit changes: `git commit -m 'Add feature'`
5. Push to branch: `git push origin feature-name`
6. Open Pull Request

## License

MIT License - feel free to use in commercial projects

## Support

For issues and questions:
1. Check existing issues on GitHub
2. Create detailed issue description
3. Include steps to reproduce
4. Provide error logs if applicable

## Roadmap

- [ ] Multiple AI model support (GPT-4, etc.)
- [ ] Competitor analysis integration
- [ ] Historical data comparison
- [ ] Custom date range selection
- [ ] Export audit results (PDF, CSV)
- [ ] Multi-site batch analysis
- [ ] Alert system for performance drops
- [ ] Team collaboration features
- [ ] White-label options for agencies

---

**Built with Next.js 14, Tailwind CSS, Claude AI, and modern web technologies**
