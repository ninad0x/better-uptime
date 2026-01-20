import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Clock, ArrowUp, AlertTriangle } from "lucide-react"
import { WebsiteDetails } from "@/lib/monitorData"

export default function MonitorStats({ site }: { site: WebsiteDetails }) {
  const metrics = site.metric || []
  
  const avgLatency = metrics.length > 0 
    ? Math.round(metrics.reduce((acc, curr) => acc + (curr.avgResponseTimeMs || 0), 0) / metrics.length) 
    : 0

  const totalUptimeSum = metrics.reduce((acc, curr) => acc + curr.uptimePercent, 0)
  const uptime = metrics.length > 0 ? (totalUptimeSum / metrics.length).toFixed(1) : "0.0"
  
  const lastCheck = site.lastChecked 
    ? new Date(site.lastChecked).toLocaleTimeString([], { hour: '2-digit', minute:'2-digit' })
    : "Never"

  const statsList = [
    {
      label: "Uptime (24h)",
      value: `${uptime}%`,
      description: "Target: 99.9%",
      icon: ArrowUp,
    },
    {
      label: "Avg Latency",
      value: `${avgLatency}ms`,
      description: "Last 24 hours",
      icon: Activity,
    },
    {
      label: "Last Checked",
      value: lastCheck,
      description: "Local Time",
      icon: Clock,
    },
    {
      label: "Incidents",
      value: site.incidents.length,
      description: "Failures in 24h",
      icon: AlertTriangle,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
      {statsList.map((stat, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-sm text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}