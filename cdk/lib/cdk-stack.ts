import * as cdk from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import { DockerImageAsset } from "aws-cdk-lib/aws-ecr-assets";
import * as rds from "aws-cdk-lib/aws-rds";
import { Construct } from "constructs";
import * as apprunner from "@aws-cdk/aws-apprunner-alpha";
import * as iam from "aws-cdk-lib/aws-iam";
import * as path from "path";

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, "vpc", {
      cidr: "10.0.0.0/16",
      natGateways: 0,
      maxAzs: 3,
      subnetConfiguration: [
        {
          name: "public-subnet-1",
          subnetType: ec2.SubnetType.PUBLIC,
          cidrMask: 24,
        },
        {
          name: "isolated-subnet-1",
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
          cidrMask: 28,
        },
      ],
    });

    const dbInstance = new rds.DatabaseInstance(this, "tn-calc-db", {
      vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PUBLIC,
      },
      engine: rds.DatabaseInstanceEngine.postgres({
        version: rds.PostgresEngineVersion.VER_13_7,
      }),
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.BURSTABLE3,
        ec2.InstanceSize.MICRO
      ),

      credentials: rds.Credentials.fromGeneratedSecret("postgres"),
      multiAz: false,
      allocatedStorage: 100,
      maxAllocatedStorage: 110,
      allowMajorVersionUpgrade: false,
      autoMinorVersionUpgrade: true,
      backupRetention: cdk.Duration.days(0),
      deleteAutomatedBackups: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      deletionProtection: false,
      databaseName: "tncalcdb",
    });
    dbInstance.connections.allowDefaultPortFromAnyIpv4();
    const serviceRole = new iam.Role(this, "ApiServiceRole", {
      assumedBy: new iam.ServicePrincipal("tasks.apprunner.amazonaws.com"),
    });
    dbInstance.grantConnect(serviceRole, "postgres");

    const imageAsset = new DockerImageAsset(this, "ImageAssets", {
      directory: path.join(__dirname, "../../app"),
    });

    const service = new apprunner.Service(this, "ApiService", {
      source: apprunner.Source.fromAsset({
        imageConfiguration: {
          port: 80,
          environmentVariables: {
            NO_COLOR: "true",
            RANDOM_ORG_ENDPOINT: "https://random.org"
          },
          environmentSecrets: {
            POSTGRES_USER: apprunner.Secret.fromSecretsManager(
              dbInstance.secret!,
              "username"
            ),
            POSTGRES_PASSWORD: apprunner.Secret.fromSecretsManager(
              dbInstance.secret!,
              "password"
            ),
            POSTGRES_DB: apprunner.Secret.fromSecretsManager(
              dbInstance.secret!,
              "dbname"
            ),
            POSTGRES_HOST: apprunner.Secret.fromSecretsManager(
              dbInstance.secret!,
              "host"
            ),
            POSTGRES_PORT: apprunner.Secret.fromSecretsManager(
              dbInstance.secret!,
              "port"
            ),
          },
        },
        asset: imageAsset,
      }),
      instanceRole: serviceRole,
    });

    new cdk.CfnOutput(this, "api-url", {
      exportName: "api-url",
      value: service.serviceUrl,
      description: "URL to access the API",
    });
  }
}
