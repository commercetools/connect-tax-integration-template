# Tax Calculator
This module provides an application based on [commercetools Connect](https://docs.commercetools.com/connect), which will be triggered by the [extension](https://docs.commercetools.com/tutorials/extensions) from commercetools project once there is a cart created/updated. The corresponding cart details are then synchronized to the external tax provider to calculate tax amount.

The module also provides scripts for post-deployment and pre-undeployment action. After deployment via connect service completed, [commercetools Extension](https://docs.commercetools.com/tutorials/extensions) is created by post-deployment script which listen to any cart create/update action in commercetools Project. Once cart has been created/updated, the commercetools Extension triggers an API of tax calculator module to handle the corresponding changes.

## Get started
#### Change the key of commercetools Subscription
Please specify your desired key for creation of commercetools Extension [here](https://github.com/commercetools/connect-tax-integration-template/blob/dbdce163f08b36d8635d7705dd58c89d03bf8399/tax-calculator/src/connectors/constants.js#L2C50-L2C75).
The default key is 'ctpTaxCalculatorExtension'.

#### Install your tax-provider SDK 
Please run following npm command under order-syncer folder to install the NodeJS SDK provided by tax provider.

```
$ npm install <tax-provider-sdk>
```
#### Install dependencies
```
$ npm install
```
#### Run unit test
```
$ npm run test:unit
```
#### Run integration test
```
$ npm run test:integration
```
#### Run the application in local environment
```
$ npm run start
```
#### Run post-deploy script in local environment
```
$ npm run connector:post-deploy
```
#### Run pre-undeploy script in local environment
```
$ npm run connector:pre-undeploy
```

## Development in local environment
Different from staging and production environments, in which the out-of-the-box setup and variables have been set by connect service during deployment, the tax-calculator requires additional operations in local environment for development.
#### Create Commercetools Extension in your Commercetools Project
When a service-type connector application is deployed via connect service, a Commercetools Extension is created automatically. However, it does not apply on local environment. To develop the tax-calculator in local environment, you need to follow the steps below:
1. Create a Commercetools Extension.
2. Use HTTP tunnel tools like [ngrok](https://ngrok.com/docs/getting-started) to expose your local development server to internet.
3. Set the URL provided by the tunnel tool as the destination in Extension, so that event can be triggered to the tax-calculator in your local environment.

For details, please refer [here](https://docs.commercetools.com/tutorials/extensions).

#### Set the required environment variables

Before starting the development, we advise users to create a .env file in order to help them in local development.
      
Refer [here](https://github.com/commercetools/connect-tax-integration-template/tree/fix-documentation#deployment-configuration) for more details about the environment variables required for tax-calculator application to run.