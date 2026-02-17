import { getMonitorData } from "@/lib/getMonitorData"
import { redirect } from "next/navigation"
import MonitorHeader from "./_components/monitorHeader"
import RegionCards from "./_components/regionCards"
import RegionalLatency from "./_components/regionLatencyGraph"
import UptimeOverview from "./_components/uptimeOverview"
import IncidentTimeline from "./_components/incidentList"
import LatencyTrend from "./_components/latencyTrend"



export default async function MonitorPage({params}: { params: Promise<{ id: string}> }) {
    const websiteId = (await params).id
    const data = await getMonitorData(websiteId)
    
    if (!data) {
        redirect('/dashboard')
    }

    return (
        <div className="bg-gray-50/50">
            <div className="flex flex-col mx-auto h-full max-w-5xl bg-gray-50 border">
                <MonitorHeader data={data} />
                <RegionCards data={data} />
                <RegionalLatency data={data} />
                <LatencyTrend data={data} />
                <UptimeOverview data={data}/>
                <IncidentTimeline data={data}/>
            </div>
        </div>
    )
}