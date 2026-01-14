

export default async function MonitorPgage({params}: {params: Promise<{ id: string}>}) {

    const websiteId = (await params).id

    return <div>
        <h1>{websiteId}</h1>
    </div>
}