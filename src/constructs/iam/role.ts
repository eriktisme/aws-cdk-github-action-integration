import { Role, RoleProps, WebIdentityPrincipal } from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import {
  GithubActionsIdentityProvider,
  IGithubActionsIdentityProvider,
} from './providers';

interface GithubActionsRoleProps {
  provider: IGithubActionsIdentityProvider;
  owner: string;
  repo: string;
  filter?: string;
}

export class GithubActionsRole extends Role {
  static formatSubject(props: GithubActionsRoleProps): string {
    const { owner, repo, filter = '*' } = props;

    return `repo:${owner}/${repo}:${filter}`;
  }

  constructor(
    scope: Construct,
    id: string,
    props: GithubActionsRoleProps & Omit<RoleProps, 'assumedBy'>,
  ) {
    const { provider } = props;

    super(scope, id, {
      ...props,
      assumedBy: new WebIdentityPrincipal(provider.openIdConnectProviderArn, {
        StringLike: {
          [`${GithubActionsIdentityProvider.issuer}:sub`]:
            GithubActionsRole.formatSubject(props),
        },
        StringEquals: {
          [`${GithubActionsIdentityProvider.issuer}:aud`]: 'sts.amazonaws.com',
        },
      }),
    });
  }
}
