import { serverApi } from '@/lib/api';
import React from 'react'

export default async function Dashboard() {

    const api = await serverApi()
    const { data } = await api.get("/api/profile")

    console.log(data.user.name);

    return (
    <div className="flex flex-col items-center h-screen mx-auto mt-10">
        Hello {JSON.stringify(data.user.name)}
    </div>
    )
}