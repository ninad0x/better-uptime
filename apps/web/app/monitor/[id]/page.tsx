import { getMonitorData } from "@/lib/getMonitorData"
import { redirect } from "next/navigation"
import { MonitorHeader } from "./_components/monitorHeader"
import { StatsCards } from "./_components/statsCards"
import { UptimeChart } from "./_components/uptimeChart"
import { ResponseTimeChart } from "./_components/responseTimeChart"
import { IncidentsList } from "./_components/incidentList"


export default async function MonitorPage({params}: { params: Promise<{ id: string}> }) {
    const websiteId = (await params).id
    const data = await getMonitorData(websiteId)
    
    if (!data) {
        redirect('/dashboard')
    }

    return (
        <div className="flex flex-col mx-auto p-4 max-w-5xl gap-8">
            <MonitorHeader 
                name={data.website.name}
                url={data.website.url}
                currentStatus={data.website.currentStatus}
                lastChecked={data.website.lastChecked}
            />
            
            <StatsCards 
                uptime24h={data.uptime.h24}
                uptime7d={data.uptime.d7}
                uptime30d={data.uptime.d30}
                avgResponseTime={data.metrics[0]?.avgResponseTimeMs || null}
                incidentCount={data.incidents.length}
            />
            
            <UptimeChart data={data.metrics} />
            
            <ResponseTimeChart data={data.recentTicks} />
            
            <IncidentsList incidents={data.incidents} />
        </div>
    )
}