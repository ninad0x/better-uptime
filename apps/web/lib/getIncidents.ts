
export type Incident = {
  id: string;
  startedAt: Date;
  resolvedAt: Date | null;
  duration: string;
};

export function getIncidentsFromMetrics(metrics: any): Incident[] {
  // 1. Sort by Newest First (Crucial)
  const sorted = [...metrics].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const incidents: Incident[] = [];
  let currentIncident: Partial<Incident> | null = null;

  // 2. Loop through every tick
  for (let i = 0; i < sorted.length; i++) {
    const tick = sorted[i];
    
    // ADJUST THIS CONDITION based on how you save errors
    // e.g., tick.status >= 400 || tick.status === "DOWN"
    const isDown = tick.status >= 400 || tick.responseTimeMs > 10000; 

    if (isDown) {
      // If no incident, start one
      if (!currentIncident) {
        currentIncident = {
          id: tick.id,
          // If this is the very first log in the list, it's still ongoing
          resolvedAt: i === 0 ? null : sorted[i - 1].createdAt, 
          startedAt: tick.createdAt, // Will keep getting pushed back
        };
      }
      // Keep pushing the start time back as long as we find errors
      currentIncident.startedAt = tick.createdAt;
    } 
    else {
      // It's a Success Tick. If we were tracking an incident, it ends here.
      if (currentIncident) {
        incidents.push(calculateDuration(currentIncident));
        currentIncident = null; // Reset
      }
    }
  }

  // If logs end and we are still in an incident, push it
  if (currentIncident) {
    incidents.push(calculateDuration(currentIncident));
  }

  console.log(incidents);
  return incidents;
}

function calculateDuration(incident: Partial<Incident>): Incident {
  const start = new Date(incident.startedAt!);
  const end = incident.resolvedAt ? new Date(incident.resolvedAt) : new Date();
  
  const diffMs = end.getTime() - start.getTime();
  const mins = Math.floor(diffMs / 60000);
  const secs = Math.floor((diffMs % 60000) / 1000);

  return {
    ...incident,
    duration: incident.resolvedAt ? `${mins}m ${secs}s` : "Ongoing",
  } as Incident;
}