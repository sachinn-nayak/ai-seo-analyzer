"use client"

import { useState, useMemo } from 'react'
import { Search, ArrowUpDown, TrendingUp, TrendingDown } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface QueriesTableProps {
  data: any
}

export function QueriesTable({ data }: QueriesTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortConfig, setSortConfig] = useState({ key: 'clicks', direction: 'desc' as const })

  const queries = data?.top_queries || []

  const filteredAndSortedQueries = useMemo(() => {
    let filtered = queries.filter(query =>
      query.query.toLowerCase().includes(searchTerm.toLowerCase())
    )

    filtered.sort((a, b) => {
      const aValue = a[sortConfig.key] || 0
      const bValue = b[sortConfig.key] || 0
      
      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1
      }
      return 0
    })

    return filtered
  }, [queries, searchTerm, sortConfig])

  const handleSort = (key: string) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
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

  const getCtrColor = (ctr: number) => {
    if (ctr >= 5) return 'text-green-600'
    if (ctr >= 2) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Performing Queries</CardTitle>
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search queries..."
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
                    onClick={() => handleSort('query')}
                    className="p-0 h-auto font-semibold"
                  >
                    Query
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
                <th className="text-center p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedQueries.map((query, index) => (
                <tr key={index} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="p-2 font-medium">{query.query}</td>
                  <td className="text-right p-2">{formatNumber(query.clicks || 0)}</td>
                  <td className="text-right p-2">{formatNumber(query.impressions || 0)}</td>
                  <td className={`text-right p-2 font-semibold ${getCtrColor(query.ctr || 0)}`}>
                    {formatPercentage(query.ctr || 0)}
                  </td>
                  <td className={`text-right p-2 font-semibold ${getPositionColor(query.position || 0)}`}>
                    {(query.position || 0).toFixed(1)}
                  </td>
                  <td className="text-center p-2">
                    <div className="flex items-center justify-center space-x-1">
                      {query.ctr >= 5 && (
                        <div className="flex items-center text-green-600" title="High CTR">
                          <TrendingUp className="h-4 w-4" />
                        </div>
                      )}
                      {query.position <= 10 && (
                        <div className="flex items-center text-blue-600" title="Good Position">
                          <TrendingUp className="h-4 w-4" />
                        </div>
                      )}
                      {query.position > 30 && (
                        <div className="flex items-center text-red-600" title="Needs Optimization">
                          <TrendingDown className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredAndSortedQueries.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No queries found matching your search.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
