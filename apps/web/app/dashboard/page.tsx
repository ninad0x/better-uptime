import { getDashboardData } from "@/lib/getDashboardData";
import { auth } from "@repo/auth/auth"
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function Dashboard() {

  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    redirect("/sign-in")
  }

  const data = await getDashboardData(session.user.id)

  return (
    <div className="max-w-5xl mx-auto p-4">

    <nav className="sticky top-0 z-50 flex h-16 items-center px-6 shadow mb-2 rounded-lg">
      <div className="font-bold text-lg">Monitor</div>
      <div className="ml-auto flex gap-4 text-sm text-neutral-400">
        <a href="#" className="hover:text-zinc-800">Dashboard</a>
        <a href="#" className="hover:text-zinc-800">Settings</a>
      </div>
    </nav>

    <div className="flex p-3 gap-8">{data.map((e) => (
      <div key={e.id} className="gap-2">
        <p>{e.name}</p>
        <p>{e.url}</p>
        {e.ticks.map((t) => (
          <p key={t.createdAt.toString()}>{t.status} --- {t.createdAt.toLocaleTimeString()}</p>
        ))}
        {/* <p>Last Checked {new Date(e.ticks).toLocaleTimeString()}</p> */}
      </div>
    ))}</div>

    {/* <DataTable columns={columns} data={data}/> */}
    </div>

  )
}
