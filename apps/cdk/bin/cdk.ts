import * as cdk from 'aws-cdk-lib/core';
import { UptimeStack } from '../lib/cdk-stack';

const app = new cdk.App();
const regions = [
  "ap-south-1",
  "us-east-1",
  "eu-west-1",
];

regions.forEach((region) => {
  new UptimeStack(app, `UptimeStack-${region}`, {
    env: { 
      account: process.env.CDK_DEFAULT_ACCOUNT,
      region: region
    }
  });

})
