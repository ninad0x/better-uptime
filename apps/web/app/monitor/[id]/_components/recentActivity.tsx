"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { WebsiteDetails } from "@/lib/monitorData"

export default function RecentActivity({ ticks }: { ticks: WebsiteDetails['ticks'] }) {
  
  if (!ticks || ticks.length === 0) {
    return <div className="text-muted-foreground">No recent activity.</div>
  }

  return (
    <Card className="col-span-4 h-100">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-75 pr-4"> 
          <div className="space-y-4">
            {ticks.map((tick) => (
              <div key={tick.id} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                
                {/* Left: Status + Code */}
                <div className="flex items-center gap-3">
                  <Badge 
                    variant="outline" 
                    className={tick.status === "Up" 
                      ? "text-green-700 bg-green-50 border-green-200" 
                      : "text-red-700 bg-red-50 border-red-200"}
                  >
                    {tick.status}
                  </Badge>
                  <span className="text-sm font-medium">
                    {tick.status === "Up" ? "OK" : "Error"}
                  </span>
                </div>

                {/* Middle: Timing */}
                <div className="text-sm text-muted-foreground hidden sm:block">
                  {new Date(tick.createdAt).toLocaleString()}
                </div>

                {/* Right: Latency */}
                <div className="text-sm font-bold w-15 text-right">
                  {tick.responseTimeMs}ms
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}