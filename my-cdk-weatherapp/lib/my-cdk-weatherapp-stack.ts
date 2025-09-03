import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs_patterns from 'aws-cdk-lib/aws-ecs-patterns';
import * as ecr_assets from 'aws-cdk-lib/aws-ecr-assets';

export class WeatherApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // 1. VPC作成
    const vpc = new ec2.Vpc(this, 'WeatherApiVpc', {
      maxAzs: 2, // 可用ゾーン2つ
    });

    // 2. ECSクラスタ作成
    const cluster = new ecs.Cluster(this, 'WeatherApiCluster', {
      vpc,
    });

    // 3. Dockerイメージをビルド（ローカルDockerfileから）
    const dockerImageAsset = new ecr_assets.DockerImageAsset(this, 'WeatherApiImage', {
      directory: '../weatherSearch', // Dockerfile のあるディレクトリ
    });

    // 4. Fargateサービス + ALB を作成
    new ecs_patterns.ApplicationLoadBalancedFargateService(this, 'WeatherApiService', {
      cluster,
      taskImageOptions: {
        image: ecs.ContainerImage.fromDockerImageAsset(dockerImageAsset), // CDK がビルド&ECR push したイメージを利用
        containerPort: 3000,
      },
      publicLoadBalancer: true, // インターネットからアクセス可能
    });
  }
}
