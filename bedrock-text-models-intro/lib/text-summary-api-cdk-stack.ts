import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { join } from 'path';
import { LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { PolicyStatement, Effect } from 'aws-cdk-lib/aws-iam';

export class TextSummaryApiCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create Lambda
    const summaryLambda = new NodejsFunction(this, 'Ts-TextLambda', {
        runtime: Runtime.NODEJS_20_X,
        handler: 'handler',
        entry: (join(__dirname, '..', 'services/text', 'summary.ts')),
        timeout: cdk.Duration.seconds(30),
    })

    // Add bedrock permissions to lambda role
    summaryLambda.addToRolePolicy(new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ['bedrock:InvokeModel'],
        resources: ['*']
    }))

    // Create API Gateway
    const api = new RestApi(this, 'TS-TextApi');

    // Add API resource
    const textResource = api.root.addResource('text');

    // Add Lambda Integration
    const summaryIntegration = new LambdaIntegration(summaryLambda);

    // Add POST method to the API Gateway
    textResource.addMethod('POST', summaryIntegration);

    // Create a bucket for our image gen
    const bucket = new cdk.aws_s3.Bucket(this, 'TestBucketImageGen', {
        lifecycleRules: [
          {
            expiration: cdk.Duration.days(3),
          }
        ]
      });

    new cdk.CfnOutput(this, 'ImageGenAPIBucketTest', { value: bucket.bucketName });
  }
}
