const { SQSClient, SendMessageCommand } = require("@aws-sdk/client-sqs");
const { SSMClient, GetParameterCommand } = require("@aws-sdk/client-ssm");

const sqs = new SQSClient({});
const ssm = new SSMClient({});

exports.handler = async () => {
  const startRes = await ssm.send(
    new GetParameterCommand({ Name: "/uptime/start" })
  );

  if (startRes.Parameter?.Value !== "true") return "PAUSED";

  const response = await fetch("https://803841669d26.ngrok-free.app/websites");
  const data = await response.json();
  const websites = (data as any).websites.map((w:any) => w.url);

  await sqs.send(
    new SendMessageCommand({
      QueueUrl: process.env.QUEUE_URL,
      MessageBody: JSON.stringify(websites),
    })
  );

  return "OK";
};
