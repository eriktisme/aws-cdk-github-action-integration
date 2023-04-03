import { App } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { TargetAccountGitHubRoles } from '../src/target-account-github-roles';

const stack = new TargetAccountGitHubRoles(new App(), 'stack', {
  owner: 'eriktisme',
  repositories: ['test'],
});
const template = Template.fromStack(stack);

describe('TargetAccountGithubRoles', () => {
  it('should configure projects', () => {
    template.hasResourceProperties('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Statement: [
          {
            Action: 'sts:AssumeRoleWithWebIdentity',
            Condition: {
              StringLike: {
                'token.actions.githubusercontent.com:sub':
                  'repo:eriktisme/test:*',
              },
              StringEquals: {
                'token.actions.githubusercontent.com:aud': 'sts.amazonaws.com',
              },
            },
            Effect: 'Allow',
            Principal: {
              Federated: {
                'Fn::Join': [
                  '',
                  [
                    'arn:aws:iam::',
                    {
                      Ref: 'AWS::AccountId',
                    },
                    ':oidc-provider/token.actions.githubusercontent.com',
                  ],
                ],
              },
            },
          },
        ],
        Version: '2012-10-17',
      },
      Description:
        'This role is used to deploy the repo: test with Github Actions',
      ManagedPolicyArns: [
        {
          'Fn::Join': [
            '',
            [
              'arn:',
              {
                Ref: 'AWS::Partition',
              },
              ':iam::aws:policy/AdministratorAccess',
            ],
          ],
        },
      ],
      MaxSessionDuration: 3600,
      RoleName: 'test-deploy-role',
    });
  });
});
