import { join } from 'path';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';

export class TransactionsAPI extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const getTransactionLambda = new NodejsFunction(this, 'GetTransaction', {
      functionName: 'GetTransaction',
      runtime: Runtime.NODEJS_20_X,
      entry: join(__dirname, 'GetTransaction', 'index.ts'),
    });

    const beginTransactionLambda = new NodejsFunction(this, 'BeginTransaction', {
      functionName: 'BeginTransaction',
      runtime: Runtime.NODEJS_20_X,
      entry: join(__dirname, 'BeginTransaction', 'index.ts'),
    });

    const updateTransactionLambda = new NodejsFunction(this, 'UpdateTransaction', {
      functionName: 'UpdateTransaction',
      runtime: Runtime.NODEJS_20_X,
      entry: join(__dirname, 'UpdateTransaction', 'index.ts'),
    });

    const transactionsApi = new apigateway.RestApi(this, 'TransactionsAPI', {
      restApiName: 'Transactions API',
      description: 'Critical Transactions API',
    });

    const transactions = transactionsApi.root.addResource('transactions');
    const transaction = transactions.addResource('{transaction_id}');

    const beginTransactionIntegration = new apigateway.LambdaIntegration(beginTransactionLambda, {
      requestTemplates: { 'application/json': '{ "statusCode": "200" }' },
    });
    transactions.addMethod('POST', beginTransactionIntegration);

    const getTransactionIntegration = new apigateway.LambdaIntegration(getTransactionLambda, {
      requestTemplates: { 'application/json': '{ "statusCode": "200" }' },
    });
    transaction.addMethod('GET', getTransactionIntegration);

    const updateTransactionIntegration = new apigateway.LambdaIntegration(updateTransactionLambda, {
      requestTemplates: { 'application/json': '{ "statusCode": "200" }' },
    });
    transaction.addMethod('PUT', updateTransactionIntegration);
  }
}