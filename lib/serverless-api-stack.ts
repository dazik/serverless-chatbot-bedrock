import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigw from 'aws-cdk-lib/aws-apigateway';
import * as iam from 'aws-cdk-lib/aws-iam';

export class ServerlessChatbotStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const chatbotLambda = new lambda.Function(this, 'HelloHandler', {
      runtime: lambda.Runtime.NODEJS_18_X,
      code: lambda.Code.fromAsset('dist/controllers/'),
      handler: 'hello.handler',
      memorySize: 128,
      timeout: cdk.Duration.seconds(30),
    });

    chatbotLambda.addToRolePolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['bedrock:*'],
      resources: ['*'],
    }));

    const api = new apigw.RestApi(this, 'serverless_chatbot_apii', {
      restApiName: 'serverless_chatbot_api',
      description: 'This service serves aita bot',
      defaultCorsPreflightOptions: { allowOrigins: apigw.Cors.ALL_ORIGINS },
    });

    const integration = new apigw.LambdaIntegration(chatbotLambda);

    api.root.addMethod('POST', integration);
  }
}
