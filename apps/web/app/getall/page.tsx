export default async function GetAll() {

    const res = await fetch("http://localhost:3001/all")
    const data = await res.json()
    console.log(data.ticksData);

    return (
    <div>
        {data.ticksData?.map((e: any) => (
            <div key={e.id} className="p-2">
                <h3>{e.url}{" - "}{e.status}{" - "}{e.createdAt}</h3>
            </div>
        ))}
    </div>
    )
}
