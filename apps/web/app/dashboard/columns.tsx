"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge"; 

// 1. Define the Data Shape
export type WebsiteRow = {
  id: string;
  url: string;
  currentStatus: string;
  uptime: string;
  // sparkline: number[];
  avgResponseTime: string
};

// 2. The Sparkline Graph Component
// const Sparkline = ({ data }: { data: number[] }) => {
//   if (!data || data.length < 2) return <span className="text-xs text-muted-foreground">No Data</span>;

//   const height = 30;
//   const width = 100;
//   const max = Math.max(...data, 1);
//   const min = Math.min(...data);

//   const points = data.map((val, i) => {
//     const x = (i / (data.length - 1)) * width;
//     const y = height - ((val - min) / (max - min || 1)) * height;
//     return `${x},${y}`;
//   }).join(" ");

//   return (
//     <svg width={width} height={height} className="overflow-visible">
//       <polyline points={points} fill="none" stroke="currentColor" strokeWidth="2" className="text-primary" />
//     </svg>
//   );
// };

// 3. The Columns Definition
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