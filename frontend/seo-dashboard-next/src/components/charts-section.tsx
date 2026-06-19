"use client"

import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface ChartsSectionProps {
  data: any
}

interface CountryEntry {
  country: string
  clicks: number
}

interface DeviceEntry {
  device: string
  clicks: number
}

export function ChartsSection({ data }: ChartsSectionProps) {
  const topQueries = data?.top_queries?.slice(0, 10) || []
  const countrySplit = data?.country_split?.slice(0, 8) || []
  const deviceSplit = data?.device_split || []

  // Generate sample trend data (in real implementation, this would come from the API)
  const trendData = Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
    clicks: Math.floor(Math.random() * 20) + 5,
    impressions: Math.floor(Math.random() * 200) + 100
  }))

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF7C7C']

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Traffic Trends */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Traffic Trends (Last 30 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="clicks" stroke="#8884d8" name="Clicks" />
              <Line yAxisId="right" type="monotone" dataKey="impressions" stroke="#82ca9d" name="Impressions" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Queries Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Queries</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topQueries}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="query" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="clicks" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Country Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Traffic by Country</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={countrySplit}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ country, clicks }: CountryEntry) => `${country.toUpperCase()}: ${clicks}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="clicks"
              >
                {countrySplit.map((entry: CountryEntry, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Device Split */}
      <Card>
        <CardHeader>
          <CardTitle>Device Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={deviceSplit}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ device, clicks }: DeviceEntry) => `${device}: ${clicks}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="clicks"
              >
                {deviceSplit.map((entry: DeviceEntry, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* CTR Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>CTR Analysis by Position</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topQueries}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="query" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="ctr" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
