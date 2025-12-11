const { SQSClient, SendMessageCommand } = require("@aws-sdk/client-sqs");

const sqs = new SQSClient();


exports.handler = async () => {
  const websites = [
    "https://www.youtube.com/",
    "https://www.youtube.com/",
    "https://www.youtube.com/",
    "https://www.wddawsdwd.com/",
    "https://www.youtube.com/",
    "https://www.google.com",
    "https://www.dwdwdsdw.com",
    "https://www.google.com",
    "https://www.google.com",
    "https://www.awdsdwggeg.com",
    "https://www.google.com",
    "https://www.google.com",
  ];

  await sqs.send(
    new SendMessageCommand({
      QueueUrl: process.env.QUEUE_URL,
      MessageBody: JSON.stringify(websites)
    })
  );


  return "OK";
};
