# How to Use Toprank - Quick Start Guide

## Important: These are Claude Desktop Commands, NOT Terminal Commands!

The `/toprank:*` commands only work inside **Claude Desktop**, not in PowerShell or terminal.

## Step 1: Open Claude Desktop
1. Launch Claude Desktop application
2. The plugin should load automatically (check for "Toprank plugin loaded" message)

## Step 2: Use Toprank Commands in Claude Desktop

### SEO Analysis (Main Feature)
Type this in Claude Desktop:
```
/toprank:seo-analysis
```

This will:
- Ask for your website URL
- Connect to Google Search Console
- Analyze 90 days of traffic data
- Show you the 3-5 biggest SEO issues
- Provide specific fixes

### Content Writing
```
/toprank:content-writer
```
- Creates SEO-optimized blog posts
- Includes E-E-A-T signals
- Adds internal linking plans

### Google Ads (Optional)
```
/toprank:ads-audit
```
- Finds wasted ad spend
- Optimizes campaigns

## Step 3: What to Expect

**Example Conversation in Claude Desktop:**

```
You: /toprank:seo-analysis

Claude: I'll analyze your website's SEO performance. What's your website URL?

You: https://yourwebsite.com

Claude: Connected to Search Console. Analyzing data...

[40 seconds later]

Claude: Found 3 critical issues:

1. Your homepage exists at two URLs (www and non-www). Google splits ranking authority.
   Fix: Add canonical tag to non-www version pointing to www version.

2. Two pages compete for "CRM pricing" keyword. Neither ranks well.
   Fix: Consolidate into one comprehensive page and 301 redirect the other.

3. Your pricing page ranks #47 for "CRM pricing" but title doesn't match search intent.
   Fix: Change title from "Pricing" to "CRM Pricing Plans 2024 | Complete Guide"

You: Implement everything.

Claude: [Creates/updates the files with all fixes]
```

## Troubleshooting

**If commands don't work:**
1. Restart Claude Desktop
2. Check plugin is loaded (look for "Toprank" in plugins)
3. Ensure you're typing commands in Claude Desktop, NOT terminal

**If Search Console fails:**
1. Make sure you're using the same Google account that has GSC access
2. Re-run: `gcloud auth application-default login`

## What You Get

- **Immediate insights** from real Google data
- **Specific fixes** with exact implementation steps  
- **Automated content** that actually ranks
- **Continuous optimization** without monthly retainers

This replaces $3,000/month SEO agencies with data-driven, automated optimization.
