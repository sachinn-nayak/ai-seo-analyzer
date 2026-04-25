"use client"

import { useState } from 'react'
import { BarChart3, Moon, Sun, Globe, Loader2, CheckCircle, AlertCircle, Upload } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface GSCData {
  site: string
  summary: {
    clicks: number
    impressions: number
    ctr: number
    position: number
  }
  top_queries: any[]
  top_pages: any[]
  cannibalization: any[]
  [key: string]: any
}

interface AnalysisResponse {
  gscData: GSCData
  claudeAnalysis?: string
  message: string
}

export default function Home() {
  const [domain, setDomain] = useState('')
  const [days, setDays] = useState('30')
  const [isLoading, setIsLoading] = useState(false)
  const [gscData, setGscData] = useState<GSCData | null>(null)
  const [claudeAnalysis, setClaudeAnalysis] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { theme, setTheme } = useTheme()

  const handleAnalyze = async () => {
    if (!domain.trim()) return

    setIsLoading(true)
    setError(null)
    setGscData(null)
    setClaudeAnalysis(null)

    try {
      const response = await fetch('/api/analyze-seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: domain.trim(), days: parseInt(days) })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to analyze domain')
      }

      const data: AnalysisResponse = await response.json()
      setGscData(data.gscData)
      if (data.claudeAnalysis) {
        setClaudeAnalysis(data.claudeAnalysis)
      }
    } catch (error) {
      console.error('Error analyzing domain:', error)
      setError((error as Error).message || 'Failed to analyze domain. Domain input may have Windows compatibility issues. Try JSON upload instead.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsLoading(true)
    setError(null)
    setGscData(null)
    setClaudeAnalysis(null)

    try {
      const text = await file.text()
      const jsonData = JSON.parse(text)
      setGscData(jsonData)
    } catch (error) {
      console.error('Error parsing JSON:', error)
      setError('Invalid JSON file. Please upload a valid GSC analysis JSON file.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold" suppressHydrationWarning>SEO Audit Dashboard</h1>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {!gscData ? (
          /* Input Section */
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <Card className="w-full max-w-2xl">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2" suppressHydrationWarning>
                  <Globe className="h-6 w-6" />
                  SEO Audit Dashboard
                </CardTitle>
                <CardDescription>
                  Enter your domain or upload GSC data to get SEO analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="domain" className="w-full">
                  <TabsList className="grid w-full grid-cols-1">
                    <TabsTrigger value="domain">Domain Input</TabsTrigger>
                    {/* <TabsTrigger value="upload">JSON Upload</TabsTrigger> */}
                  </TabsList>
                  
                  <TabsContent value="domain" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Domain Name</label>
                      <Input
                        placeholder="example.com or sc-domain:example.com"
                        value={domain}
                        onChange={(e) => setDomain(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAnalyze()}
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Data Period</label>
                      <select
                        value={days}
                        onChange={(e) => setDays(e.target.value)}
                        disabled={isLoading}
                        className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                      >
                        <option value="7">Last 7 days</option>
                        <option value="30">Last 30 days</option>
                        <option value="90">Last 90 days</option>
                        <option value="180">Last 180 days</option>
                        <option value="365">Last 365 days</option>
                      </select>
                    </div>
                    <Button
                      onClick={handleAnalyze}
                      disabled={isLoading || !domain.trim()}
                      className="w-full"
                      size="lg"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Globe className="h-4 w-4 mr-2" />
                          Analyze Domain
                        </>
                      )}
                    </Button>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>Enter your domain in format: example.com or sc-domain:example.com</p>
                      <p>⚠️ Domain input may have Windows compatibility issues</p>
                    </div>
                  </TabsContent>
                  
                  {/* <TabsContent value="upload" className="space-y-4 mt-4">
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                      <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          Drop your JSON file here, or click to browse
                        </p>
                        <Input
                          type="file"
                          accept=".json"
                          onChange={handleFileUpload}
                          disabled={isLoading}
                          className="cursor-pointer"
                        />
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>Expected file format: gsc_analysis_*.json</p>
                      <p>Generated by: python seo/seo-analysis/scripts/analyze_gsc.py --site "your-domain" --days 90</p>
                    </div>
                  </TabsContent> */}
                </Tabs>
                
                {error && (
                  <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Audit Results Section */
          <div className="space-y-6">
            {/* Success Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-6 w-6 text-green-600" />
                <h2 className="text-2xl font-bold">SEO Audit Complete</h2>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  setGscData(null)
                  setDomain('')
                }}
              >
                Analyze Another Domain/Upload File
              </Button>
            </div>

            {/* GSC Data Summary - Always Show */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  📊 GSC Data Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{gscData.summary.clicks}</div>
                    <div className="text-sm text-gray-600">Total Clicks</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{gscData.summary.impressions}</div>
                    <div className="text-sm text-gray-600">Impressions</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{gscData.summary.ctr}%</div>
                    <div className="text-sm text-gray-600">CTR</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 dark:bg-orange-950 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">{gscData.summary.position}</div>
                    <div className="text-sm text-gray-600">Avg Position</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Details */}
            <Card>
              <CardHeader>
                <CardTitle>📈 Additional Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div><strong>Site:</strong> {gscData.site}</div>
                <div><strong>Period:</strong> {gscData.period?.start} to {gscData.period?.end} ({gscData.period?.days} days)</div>
                <div><strong>Cannibalization Issues:</strong> {gscData.cannibalization?.length || 0}</div>
                <div><strong>Top Queries:</strong> {gscData.top_queries?.length || 0}</div>
                <div><strong>Top Pages:</strong> {gscData.top_pages?.length || 0}</div>
              </CardContent>
            </Card>

            {/* Claude AI Analysis */}
            {claudeAnalysis ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    🤖 AI-Powered SEO Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose dark:prose-invert max-w-none space-y-4">
                    {claudeAnalysis.split('\n').map((line, index) => {
                      const trimmedLine = line.trim()
                      
                      // Handle section headers (##)
                      if (trimmedLine.startsWith('## ')) {
                        return (
                          <h2 key={index} className="text-2xl font-bold mt-8 mb-4 text-primary">
                            {trimmedLine.replace('## ', '')}
                          </h2>
                        )
                      }
                      
                      // Handle subsection headers (###)
                      if (trimmedLine.startsWith('### ')) {
                        return (
                          <h3 key={index} className="text-xl font-semibold mt-6 mb-3 text-primary">
                            {trimmedLine.replace('### ', '')}
                          </h3>
                        )
                      }
                      
                      // Handle bold text (**text**)
                      if (trimmedLine.startsWith('**') && trimmedLine.endsWith('**')) {
                        return (
                          <p key={index} className="font-bold text-lg my-3">
                            {trimmedLine.replace(/\*\*/g, '')}
                          </p>
                        )
                      }
                      
                      // Handle bullet points (- or •)
                      if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('• ')) {
                        return (
                          <li key={index} className="ml-6 mb-2 list-disc">
                            {trimmedLine.replace(/^- /, '').replace(/^• /, '').replace(/\*\*/g, '')}
                          </li>
                        )
                      }
                      
                      // Handle numbered lists
                      if (/^\d+\.\s/.test(trimmedLine)) {
                        return (
                          <li key={index} className="ml-6 mb-2 list-decimal">
                            {trimmedLine.replace(/^\d+\.\s/, '').replace(/\*\*/g, '')}
                          </li>
                        )
                      }
                      
                      // Handle empty lines
                      if (trimmedLine === '') {
                        return <div key={index} className="h-2" />
                      }
                      
                      // Handle table rows
                      if (trimmedLine.startsWith('|')) {
                        const cells = trimmedLine.split('|').filter(cell => cell.trim() !== '')
                        if (cells.some(cell => cell.includes('---'))) {
                          return null // Skip separator lines
                        }
                        return (
                          <div key={index} className="grid grid-cols-5 gap-2 mb-2 text-sm border-b pb-2">
                            {cells.map((cell, cellIndex) => (
                              <div key={cellIndex} className="font-medium">
                                {cell.replace(/\*\*/g, '').trim()}
                              </div>
                            ))}
                          </div>
                        )
                      }
                      
                      // Handle regular paragraphs
                      if (trimmedLine) {
                        const cleanedText = trimmedLine.replace(/\*\*/g, '')
                        return (
                          <p key={index} className="mb-2 leading-relaxed">
                            {cleanedText}
                          </p>
                        )
                      }
                      
                      return null
                    })}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-yellow-600" />
                    🤖 AI Analysis Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    AI-powered SEO analysis is not available for this data. This may be because:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                    <li>Data was uploaded via JSON file (AI analysis only available for domain input)</li>
                    <li>Claude API key is not configured</li>
                    <li>AI analysis service is temporarily unavailable</li>
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
