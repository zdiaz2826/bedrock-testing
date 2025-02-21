#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { TextSummaryApiCdkStack } from '../lib/text-summary-api-cdk-stack';

const app = new cdk.App();
new TextSummaryApiCdkStack(app, 'TextSummaryApiCdkStack', {
});