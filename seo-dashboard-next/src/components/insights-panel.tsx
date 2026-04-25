"use client"

import { useState } from 'react'
import { Lightbulb, TrendingUp, TrendingDown, AlertTriangle, Target, MousePointer, Eye, ArrowRight, Sparkles } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface InsightsPanelProps {
  data: any
}

interface Query {
  query: string
  ctr: number
  impressions: number
  position: number
  clicks?: number
}

export function InsightsPanel({ data }: InsightsPanelProps) {
  const [isGeneratingAI, setIsGeneratingAI] = useState(false)
  
  const summary = data?.summary || {}
  const topQueries = data?.top_queries || []
  const topPages = data?.top_pages || []
  const cannibalization = data?.cannibalization || []

  // Generate insights automatically
  const insights = generateInsights(data)

  function generateInsights(data: any) {
    const insights = []
    const summary = data?.summary || {}
    const topQueries = data?.top_queries || []
    const topPages = data?.top_pages || []
    const cannibalization = data?.cannibalization || []

    // Low CTR insights
    const lowCtrQueries = topQueries.filter((q: Query) => q.ctr < 2 && q.impressions > 100)
    if (lowCtrQueries.length > 0) {
      insights.push({
        type: 'warning',
        title: 'Low CTR Opportunities',
        description: `${lowCtrQueries.length} queries have low CTR (<2%) with good impressions. Consider improving titles and meta descriptions.`,
        icon: AlertTriangle,
        action: 'Optimize Titles',
        queries: lowCtrQueries.slice(0, 3)
      })
    }

    // High position insights
    const highPositionQueries = topQueries.filter((q: Query) => q.position > 30)
    if (highPositionQueries.length > 0) {
      insights.push({
        type: 'error',
        title: 'Position Optimization Needed',
        description: `${highPositionQueries.length} queries are ranking beyond position 30. Focus on improving content quality and building authority.`,
        icon: TrendingDown,
        action: 'Improve Content',
        queries: highPositionQueries.slice(0, 3)
      })
    }

    // Good performance insights
    const topPerformers = topQueries.filter((q: Query) => q.position <= 10 && q.ctr >= 5)
    if (topPerformers.length > 0) {
      insights.push({
        type: 'success',
        title: 'Top Performing Queries',
        description: `${topPerformers.length} queries are performing excellently (top 10 position with good CTR). Consider creating more content around these topics.`,
        icon: TrendingUp,
        action: 'Expand Content',
        queries: topPerformers.slice(0, 3)
      })
    }

    // Cannibalization insights
    if (cannibalization.length > 0) {
      insights.push({
        type: 'warning',
        title: 'Keyword Cannibalization Detected',
        description: `${cannibalization.length} queries have multiple competing pages. This is diluting your ranking authority.`,
        icon: AlertTriangle,
        action: 'Consolidate Pages',
        queries: cannibalization.slice(0, 3)
      })
    }

    // Overall performance insights
    if (summary.ctr > 3) {
      insights.push({
        type: 'success',
        title: 'Strong Overall CTR',
        description: `Your overall CTR of ${summary.ctr.toFixed(2)}% is above the industry average. Keep up the good work!`,
        icon: Target,
        action: 'Maintain Strategy',
        queries: []
      })
    }

    if (summary.position < 20) {
      insights.push({
        type: 'success',
        title: 'Good Average Position',
        description: `Your average position of ${summary.position.toFixed(1)} is solid. Focus on moving more queries to the top 10.`,
        icon: TrendingUp,
        action: 'Optimize Top Pages',
        queries: []
      })
    }

    return insights
  }

  const generateAIInsights = async () => {
    setIsGeneratingAI(true)
    // Simulate AI API call
    setTimeout(() => {
      setIsGeneratingAI(false)
    }, 2000)
  }

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'success': return 'text-green-600 bg-green-50 border-green-200'
      case 'warning': return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'error': return 'text-red-600 bg-red-50 border-red-200'
      default: return 'text-blue-600 bg-blue-50 border-blue-200'
    }
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num)
  }

  const formatPercentage = (num: number) => {
    return `${num.toFixed(2)}%`
  }

  return (
    <div className="space-y-6">
      {/* AI Insights Button */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5" />
            AI-Powered Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            onClick={generateAIInsights}
            disabled={isGeneratingAI}
            className="w-full"
          >
            {isGeneratingAI ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Generating AI Insights...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate AI Recommendations
              </>
            )}
          </Button>
          <p className="text-sm text-gray-600 mt-2">
            Get personalized SEO recommendations powered by AI analysis of your data.
          </p>
        </CardContent>
      </Card>

      {/* Automatic Insights */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center space-x-2">
          <Lightbulb className="h-5 w-5" />
          Automatic Insights
        </h3>
        
        {insights.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Lightbulb className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2">No Specific Insights Available</h3>
              <p className="text-gray-600">
                Your data looks good! Continue monitoring for optimization opportunities.
              </p>
            </CardContent>
          </Card>
        ) : (
          insights.map((insight, index) => {
            const Icon = insight.icon
            return (
              <Card key={index} className={`border ${getInsightColor(insight.type)}`}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Icon className="h-5 w-5" />
                    {insight.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4">{insight.description}</p>
                  
                  {insight.queries && insight.queries.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-medium text-sm mb-2">Affected Queries:</h4>
                      <div className="space-y-2">
                        {insight.queries.map((query: Query, queryIndex: number) => (
                          <div key={queryIndex} className="flex items-center justify-between text-xs bg-white dark:bg-gray-800 rounded p-2">
                            <span className="font-medium truncate flex-1">{query.query || query.query}</span>
                            <div className="flex items-center space-x-2 text-gray-500">
                              <span>{formatNumber(query.clicks || 0)} clicks</span>
                              <span>{formatPercentage(query.ctr || 0)}</span>
                              <span>pos {(query.position || 0).toFixed(1)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      Priority: {insight.type === 'error' ? 'High' : insight.type === 'warning' ? 'Medium' : 'Low'}
                    </span>
                    <Button size="sm" variant="outline">
                      {insight.action}
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>

      {/* Key Metrics Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5" />
            Performance Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <MousePointer className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold text-blue-600">{formatNumber(summary.clicks || 0)}</div>
              <div className="text-sm text-gray-600">Total Clicks</div>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
              <Eye className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <div className="text-2xl font-bold text-green-600">{formatNumber(summary.impressions || 0)}</div>
              <div className="text-sm text-gray-600">Total Impressions</div>
            </div>
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
              <Target className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <div className="text-2xl font-bold text-purple-600">{(summary.position || 0).toFixed(1)}</div>
              <div className="text-sm text-gray-600">Avg Position</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
