exports.handler = async (event: any) => {
  const websites = JSON.parse(event.Records[0].body);
  const results = [];

  console.log("TOTAL ", websites);

  for (const url of websites) {
    
    console.log("URL: ", url);
    try {
      const start = Date.now();
      const res = await fetch(url);

      results.push({
        url,
        status: "UP",
        latency: Date.now() - start,
        timestamp: Date.now(),

      });

    } catch (e) {
      results.push({
        url,
        status: "DOWN",
        latency: null,
        timestamp: Date.now(),

      });
    }

  }

  await fetch("https://803841669d26.ngrok-free.app/uptime", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      region: process.env.AWS_REGION,
      results,
    }),
  });
};
