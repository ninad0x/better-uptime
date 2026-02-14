'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface UptimeChartProps {
  data: Array<{
    windowStart: Date
    uptimePercent: number
  }>
}

export function UptimeChart({ data }: UptimeChartProps) {
  const chartData = data.map(d => ({
    time: new Date(d.windowStart).toLocaleDateString(),
    uptime: d.uptimePercent
  }))
  
  return (
    <div className="bg-white p-6 rounded-lg shadow mb-8">
      <h3 className="text-lg font-semibold mb-4">Uptime %</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis domain={[0, 100]} />
          <Tooltip />
          <Line type="monotone" dataKey="uptime" stroke="#10b981" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}