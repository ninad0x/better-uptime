'use client'

interface StatsCardsProps {
  uptime24h: number
  uptime7d: number
  uptime30d: number
  avgResponseTime: number | null
  incidentCount: number
}

export function StatsCards({ uptime24h, uptime7d, uptime30d, avgResponseTime, incidentCount }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div className="bg-white p-6 rounded-lg shadow">
        <p className="text-sm text-gray-500 mb-2">Uptime (24h)</p>
        <p className="text-3xl font-bold">{uptime24h.toFixed(2)}%</p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <p className="text-sm text-gray-500 mb-2">Uptime (7d)</p>
        <p className="text-3xl font-bold">{uptime7d.toFixed(2)}%</p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <p className="text-sm text-gray-500 mb-2">Uptime (30d)</p>
        <p className="text-3xl font-bold">{uptime30d.toFixed(2)}%</p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <p className="text-sm text-gray-500 mb-2">Avg Response Time</p>
        <p className="text-3xl font-bold">{avgResponseTime ? `${avgResponseTime}ms` : '—'}</p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <p className="text-sm text-gray-500 mb-2">Total Incidents</p>
        <p className="text-3xl font-bold">{incidentCount}</p>
      </div>
    </div>
  )
}