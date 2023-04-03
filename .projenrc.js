const { awscdk } = require('projen');
const { NpmAccess } = require('projen/lib/javascript');

const project = new awscdk.AwsCdkConstructLibrary({
  authorAddress: '',
  author: 'eriktisme',
  cdkVersion: '2.1.0',
  defaultReleaseBranch: 'master',
  name: '@eriktisme/aws-cdk-github-action-integration',
  repositoryUrl: 'https://github.com/eriktisme/aws-cdk-github-action-integration.git',
  description: 'This project repository provides CDK constructs to manage an Identity Provider for your GitHub Actions to securely manage your AWS resources.',
  keywords: ['aws-cdk', 'cdk', 'awscdk', 'github-actions'],
  release: true,
  releaseToNpm: true,
  npmAccess: NpmAccess.PUBLIC,
});

project.synth();
