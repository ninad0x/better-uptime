// import { schedule } from "node-cron";
// import { prisma } from "@repo/db/client";

// // Mock function to simulate pings from 3 regions
// // In production, this would call your actual Ping API/Service
// async function pingFromRegions(url: string) {
//   // Returns status for: [US-East, EU-West, Asia-South]
//   // value: { region: string, latency: number | null, isUp: boolean }
//   return [
//     { region: "us-east-1", latency: 120, isUp: true, regionId: "cmkaw7ifc0000v188zq4898mn" },
//     { region: "eu-west-1", latency: 145, isUp: true, regionId: "cmkaw83c00002v188ibbwryy3" },
//     { region: "ap-south-1", latency: null, isUp: true, regionId: "cmkaw7p990001v188j7tzl4qe" }, // Example: Asia is down
//   ];
// }

// const testTime = 10

// export const monitorWebsites = schedule(`*/${testTime} * * * * *`, async () => {
//   console.log(`Starting ${testTime}-minute check...`);
  
//   // 1. Fetch all active websites
//   const websites = await prisma.website.findMany({
//     where: { enabled: true },
//     include: { incidents: { where: { endedAt: null } } }, // Fetch open incidents
//   });

//     for (const site of websites) {
//     // 2. Perform Checks
//     const results = await pingFromRegions(site.url);
    
//     // 3. Analyze Health
//     const downRegions = results.filter((r) => !r.isUp);
//     const downCount = downRegions.length;
//     const totalRegions = results.length;
    
//     // LOGIC: Majority Rule (2 out of 3)
//     const isGlobalOutage = downCount >= (totalRegions / 2);
//     const isRegionalIssue = downCount === 1;
    
//     // 4. Save Raw Ticks (For Graphs)
//     await prisma.websiteTick.createMany({
//       data: results.map((r) => ({
//         websiteId: site.id,
//         regionId: r.regionId, // Assuming you map string to Region ID
//         responseTimeMs: r.latency || 0,
//         status: r,
//       })),
//     });

//     // 5. Handle Global Incidents (The Disaster)
//     const openIncident = site.incidents[0]; // Active incident if exists

//     if (isGlobalOutage) {
//       // START Incident
//       if (!openIncident) {
//         await prisma.incident.create({
//           data: {
//             websiteId: site.id,
//             cause: `Global Outage: ${downCount}/${totalRegions} regions failed`,
//             status: "ongoing",
//           },
//         });
//         console.log(`[ALERT] Created Incident for ${site.url}`);
//       }
      
//       // Update Cache to DOWN
//       await prisma.website.update({
//         where: { id: site.id },
//         data: { currentStatus: WebsiteStatus.Down, lastChecked: new Date() },
//       });

//     } else {
//       // RESOLVE Incident
//       if (openIncident) {
//         await prisma.incident.update({
//           where: { id: openIncident.id },
//           data: { endedAt: new Date(), status: "resolved" },
//         });
//         console.log(`[RESOLVED] Incident for ${site.url}`);
//       }

//       // Update Cache to UP
//       await prisma.website.update({
//         where: { id: site.id },
//         data: { currentStatus: WebsiteStatus.Up, lastChecked: new Date() },
//       });
//     }

//     // 6. Handle Regional Alerts (The Warning)
//     if (isRegionalIssue && !isGlobalOutage) {
//       const regionName = downRegions[0]!.region;
//       // TODO: Send low-priority Slack/Email notification here
//       console.warn(`[WARNING] ${site.url} is down in ${regionName} only.`);
//     }
//   }
// });