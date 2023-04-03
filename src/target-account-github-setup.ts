import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { GithubActionsIdentityProvider } from './constructs';

export class TargetAccountGitHubSetup extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    new GithubActionsIdentityProvider(this, 'github-actions-identity-provider');
  }
}
