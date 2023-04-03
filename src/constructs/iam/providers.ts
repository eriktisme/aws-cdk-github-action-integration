import { Stack } from 'aws-cdk-lib';
import {
  IOpenIdConnectProvider,
  OpenIdConnectProvider,
} from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export interface IGithubActionsIdentityProvider extends IOpenIdConnectProvider {
  //
}

export class GithubActionsIdentityProvider
  extends OpenIdConnectProvider
  implements IGithubActionsIdentityProvider {
  public static readonly issuer: string = 'token.actions.githubusercontent.com';

  static fromAccount(
    scope: Construct,
    id: string,
  ): IGithubActionsIdentityProvider {
    const accountId = Stack.of(scope).account;
    const providerArn = `arn:aws:iam::${accountId}:oidc-provider/${GithubActionsIdentityProvider.issuer}`;

    return OpenIdConnectProvider.fromOpenIdConnectProviderArn(
      scope,
      id,
      providerArn,
    );
  }

  constructor(scope: Construct, id: string) {
    super(scope, id, {
      url: `https://${GithubActionsIdentityProvider.issuer}`,
      thumbprints: [
        'a031c46782e6e6c662c2c87c76da9aa62ccabd8e',
        '6938fd4d98bab03faadb97b34396831e3780aea1',
      ],
      clientIds: ['sts.amazonaws.com'],
    });
  }
}
