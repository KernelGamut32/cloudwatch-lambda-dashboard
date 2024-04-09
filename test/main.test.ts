import { App } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { CloudWatchLambdaDashboardStack } from '../src/cdk-lambda-dashboard-stack';

test('Snapshot', () => {
  const app = new App();
  const stack = new CloudWatchLambdaDashboardStack(app, 'test', {
    dashboardName: 'test',
  });

  const template = Template.fromStack(stack);
  expect(template.toJSON()).toMatchSnapshot();
});