"use client"

import { WebsiteDetails } from "@/lib/monitorData";
import { ArrowLeft, Pause, Pencil, Trash2, Play, Link } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function MonitorHeader({ site } : { site: WebsiteDetails | null }) {
  const router = useRouter()

  if (!site) return null;

  return (
    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 py-4">
      
      <div className="flex items-center gap-5">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => router.push("/dashboard")}
          className="size-8 shrink-0 rounded-lg"
          title="Back to Dashboard"
        >
          <ArrowLeft/>
        </Button>

        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
              {site.name}
            </h1>
            
            <Badge variant="default" className={cn(
                "px-2.5 py-0.5 text-sm font-medium border", 
                site.currentStatus === "Up"
                  ? "border-green-200 bg-green-50 text-green-700" 
                  : "border-red-200 bg-red-50 text-red-700"
              )}>
                <div className={cn("mr-2 h-2 w-2 rounded-full", 
                  site.currentStatus === "Up" ? "bg-green-500" : "bg-red-500"
                )} />
                {site.currentStatus === "Up" ? "Operational" : "Down"}
            </Badge>
          </div>
          
          <a href={site.url} target="_blank" rel="noreferrer"className="ml-0.5 block flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-800 hover:underline transition-colors"
          >
            {site.url}<Link size={15}/>
          </a>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="h-9 gap-2">
           {site.isActive ? <Pause className="size-4" /> : <Play className="size-4" />}
           <span className="hidden sm:inline">{site.isActive ? "Pause" : "Resume"}</span>
        </Button>
        
        <Button variant="outline" size="sm" className="h-9 gap-2">
           <Pencil className="size-4" />
           <span className="hidden sm:inline">Edit</span>
        </Button>
        
        <Button variant="destructive" size="sm" className="h-9 gap-2">
           <Trash2 className="size-4" />
           <span className="hidden sm:inline">Delete</span>
        </Button>
      </div>

    </div>
  )
}