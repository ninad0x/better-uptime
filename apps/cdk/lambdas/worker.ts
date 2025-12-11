exports.handler = async (event: any) => {
  const websites = JSON.parse(event.Records[0].body);

  for (let url of websites) {
    try {
      const start = Date.now();
      const res = await fetch(url);
      console.log(url, res.status, Date.now() - start, "ms");
    } catch (e) {
      console.log(url, "DOWN");
    }
  }

  return "done";
};
