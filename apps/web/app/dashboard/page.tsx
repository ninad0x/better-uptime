import { getDashboardData } from "@/lib/getDashboardData";
import { DataTable } from "./data-table";
import { columns } from "./columns";

export const dynamic = "force-dynamic";

export default async function Dashboard() {

  const data = await getDashboardData();

  return (
    <div className="max-w-5xl mx-auto p-4">

    <nav className="sticky top-0 z-50 flex h-16 items-center px-6 shadow mb-2 rounded-lg">
      <div className="font-bold text-lg">Monitor</div>
      <div className="ml-auto flex gap-4 text-sm text-neutral-400">
        <a href="#" className="hover:text-zinc-800">Dashboard</a>
        <a href="#" className="hover:text-zinc-800">Settings</a>
      </div>
    </nav>

    <DataTable columns={columns} data={data}/>
    </div>

  )
}
