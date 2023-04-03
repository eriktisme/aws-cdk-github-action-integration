import { App } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { TargetAccountGitHubSetup } from '../src/target-account-github-setup';

const stack = new TargetAccountGitHubSetup(new App(), 'stack');
const template = Template.fromStack(stack);

describe('TargetAccountGithubSetup', () => {
  it('should configure provider', () => {
    template.hasResourceProperties('Custom::AWSCDKOpenIdConnectProvider', {
      ClientIDList: ['sts.amazonaws.com'],
      ThumbprintList: [
        'a031c46782e6e6c662c2c87c76da9aa62ccabd8e',
        '6938fd4d98bab03faadb97b34396831e3780aea1',
      ],
      Url: 'https://token.actions.githubusercontent.com',
    });
  });

  it('should configure a role', () => {
    template.hasResourceProperties('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'sts:AssumeRole',
            Effect: 'Allow',
            Principal: {
              Service: 'lambda.amazonaws.com',
            },
          },
        ],
      },
      ManagedPolicyArns: [
        {
          'Fn::Sub':
            'arn:${AWS::Partition}:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole',
        },
      ],
      Policies: [
        {
          PolicyName: 'Inline',
          PolicyDocument: {
            Version: '2012-10-17',
            Statement: [
              {
                Effect: 'Allow',
                Resource: '*',
                Action: [
                  'iam:CreateOpenIDConnectProvider',
                  'iam:DeleteOpenIDConnectProvider',
                  'iam:UpdateOpenIDConnectProviderThumbprint',
                  'iam:AddClientIDToOpenIDConnectProvider',
                  'iam:RemoveClientIDFromOpenIDConnectProvider',
                ],
              },
            ],
          },
        },
      ],
    });
  });
});
