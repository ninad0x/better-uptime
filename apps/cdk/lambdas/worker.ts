exports.handler = async (event: any) => {
  const websites = JSON.parse(event.Records[0].body);

  const BACKEND_URL = process.env.BACKEND_URL || "https://623085b8ec1b.ngrok-free.app";
  
  const results = await Promise.all(
    
    websites.map(async (w: any) => {
      const start = Date.now();
      let status = 0;   // default 0
      let details: string | null = null;

      try {
        const res = await fetch(w.url, { signal: AbortSignal.timeout(5000) });
        status = res.status;
        details = res.statusText || null;
      } catch (e: any) {
        status = 0;
        details = e.message || "Unknown Network Error";
      }

      return {
        id: w.id,
        website: w.url,
        status,
        latency: Date.now() - start,
        timestamp: Date.now(),
        details
      };
    })
  );

  console.log(`Checked ${results.length} sites.`);

  await fetch(`${BACKEND_URL}/uptime`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      region: process.env.AWS_REGION,
      results, 
    }),
  });
};