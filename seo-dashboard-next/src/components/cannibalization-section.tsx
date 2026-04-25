"use client"

import { AlertTriangle, ExternalLink, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface CannibalizationSectionProps {
  data: any
}

export function CannibalizationSection({ data }: CannibalizationSectionProps) {
  const cannibalization = data?.cannibalization || []

  if (cannibalization.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Keyword Cannibalization</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-green-600">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-green-500" />
            <h3 className="text-lg font-semibold mb-2">No Cannibalization Issues Detected</h3>
            <p className="text-gray-600">
              Your pages are well-optimized with no competing keywords found.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <AlertTriangle className="h-5 w-5 text-orange-500" />
          Keyword Cannibalization Issues
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {cannibalization.map((issue, index) => (
            <div key={index} className="border border-orange-200 rounded-lg p-4 bg-orange-50 dark:bg-orange-950">
              <div className="mb-4">
                <h4 className="font-semibold text-lg text-orange-800 dark:text-orange-200 mb-2">
                  "{issue.query}"
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {issue.total_impressions} impressions across {issue.competing_pages?.length || 0} competing pages
                </p>
                <div className="flex items-center space-x-2 text-sm">
                  <span className="px-2 py-1 bg-orange-200 text-orange-800 rounded-full text-xs font-medium">
                    {issue.recommended_action}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <span>Winner Page:</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
                <div className="bg-white dark:bg-gray-800 rounded p-3 border">
                  <div className="flex items-center justify-between">
                    <a
                      href={issue.winner_page}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline truncate flex-1 mr-2"
                    >
                      {issue.winner_page}
                    </a>
                    <ExternalLink className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Position: {issue.winner_reason?.includes('position') ? 
                      issue.winner_reason.match(/position (\d+)/)?.[1] || 'N/A' : 'N/A'}
                  </div>
                </div>

                {issue.competing_pages && issue.competing_pages.length > 0 && (
                  <div>
                    <div className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <span>Competing Pages:</span>
                    </div>
                    <div className="space-y-2">
                      {issue.competing_pages.slice(0, 3).map((page, pageIndex) => (
                        <div key={pageIndex} className="bg-white dark:bg-gray-800 rounded p-2 border text-sm">
                          <div className="flex items-center justify-between">
                            <a
                              href={page.page}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 underline truncate flex-1 mr-2"
                            >
                              {page.page}
                            </a>
                            <ExternalLink className="h-3 w-3 text-gray-400 flex-shrink-0" />
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {page.clicks} clicks | {page.impressions} impressions | Position {page.position?.toFixed(1)}
                          </div>
                        </div>
                      ))}
                      {issue.competing_pages.length > 3 && (
                        <div className="text-xs text-gray-500 text-center py-2">
                          +{issue.competing_pages.length - 3} more competing pages
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-orange-200">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <strong>Recommendation:</strong> {issue.recommended_action}. Consider consolidating these pages or adding canonical tags to prevent keyword cannibalization.
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
            How to Fix Cannibalization
          </h4>
          <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
            <li>301 redirect weaker pages to the strongest performing page</li>
            <li>Add canonical tags pointing to the primary page</li>
            <li>Merge similar content into a comprehensive page</li>
            <li>Differentiate content to target different search intents</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
