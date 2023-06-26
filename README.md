# TN Calculator Api
The project uses NestJS to expose the calculator API backed by a PostgreSQL database.

The application is ready to be run locally on top of Docker or deployed to AWS via CDK

## Main structure

The project is divided on two main folders:
- App which is the app itself
- cdk which is a CDK application to provision the main app on AWS

### Opening the projects

In order to work on either "app" or in "cdk" you must fulfill these pre-requisites:
- VSCode
- Docker / Docker Compose
- Extension Dev Containers installed on VSCode

Now, in order to open "app" or "cdk", just open the correspondent folder on VSCode. You`ll be prompted to reopen the IDE on a container, which you must answer Yes.

Now, this can take some minutes, but thanks to the Dev Containers technology everything you need (Postgres, Node, CDK cli, AWS cli, etc) will be automatically provisioned for you.

### Running locally

Open "app" folder on VSCode, then on integrated terminal just run:
> yarn start:dev

And this is it, the API is running on http://localhost:3000

### Running on AWS

Although it wasn`t a requirement, I made it easy to deploy on AWS. To do so, open the "cdk" folder on VSCode.

Unfortunatelly, before we can deploy we have to deal with a little bug (not mine), as described on https://github.com/docker/for-mac/issues/2295#issuecomment-356832693, to do so just type:
> rm ~/.docker/config.json

This step must be done just one time (unless you recreate the dev container)

Now you must provide AWS credentials, to do so create a "credentials" file inside .aws folder (I assume you`re on CDK dev container), you can use credentials.sample as a base. The credentials you use must have enough permissions to manage S3, RDS, App Runner, CloudWatch, CloudFormation, etc.

If you just want to experiment the app and deployment process, I recommend a user with AdministratorAccess policy.

Next, you must bootstrap CDK on your AWS account, this is as simple as:
(Not necessary if you already bootstraped and deployed the frontend project on this account)
> cdk bootstrap

This is a one time step, even if you recreate the container

And finally, you deploy the application with:
> cdk deploy

On both deploy and bootstrap you will be prompted to confirm creation of some resources on your AWS account, which you should answer yes.

The deploy operation will take some minutes to complete, but in the end you`re expected to see something like:
>tn-calc-api
>
>Deployment time: 331.74s
>
>Outputs:
>tn-calc-api.apiurl = 5mmuxz9hcp.us-east-2.awsapprunner.com
>Stack ARN:
>arn:aws:cloudformation:us-east-2:122195075444:stack/CdkStack/7954eb60-120c-11ee-b403-0a38b43ebe9d
>
>Total time: 335.77s

Now the app is deployed at http://5mmuxz9hcp.us-east-2.awsapprunner.com

# Demo accounts

Whatever method you use to access the application (live version, local, deployed by yourself), you have 5 demo accounts to use: username demo[1-5]@tn.com / password 1234 