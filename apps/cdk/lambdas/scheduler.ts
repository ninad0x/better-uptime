const { SQSClient, SendMessageCommand } = require("@aws-sdk/client-sqs");

const sqs = new SQSClient({});

exports.handler = async () => {

  const response = await fetch("https://5b57b0680011.ngrok-free.app/websites");   // temp url
  const data = await response.json();
  const websites = (data as any).websites.map((w:any) => ({ 
    url: w.url,
    id: w.id
  }));

  await sqs.send(
    new SendMessageCommand({
      QueueUrl: process.env.QUEUE_URL,
      MessageBody: JSON.stringify(websites),
    })
  );

  return "OK";
};
