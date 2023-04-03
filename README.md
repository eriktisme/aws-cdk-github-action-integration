# AWS CDK GitHub Actions Integration

This project repository provides CDK constructs to manage an Identity Provider for your GitHub Actions to securely manage your AWS resources.

## Installation

You can install this library using pnpm:

```shell
pnpm add -D @eriktisme/aws-cdk-github-action-integration
```

## Usage

To use this library, simply import the following constructs in your repository and update the properties.

```typescript
import {
  TargetAccountGitHubSetup,
  TargetAccountGitHubRoles,
} from '@eriktisme/aws-cdk-github-action-integration'

new TargetAccountGitHubSetup(new App(), 'target-account-github-setup')

new TargetAccountGitHubRoles(new App(), 'stack', {
  owner: 'eriktisme',
  repositories: ['test'],
})
```

And in your GitHub Actions workflows authenticate with the new roles as shown below.

```yaml
name: Deploy

on:
  push:
    branches: [master]

permissions:
  id-token: write
  contents: read
  actions: read

jobs:
  deploy-prod:
    runs-on: ubuntu-latest
    needs: [dependencies]
    steps:
      - uses: actions/checkout@v3

      - uses: aws-actions/configure-aws-credentials@v1
        with:
          role-to-assume: arn:aws:iam::xxxxxxxx:role/test-deploy-role
          aws-region: us-east-1
```
