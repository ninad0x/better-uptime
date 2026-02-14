'use client'

interface Incident {
  id: string
  type: string
  status: string
  startedAt: Date
  endedAt: Date | null
  cause: string | null
}

interface IncidentsListProps {
  incidents: Incident[]
}

export function IncidentsList({ incidents }: IncidentsListProps) {
  const calculateDuration = (start: Date, end: Date | null) => {
    if (!end) return 'Ongoing'
    const diff = new Date(end).getTime() - new Date(start).getTime()
    const minutes = Math.floor(diff / 60000)
    return `${minutes} min`
  }
  
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Incident History</h3>
      
      {incidents.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No incidents recorded</p>
      ) : (
        <div className="space-y-4">
          {incidents.map(incident => (
            <div key={incident.id} className="border-b pb-4 last:border-b-0">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    incident.status === 'Resolved' 
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {incident.type}
                  </span>
                  <span className="ml-2 text-sm text-gray-500">
                    {new Date(incident.startedAt).toLocaleString()}
                  </span>
                </div>
                <span className="text-sm font-medium">
                  {calculateDuration(incident.startedAt, incident.endedAt)}
                </span>
              </div>
              {incident.cause && (
                <p className="text-sm text-gray-600">{incident.cause}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}