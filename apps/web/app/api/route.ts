export async function GET() {
  console.log("HEALTH CHECK");
  return Response.json({ message: "HEALTH CHECK" })
}
