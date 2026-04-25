"use client"

import { useState, useMemo } from 'react'
import { Search, ArrowUpDown, ExternalLink } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface PagesTableProps {
  data: any
}

interface Page {
  page: string
  clicks: number
  impressions: number
  ctr: number
  position: number
}

type SortDirection = 'asc' | 'desc'

export function PagesTable({ data }: PagesTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: SortDirection }>({ key: 'clicks', direction: 'desc' })

  const pages = data?.top_pages || []

  const filteredAndSortedPages = useMemo(() => {
    let filtered = pages.filter((page: Page) =>
      page.page.toLowerCase().includes(searchTerm.toLowerCase())
    )

    filtered.sort((a: Page, b: Page) => {
      const aValue = a[sortConfig.key as keyof Page] || 0
      const bValue = b[sortConfig.key as keyof Page] || 0
      
      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1
      }
      return 0
    })

    return filtered
  }, [pages, searchTerm, sortConfig])

  const handleSort = (key: string) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc' as SortDirection
    }))
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num)
  }

  const formatPercentage = (num: number) => {
    return `${num.toFixed(2)}%`
  }

  const getPositionColor = (position: number) => {
    if (position <= 10) return 'text-green-600'
    if (position <= 20) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Performing Pages</CardTitle>
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search pages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort('page')}
                    className="p-0 h-auto font-semibold"
                  >
                    Page
                    <ArrowUpDown className="ml-1 h-3 w-3" />
                  </Button>
                </th>
                <th className="text-right p-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort('clicks')}
                    className="p-0 h-auto font-semibold"
                  >
                    Clicks
                    <ArrowUpDown className="ml-1 h-3 w-3" />
                  </Button>
                </th>
                <th className="text-right p-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort('impressions')}
                    className="p-0 h-auto font-semibold"
                  >
                    Impressions
                    <ArrowUpDown className="ml-1 h-3 w-3" />
                  </Button>
                </th>
                <th className="text-right p-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort('ctr')}
                    className="p-0 h-auto font-semibold"
                  >
                    CTR
                    <ArrowUpDown className="ml-1 h-3 w-3" />
                  </Button>
                </th>
                <th className="text-right p-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort('position')}
                    className="p-0 h-auto font-semibold"
                  >
                    Position
                    <ArrowUpDown className="ml-1 h-3 w-3" />
                  </Button>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedPages.map((page: Page, index: number) => (
                <tr key={index} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="p-2">
                    <div className="flex items-center space-x-2 max-w-xs truncate">
                      <a
                        href={page.page}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline truncate"
                      >
                        {page.page}
                      </a>
                      <ExternalLink className="h-3 w-3 text-gray-400 flex-shrink-0" />
                    </div>
                  </td>
                  <td className="text-right p-2">{formatNumber(page.clicks || 0)}</td>
                  <td className="text-right p-2">{formatNumber(page.impressions || 0)}</td>
                  <td className="text-right p-2">{formatPercentage(page.ctr || 0)}</td>
                  <td className={`text-right p-2 font-semibold ${getPositionColor(page.position || 0)}`}>
                    {(page.position || 0).toFixed(1)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredAndSortedPages.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No pages found matching your search.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
