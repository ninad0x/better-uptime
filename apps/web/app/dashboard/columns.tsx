"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge"; 

export type WebsiteRow = {
  id: string;
  url: string;
  currentStatus: string;
  uptime: string;
  avgResponseTime: string
};


export const columns: ColumnDef<WebsiteRow>[] = [
  {
    accessorKey: "currentStatus",
    header: "Status",
    cell: ({ row }) => {
      const isUp = row.original.currentStatus === "Up";
      return (
        <Badge variant={isUp ? "default" : "destructive"} className={isUp ? "bg-green-500/10 text-green-700 hover:bg-green-500/20 shadow-none border-green-200" : ""}>
          {isUp ? "Operational" : "Down"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "url",
    header: "Monitor Name",
    cell: ({ row }) => <span className="font-medium">{row.original.url}</span>,
  },
  {
    accessorKey: "avgResponseTime",
    header: "Avg. Response Time",
    cell: ({ row }) => <span>{row.original.avgResponseTime} ms</span>
  },
  {
    accessorKey: "uptime",
    header: "Uptime",
    cell: ({ row }) => <span>{row.original.uptime}%</span>,
  },
];