export default async function GetAll() {

    const res = await fetch(`${process.env.BACKEND_URL}/all`)
    const data = await res.json()
    return (
    <div>
        {data.ticksData?.map((e: any) => (
            <div key={e.id} className="p-1">
                <h3>{e.url}{" - "}{e.status}{" - "}{e.createdAt}</h3>
            </div>
        ))}
    </div>
    )
}