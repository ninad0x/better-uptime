import { CardData } from '@/lib/types'
import Link from 'next/link'
import React from 'react'


export default function WebsiteCard({ site }: {site: CardData}) {
  return (
    <Link
        key={site.id} 
        href={`/monitor/${site.id}`}
        className="px-8 py-6 hover:bg-gray-50 transition flex flex-col gap-4"
        >
        <div className="flex items-center justify-between">
            <span className="font-semibold text-gray-900 tracking-tight">{site.name}</span>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md ${
            site.currentStatus < 400 
                ? "bg-emerald-50 text-emerald-700" 
                : "bg-red-50 text-red-600"
            }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${
                site.currentStatus < 400 ? "bg-emerald-500 animate-pulse" : "bg-red-500"
            }`} />
            {site.currentStatus < 400 ? 'Up' : 'Down'}
            </span>
        </div>
        
        <p className="text-sm font-mono text-gray-400">{site.url}</p>
        
        <div className="flex gap-6 text-sm">
            <div className="flex flex-col gap-0.5">
            <span className="text-xs text-gray-400">24h Uptime</span>
            <span className="font-semibold text-gray-900">{site.uptime24h.toFixed(2)}%</span>
            </div>
            {site.avgResponseTime && (
            <div className="flex flex-col gap-0.5">
                <span className="text-xs text-gray-400">Avg Latency</span>
                <span className="font-semibold text-gray-900">{site.avgResponseTime}ms</span>
            </div>
            )}
        </div>
        </Link>
  )
}
