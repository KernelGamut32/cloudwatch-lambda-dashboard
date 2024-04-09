import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import * as cdk from 'aws-cdk-lib/core';

export interface LambdaDashboardsStackProps extends cdk.StackProps {
  dashboardName: string;
  env?: cdk.Environment;
}

export class CloudWatchLambdaDashboardStack extends cdk.Stack {

  protected readonly lambdaDashboard: cloudwatch.Dashboard;

  protected readonly invocations = new cloudwatch.Metric({
    namespace: 'AWS/Lambda',
    metricName: 'Invocations',
    statistic: 'sum',
  });

  protected readonly duration = new cloudwatch.Metric({
    namespace: 'AWS/Lambda',
    metricName: 'Duration',
    statistic: 'min',
  });

  protected readonly errors = new cloudwatch.Metric({
    namespace: 'AWS/Lambda',
    metricName: 'Errors',
    statistic: 'sum',
  });

  protected readonly throttles = new cloudwatch.Metric({
    namespace: 'AWS/Lambda',
    metricName: 'Throttles',
    statistic: 'sum',
  });

  protected readonly provisionedConcurrencySpillovers = new cloudwatch.Metric({
    namespace: 'AWS/Lambda',
    metricName: 'ProvisionedConcurrencySpilloverInvocations',
    statistic: 'sum',
  });

  protected readonly concurrentExecutions = new cloudwatch.Metric({
    namespace: 'AWS/Lambda',
    metricName: 'ConcurrentExecutions',
    statistic: 'sum',
  });

  protected readonly provisionedConcurrentExecutions = new cloudwatch.Metric({
    namespace: 'AWS/Lambda',
    metricName: 'ProvisionedConcurrentExecutions',
    statistic: 'sum',
  });

  protected readonly provisionedConcurrencyUtilization = new cloudwatch.Metric({
    namespace: 'AWS/Lambda',
    metricName: 'ProvisionedConcurrencyUtilization',
    statistic: 'sum',
  });

  constructor(scope: cdk.App, id: string, props: LambdaDashboardsStackProps) {
    super(scope, id, props);

    this.lambdaDashboard = new cloudwatch.Dashboard(this, props.dashboardName, {
      dashboardName: props.dashboardName,
    });
  }

  // adds one row to dashboard for each lambda function
  public addLambda(functionName: string, displayName: string) {
    const dimensions = {
      FunctionName: functionName,
    };

    this.lambdaDashboard.addWidgets(
      new cloudwatch.GraphWidget({
        title: displayName + ' Invocations',
        left: [
          this.invocations.with({
            dimensionsMap: dimensions,
          }),
        ],
      }),

      new cloudwatch.GraphWidget({
        title: displayName + ' Duration',
        left: [
          this.duration.with({
            dimensionsMap: dimensions,
          }),
          this.duration.with({
            dimensionsMap: dimensions,
            statistic: 'avg',
          }),
          this.duration.with({
            dimensionsMap: dimensions,
            statistic: 'max',
          }),
        ],
      }),

      new cloudwatch.GraphWidget({
        title: displayName + ' Errors',
        left: [
          this.errors.with({
            dimensionsMap: dimensions,
          }),
          this.throttles.with({
            dimensionsMap: dimensions,
          }),
          this.provisionedConcurrencySpillovers.with({
            dimensionsMap: dimensions,
          }),
        ],
      }),

      new cloudwatch.GraphWidget({
        title: displayName + ' ConcurrentExecutions',
        right: [
          this.concurrentExecutions.with({
            dimensionsMap: dimensions,
          }),
          this.provisionedConcurrentExecutions.with({
            dimensionsMap: dimensions,
          }),
          this.provisionedConcurrencyUtilization.with({
            dimensionsMap: dimensions,
          }),
        ],
      }),
    );
  }
}
