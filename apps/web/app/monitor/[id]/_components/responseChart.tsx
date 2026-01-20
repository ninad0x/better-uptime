"use client"

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { WebsiteDetails } from '@/lib/monitorData';

// Define the shape of your data prop
interface Metric {
  createdAt: Date;
  avgResponseTimeMs: number;
}

export default function ResponseChart({ data }: { data: WebsiteDetails }) {
  
  if (!data || data.metric.length === 0) {
    return (
      <Card className="col-span-4 h-75 flex items-center justify-center text-muted-foreground">
        No chart data available yet.
      </Card>
    )
  }

  const chartData = data.metric.map(item => ({
    time: new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    latency: item.avgResponseTimeMs
  }));

  return (
    <Card className="col-span-4 mb-8">
      <CardHeader>
        <CardTitle>Response Time (24h)</CardTitle>
      </CardHeader>
      <CardContent className="pl-0"> 
        <div className="h-75 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="6  7" vertical={false} stroke="#E5E7EB" />
              <XAxis 
                dataKey="time" 
                tick={{ fontSize: 12, fill: '#6B7280' }} 
                tickLine={false}
                axisLine={false}
                minTickGap={30} 
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#6B7280' }} 
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}ms`}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Line 
                type="monotone" 
                dataKey="latency" 
                stroke="#2563eb"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}