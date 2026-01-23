import { prisma } from "@repo/db/client";


async function main() {
  console.log("🔍 Starting Incident Seeding...");

  // 1. Fetch all websites with their metrics (sorted Oldest -> Newest)
  const websites = await prisma.website.findMany({
    include: {
      // MAKE SURE this matches your schema relation name (metric vs metrics)
      metric: {
        orderBy: { createdAt: "asc" }, 
      },
    },
  });

  for (const site of websites) {
    const metrics = site.metric; // Raw ticks
    if (!metrics || metrics.length === 0) continue;

    const incidentsToCreate: any[] = [];
    let activeIncident: any = null;

    console.log(`Processing ${site.url}: ${metrics.length} ticks found.`);

    // 2. The Grouping Logic
    for (const tick of metrics) {
      // DEFINITION OF DOWN: Adjust this check to match your data
      // e.g. status != 200, or httpCode >= 400
      const val = String(tick.finalStatus); 
      const isDown = val !== "200" && val !== "OK" && val !== "201";

      if (isDown) {
        if (!activeIncident) {
          // START of a new incident
          activeIncident = {
            id: undefined, // Let Prisma generate CUID
            websiteId: site.id,
            startedAt: tick.createdAt,
            status: "Ongoing", // Temporary status
            cause: `Error: ${val}`,
            type: "Global", // Defaulting to Global for simplicity
          };
        }
        // If already in an incident, do nothing (just let it continue)
      } else {
        if (activeIncident) {
          // END of an incident (we found a success tick)
          activeIncident.endedAt = tick.createdAt;
          activeIncident.status = "Resolved";
          
          incidentsToCreate.push(activeIncident);
          activeIncident = null; // Reset
        }
      }
    }

    // 3. Handle ongoing incident (if the last tick was failure)
    if (activeIncident) {
      incidentsToCreate.push(activeIncident);
    }

    // 4. Batch Insert to Database
    if (incidentsToCreate.length > 0) {
      // Clear old incidents first to avoid duplicates (Optional)
      await prisma.incident.deleteMany({ where: { websiteId: site.id } });

      await prisma.incident.createMany({
        data: incidentsToCreate,
      });
      console.log(`✅ Created ${incidentsToCreate.length} incidents for ${site.url}`);
    } else {
      console.log(`✨ No incidents found for ${site.url}`);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });