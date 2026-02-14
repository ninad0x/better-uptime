'use client'

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface ResponseTimeChartProps {
  data: Array<{
    createdAt: Date
    responseTimeMs: number
  }>
}

export function ResponseTimeChart({ data }: ResponseTimeChartProps) {
  const chartData = data.map(d => ({
    time: new Date(d.createdAt).toLocaleTimeString(),
    latency: d.responseTimeMs
  })).reverse() // Show oldest to newest
  
  return (
    <div className="bg-white p-6 rounded-lg shadow mb-8">
      <h3 className="text-lg font-semibold mb-4">Response Time</h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Area type="monotone" dataKey="latency" stroke="#3b82f6" fill="#93c5fd" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}