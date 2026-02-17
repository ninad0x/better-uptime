"use client"

import { MonitorProps } from "@/lib/types"


export default function IncidentTimeline({ data }: MonitorProps) {
  if (!data.incidents.length) {
    return (
      <div>
        <p className="text-xs font-medium text-gray-400 uppercase tracking-widest px-8 py-4 border-b border-gray-200">
          Incident Timeline
        </p>
        <p className="text-xs font-mono text-gray-400 px-8 py-6">No incidents recorded.</p>
      </div>
    )
  }

  return (
    <div>
      <p className="text-xs font-medium text-gray-400 uppercase tracking-widest px-8 py-4 border-b border-gray-200">
        Incident Timeline
      </p>
      <div className="divide-y divide-gray-200">
        {data.incidents.map((incident) => {
          const duration = incident.endedAt
            ? Math.round(
                (new Date(incident.endedAt).getTime() - new Date(incident.startedAt).getTime()) / 60000
              )
            : null

          const isResolved = !!incident.endedAt

          return (
            <div key={incident.id} className="px-8 py-6 flex justify-between items-start">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${isResolved ? "bg-gray-400" : "bg-red-500 animate-pulse"}`} />
                  <span className="text-sm font-semibold text-gray-900 tracking-tight">
                    {incident.status}
                  </span>
                  <span className="text-xs font-mono text-gray-400">{incident.type}</span>
                </div>

                {incident.cause && (
                  <p className="text-xs text-gray-500">{incident.cause}</p>
                )}

                {duration && (
                  <p className="text-xs font-mono text-gray-400">
                    {duration} min
                    <span className="text-gray-300 ml-1">duration</span>
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1 text-right">
                <span className="text-xs font-mono text-gray-500">
                  {new Date(incident.startedAt).toLocaleString()}
                </span>
                {incident.endedAt && (
                  <span className="text-xs font-mono text-gray-400">
                    ended {new Date(incident.endedAt).toLocaleString()}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}