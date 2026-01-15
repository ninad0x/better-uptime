import { prisma } from "store/client";
import { Prisma } from "../../../packages/store/generated/prisma/client";

type WebsiteDetails = Prisma.WebsiteGetPayload<{
    include: {
        metric: true;
        ticks: true;
        incidents: true;
    }
}>

export async function getWebsiteDetails(id: string): Promise<WebsiteDetails | null> {
  const timeWindow = new Date();
  timeWindow.setHours(timeWindow.getHours() - 100);

  const site = await prisma.website.findUnique({
    where: { id },
    include: {
      
      metric: {
        where: { createdAt: { gte: timeWindow } },
        orderBy: { createdAt: 'asc' },
      },
      
      ticks: {
        orderBy: { createdAt: 'asc'},
        take: 10
      },

      incidents: {
        orderBy: { startedAt : 'desc' },
        take: 5,
      }
    }
  });

  console.log(site);

  return site;
}