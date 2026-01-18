import { WebsiteDetails } from "@/lib/monitorData";
import { Edit, Pause, Trash } from "lucide-react"


export default function MonitorHeader({ site } : {site: WebsiteDetails}) {
  return (
    <div className="flex justify-between rounded p-2 bg-white mb-2 py-4 px-4">
      <div className="flex flex-col gap">
        <span className="text-zinc-900 text-lg font-bold">{site.name}</span>
        <span className="text-zinc-900/50 text-sm font-bold">{site.url}</span>
      </div>

      <div className="flex gap-3">
        <Pause />
        <Edit />
        <Trash />
      </div>
    </div>
  )
}