import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as sqs from "aws-cdk-lib/aws-sqs";
import * as events from "aws-cdk-lib/aws-events";
import * as targets from "aws-cdk-lib/aws-events-targets";
import * as lambdaSqs from "aws-cdk-lib/aws-lambda-event-sources";

console.time("yo")

export class UptimeStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const queue = new sqs.Queue(this, "RegionQueue");

    const worker = new lambda.Function(this, "WorkerFn", {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: "worker.handler",
      code: lambda.Code.fromAsset("lambdas"),
      timeout: cdk.Duration.seconds(30),
    });

    worker.addEventSource(new lambdaSqs.SqsEventSource(queue));
    queue.grantConsumeMessages(worker);

    const scheduler = new lambda.Function(this, "SchedulerFn", {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: "scheduler.handler",
      code: lambda.Code.fromAsset("lambdas"),
      timeout: cdk.Duration.seconds(30),
      environment: { QUEUE_URL: queue.queueUrl },
    });

    queue.grantSendMessages(scheduler);

    new events.Rule(this, "Every3Min", {
      schedule: events.Schedule.rate(cdk.Duration.minutes(1)),
      targets: [new targets.LambdaFunction(scheduler)],
    });
  }
}

console.timeEnd("yo")