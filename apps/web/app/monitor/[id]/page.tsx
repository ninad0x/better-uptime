import { getWebsiteDetails } from "@/lib/monitorData"


export default async function MonitorPage({params} : 
    { params: Promise<{ id: string}> }) {

    const websiteId = (await params).id

    const data = await getWebsiteDetails(websiteId)

    if (!data) return <p>No data avaliable</p>

    return <div className="p-4 h-screen bg-zinc-100">
        <h2>{data.name}</h2>
        <p>{data.url}</p>
        <p>{data.isActive ? "yes" : "no"}</p>
        <p>{data.lastChecked?.toLocaleTimeString()}</p>

        {data.ticks.map((e) => {
            return <div key={e.id}>
                
            </div>
        })}
    </div>
}