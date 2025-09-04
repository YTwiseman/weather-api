import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs_patterns from 'aws-cdk-lib/aws-ecs-patterns';

export class WeatherApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // 1. VPC作成
    const vpc = new ec2.Vpc(this, 'WeatherApiVpc', {
      maxAzs: 2,
    });

    // 2. ECSクラスタ作成
    const cluster = new ecs.Cluster(this, 'WeatherApiCluster', {
      vpc,
    });

    // 3. Fargateサービス + ALB を作成 (ECR イメージを参照)
    new ecs_patterns.ApplicationLoadBalancedFargateService(this, 'WeatherApiService', {
      cluster,
      taskImageOptions: {
        image: ecs.ContainerImage.fromRegistry(
          `${cdk.Aws.ACCOUNT_ID}.dkr.ecr.${cdk.Aws.REGION}.amazonaws.com/weatherrepo:latest`
        ),
        containerPort: 3000,
      },
      publicLoadBalancer: true,
    });
  }
}

