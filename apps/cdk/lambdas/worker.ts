exports.handler = async (event: any) => {
  const websites = JSON.parse(event.Records[0].body);
  const results = [];

  console.log("TOTAL ", websites);

  for (const website of websites) {
    
    console.log("URL: ", website.url);
    try {
      const start = Date.now();
      const res = await fetch(website.url);

      results.push({
        id: website.id,
        website: website.url,
        status: "Up",
        latency: Date.now() - start,
        timestamp: Date.now(),

      });

    } catch (e) {
      results.push({
        id: website.id,
        website: website.url,
        status: "Down",
        latency: null,
        timestamp: Date.now(),

      });
    }

  }

  // temp url
  await fetch("https://5b57b0680011.ngrok-free.app/uptime", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      region: process.env.AWS_REGION,
      results,
    }),
  });
};
