const { SQSClient, SendMessageCommand } = require("@aws-sdk/client-sqs");

const sqs = new SQSClient();


exports.handler = async () => {
  
  const response = await fetch("https://9d96ad64301a.ngrok-free.app/websites")
  const data = await response.json()
  
  console.log(data);

  const websites = (data as any).websites.map((w: any) => w.url)

  console.log(websites);

  await sqs.send(
    new SendMessageCommand({
      QueueUrl: process.env.QUEUE_URL,
      MessageBody: JSON.stringify(websites)
    })
  );


  return "OK";
};
