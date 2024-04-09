import { App } from 'aws-cdk-lib';
import { CloudWatchLambdaDashboardStack } from './cdk-lambda-dashboard-stack';
import { TransactionsAPI } from './cdk-transactions-api-lambda-construct';

// for development, use account/region from cdk cli
const devEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const app = new App();

const cloudWatchLambdaDashboardStack = new CloudWatchLambdaDashboardStack(app, 'TransactionsLambdaDashboardStack', {
  dashboardName: 'TransactionsLambdaDashboard',
  env: devEnv,
});
// const cloudWatchLambdaDashboardStack = new CloudWatchLambdaDashboardStack(app, 'TransactionsLambdaDashboardStack', {
//   dashboardName: "TransactionsLambdaDashboard",
//   env: devEnv
// });

new TransactionsAPI(cloudWatchLambdaDashboardStack, 'TransactionsApi');

cloudWatchLambdaDashboardStack.addLambda('BeginTransaction', 'BeginTransaction');
cloudWatchLambdaDashboardStack.addLambda('UpdateTransaction', 'UpdateTransaction');
cloudWatchLambdaDashboardStack.addLambda('GetTransaction', 'GetTransaction');

app.synth();