"use client"

import { MonitorProps } from "@/lib/types"
import React from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts"

export default function RegionalLatency({ data }: MonitorProps) {
  if (!data.regionTicks.length) return null

  const regions = [...new Set(data.regionTicks.map(t => t.region?.name).filter(Boolean))]
  const colors = ["#111827", "#6b7280", "#d1d5db"]

  return (
    <div>
      {/* <p className="text-xs font-medium text-gray-400 uppercase tracking-widest px-8 py-4 border-b border-gray-200">
        Regional Latency
      </p> */}
      <div className="px-8 py-6 h-72 border-b border-gray-200">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis
              dataKey="time"
              type="number"
              domain={["auto", "auto"]}
              tick={{ fontSize: 12, fill: "#9ca3af", fontFamily: "monospace" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(time) =>
                new Date(time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
              }
            />
            <YAxis
              unit="ms"
              tick={{ fontSize: 12, fill: "#9ca3af", fontFamily: "monospace" }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                border: "1px solid #e5e7eb",
                borderRadius: "6px",
                fontSize: "12px",
                color: "#111827"
              }}
              labelFormatter={(time) => new Date(Number(time)).toLocaleTimeString()}
            />
            {/* <Legend itemSorter={"dataKey"} /> */}
            {regions.map((region, index) => {
              const regionData = data.regionTicks
                .filter(t => t.region?.name === region)
                .map(t => ({ time: new Date(t.createdAt).getTime(), latency: t.responseTimeMs }))
              return (
                <Line
                  key={region}
                  data={regionData}
                  dataKey="latency"
                  name={region}
                  type="monotone"
                  dot={false}
                  stroke={colors[index % colors.length]}
                  strokeWidth={1.5}
                />
              )
            })}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}