#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib/core';
import { UptimeStack } from '../lib/cdk-stack';

const app = new cdk.App();
new UptimeStack(app, "UptimeStack", {
  env: { 
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: "ap-south-1"
  }
});