"use client"

import { TrendingUp, TrendingDown, Eye, MousePointer, Target } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface OverviewCardsProps {
  data: any
}

export function OverviewCards({ data }: OverviewCardsProps) {
  const summary = data?.summary || {}
  const period = data?.period || {}

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num)
  }

  const formatPercentage = (num: number) => {
    return `${num.toFixed(2)}%`
  }

  const cards = [
    {
      title: "Total Clicks",
      value: formatNumber(summary.clicks || 0),
      icon: MousePointer,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950",
      trend: "up"
    },
    {
      title: "Total Impressions",
      value: formatNumber(summary.impressions || 0),
      icon: Eye,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-950",
      trend: "up"
    },
    {
      title: "CTR",
      value: formatPercentage(summary.ctr || 0),
      icon: Target,
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-950",
      trend: summary.ctr > 2 ? "up" : "down"
    },
    {
      title: "Avg Position",
      value: (summary.position || 0).toFixed(1),
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-950",
      trend: summary.position < 20 ? "up" : "down"
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-md ${card.bgColor}`}>
                <Icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-1">
                {card.trend === "up" ? (
                  <TrendingUp className="h-3 w-3 text-green-500" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-500" />
                )}
                <span>
                  {period.start && period.end 
                    ? `${period.start} to ${period.end}`
                    : "Last 90 days"
                  }
                </span>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
