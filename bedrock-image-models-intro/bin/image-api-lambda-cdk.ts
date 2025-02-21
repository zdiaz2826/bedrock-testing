#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { ImageApiLambdaCdkStack } from '../lib/image-api-lambda-cdk-stack';

const app = new cdk.App();
new ImageApiLambdaCdkStack(app, 'TsImageStack', {});