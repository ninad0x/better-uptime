'use client'

interface MonitorHeaderProps {
  name: string
  url: string
  currentStatus: number
  lastChecked: Date | null
}

export function MonitorHeader({ name, url, currentStatus, lastChecked }: MonitorHeaderProps) {
  const isUp = currentStatus < 400
  
  return (
    <div className="flex items-start justify-between">
      <div>
        <h1 className="text-4xl font-bold mb-2">{name}</h1>
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-gray-500 hover:text-gray-700"
        >
          {url}
        </a>
      </div>
      
      <div className="flex flex-col items-end gap-2">
        <div className={`px-4 py-2 rounded-full font-semibold text-sm ${
          isUp 
            ? 'bg-green-100 text-green-700' 
            : 'bg-red-100 text-red-700'
        }`}>
          {isUp ? '✓ Operational' : '✗ Down'}
        </div>
        
        {lastChecked && (
          <p className="text-sm text-gray-500">
            Last checked: {new Date(lastChecked).toLocaleString()}
          </p>
        )}
      </div>
    </div>
  )
}