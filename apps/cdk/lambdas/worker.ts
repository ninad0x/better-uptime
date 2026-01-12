exports.handler = async (event: any) => {
  const websites = JSON.parse(event.Records[0].body);

  // 1. Ping ALL sites in parallel
  const results = await Promise.all(
    websites.map(async (w: any) => {
      const start = Date.now();
      try {
        // Add 5s timeout so one bad site doesn't freeze the whole batch
        const res = await fetch(w.url, { signal: AbortSignal.timeout(5000) });
        return {
          id: w.id,
          website: w.url,
          status: res.ok ? "Up" : "Down", // Check 404/500 errors
          latency: Date.now() - start,
          timestamp: Date.now(),
        };
      } catch (e) {
        return {
          id: w.id,
          website: w.url,
          status: "Down",
          latency: 0,
          timestamp: Date.now(),
        };
      }
    })
  );

  console.log(`Checked ${results.length} sites.`);

  // 2. Send Batch Results to your API
  await fetch(`https://aef94eb2c51d.ngrok-free.app/uptime`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      region: process.env.AWS_REGION,
      results, // Send the whole array
    }),
  });
};