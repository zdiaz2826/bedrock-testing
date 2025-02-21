import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class BedrockKnowledgeBaseStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'BedrockKnowledgeBaseQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });

    // This was actually done in the console. The infra was spun down, here are the steps to spin it up:
    // 1. Create an S3 bucket
    // 2. Upload your files to the bucket, this will be your data source
    // 3. Create a Lambda function add bedrock permissions to the function and s3 permissions to the s3 bucket
    // 4. Create the knowledge base in Bedrock
    // 5. Use the s3 option and the OpenSearch option for the Vector DB
    // 6. The Knowledge base will take about 5 minutes to create
    // 7. You will need the knowledge base id to use the knowledge base, once it is created  you can get it from the console
    // 8. You can select a model in the console and test your knowledge base
    // 9. You will need the model ID in your codebase to use the knowledge base.
  }
}
