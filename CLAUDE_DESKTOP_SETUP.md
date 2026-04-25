# Claude Desktop Setup for Toprank SEO

## Current Status
- Plugin configuration created at `C:\Users\csp\.claude\plugins.json`
- Toprank v0.12.0 ready for use
- Google Cloud SDK installation in progress

## Next Steps

### 1. Complete Google Cloud SDK Setup
The gcloud installation appears to be running. Once complete:

1. **Restart your terminal/command prompt** to ensure gcloud is in your PATH
2. **Verify installation**: `gcloud --version`
3. **Complete authentication**: `gcloud auth application-default login`
4. **Enable Search Console API**: `gcloud services enable searchconsole.googleapis.com`

### 2. Configure Google Search Console Access
Make sure you're using the same Google account that has access to your Search Console properties.

### 3. Test the Plugin
Once gcloud is set up, restart Claude Desktop and try:
- `/toprank:seo-analysis` for SEO analysis
- `/toprank:ads-audit` for Google Ads analysis (requires additional setup)

### 4. Optional: Google Ads Setup
For Google Ads functionality, you'll need to:
1. Visit https://adsagent.org to get an API key
2. Configure the AdsAgent MCP server

## Troubleshooting
If gcloud isn't found after installation:
- Check: `C:\Program Files\Google\Cloud SDK\google-cloud-sdk\bin\`
- Add to PATH manually if needed
- Restart Claude Desktop after setup

## Skills Available
- `/toprank:seo-analysis` - Complete SEO audit
- `/toprank:ads-audit` - Google Ads performance review
- `/toprank:ads` - Google Ads management
- `/toprank:ads-copy` - Ad copy creation
- `/toprank:content-writer` - SEO content creation
- `/toprank:keyword-research` - Keyword discovery
- `/toprank:meta-tags-optimizer` - Meta tag optimization
- `/toprank:schema-markup-generator` - Structured data
- `/toprank:geo-content-optimizer` - AI citation optimization
