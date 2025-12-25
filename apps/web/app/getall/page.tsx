export default async function GetAll() {

    const res = await fetch("http://localhost:3001/all")
    const data = await res.json()
    console.log(data.ticksData);

    return (
    <div>
        {data.ticksData?.map((e: any) => {
            return <p key={e.id} className="p-2 text-sm">{JSON.stringify(e)}</p>
        })}
    </div>
    )
}
