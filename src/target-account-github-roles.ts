import { Duration, Stack, StackProps } from 'aws-cdk-lib';
import { ManagedPolicy } from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import { GithubActionsIdentityProvider, GithubActionsRole } from './constructs';

export interface TargetAccountGithubRolesProps extends StackProps {
  /**
   * The GitHub username that holds the repositories.
   */
  readonly owner: string;

  /**
   * The name of the repositories you want to deploy with GitHub Actions.
   */
  readonly repositories: string[];
}

export class TargetAccountGitHubRoles extends Stack {
  constructor(
    scope: Construct,
    id: string,
    props: TargetAccountGithubRolesProps,
  ) {
    super(scope, id, props);

    const provider = GithubActionsIdentityProvider.fromAccount(
      this,
      'github-provider',
    );

    props.repositories.forEach((project) => {
      const role = new GithubActionsRole(this, `${project}-deploy-role`, {
        provider,
        owner: props.owner,
        repo: project,
        roleName: `${project}-deploy-role`,
        description: `This role is used to deploy the repo: ${project} with Github Actions`,
        maxSessionDuration: Duration.hours(1),
      });

      role.addManagedPolicy(
        ManagedPolicy.fromAwsManagedPolicyName('AdministratorAccess'),
      );
    });
  }
}
