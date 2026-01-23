import { prisma } from "@repo/db/client";

export async function getDashboardData(userId: string) {
  const oneDayAgo = new Date();
  oneDayAgo.setHours(oneDayAgo.getHours() - 24);

  return await prisma.website.findMany({
    where: { userId },
    include: {
      ticks: {
        where: { createdAt: { gte: oneDayAgo } },
        orderBy: { createdAt: 'asc' },
        select: { status: true, createdAt: true }
      }
    }
  });
}