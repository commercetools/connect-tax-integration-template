# connect-tax-integration-template
This repository provides a [connect](https://docs.commercetools.com/connect) template for a tax integration connector for tax amount calculation performed by external tax provider with cart/order data from composable commerce. This boilerplate code acts as a starting point for such integration.

This template uses the [Cart](https://docs.commercetools.com/api/projects/carts),  [Order](https://docs.commercetools.com/api/projects/orders), [API Extension](https://docs.commercetools.com/api/projects/api-extensions), data models from commercetools composable commerce which can be used for querying store-specific product data to sync into external systems. Template is based on asynchronous [Subscriptions](https://docs.commercetools.com/api/projects/subscriptions) to keep the external systems up to date.

## Template Features
- NodeJS supported.
- Uses Express as web server framework.
- Uses [commercetools SDK](https://docs.commercetools.com/sdk/js-sdk-getting-started) for the commercetools-specific communication.
- Includes local development utilities in npm commands to build, start, test, lint & prettify code.
- Uses JSON formatted logger with log levels
- Setup sample unit and integration tests with [sinon](https://sinonjs.org/), [Jest](https://jestjs.io/) and [supertest](https://github.com/ladjs/supertest#readme)

## Prerequisite
#### 1. commercetools composable commerce API client
Users are expected to create API client responsible for API extension creation as well as fetching cart and order details from composable commerce project, API client should have enough scope to be able to do so. These API client details are taken as input as an environment variable/ configuration for connect. Details of composable commerce project can be provided as environment variables (configuration for connect) `CTP_PROJECT_KEY` , `CTP_CLIENT_ID`, `CTP_CLIENT_SECRET`, `CTP_SCOPE`, `CTP_REGION`. For details, please read [Deployment Configuration](./README.md#deployment-configuration).

#### 2. External tax provider
Users are expected to create api clients/ keys in external tax provider. Those details are taken as input as an environment variable / configuration for connect. API token to external tax provider can be provided as environment variables (configuration for connect) `TAX_PROVIDER_API_TOKEN`. For details, please read [Deployment Configuration](./README.md#deployment-configuration).
 
## Getting started
The template contains two separated modules:
- Tax Calculator: Provides a REST-API to users to calculate tax amount through external tax provider by inputting cart details. It is triggered automatically by API extension when cart(should be in frozen state and with tax mode as ExternalAmount) is updated.  
- Order Syncer: Receives message from commercetools project once there is an order created in commercetools store. The order and its corresponding cart details are then synchronized to the external tax provider for accounting and compliance purposes in addition to filing tax returns with tax authorities.

Regarding the development of both modules, please refer to the following documentations:
- [Development of Tax Calculator](tax-calculator/README.md)
- [Development of Order Syncer](order-syncer/README.md)

#### 1. Develop your specific needs 
To calculate tax amount by cart details and synchronize order details to external tax provider, users need to extend this connector with the following tasks
- Data Persistence: Implementation to communicate between this connector application and the external system using libraries provided by external tax provider. Please remember that the product data might not be saved into the external system in a single attempt, it should have needed retry and recovery mechanism.

#### 2. Register as connector in commercetools Connect
Follow guidelines [here](https://docs.commercetools.com/connect/getting-started) to register the connector for public/private use.

## Deployment Configuration
In order to deploy your customized connector application on commercetools Connect, it needs to be published. For details, please refer to [documentation about commercetools Connect](https://docs.commercetools.com/connect/concepts)
In addition, in order to support connect, the tax integration connector template has a folder structure as listed below
```
├── tax-calculator
│   ├── src
│   ├── test
│   └── package.json
├── order-syncer
│   ├── src
│   ├── test
│   └── package.json
└── connect.yaml
```

Connect deployment configuration is specified in `connect.yaml` which is required information needed for publishing of the application. Following is the deployment configuration used by tax calculator and order syncer modules
```
deployAs:
  - name: tax-calculator
    applicationType: service
    endpoint: /taxCalculator
    scripts:
      postDeploy: npm install && npm run connector:post-deploy
      preUndeploy: npm install && npm run connector:pre-undeploy
    configuration:
      standardConfiguration:
        - key: CTP_REGION
          description: region of commercetools composable commerce project
      securedConfiguration:
        - key: CTP_PROJECT_KEY
          description: commercetools composable commerce project key
        - key: CTP_CLIENT_ID
          description: commercetools composable commerce client ID
        - key: CTP_CLIENT_SECRET
          description: commercetools composable commerce client secret
        - key: CTP_SCOPE
          description: commercetools composable commerce client scope
        - key: TAX_PROVIDER_API_TOKEN
          description: API Token for communication between the connector and tax provider
  - name: order-syncer
    applicationType: event
    endpoint: /orderSyncer
    scripts:
      postDeploy: npm install && npm run connector:post-deploy
      preUndeploy: npm install && npm run connector:pre-undeploy
    configuration:
      standardConfiguration:
        - key: CTP_REGION
          description: region of commercetools composable commerce project
      securedConfiguration:
        - key: CTP_PROJECT_KEY
          description: commercetools project key
        - key: CTP_CLIENT_ID
          description: commercetools client ID
        - key: CTP_CLIENT_SECRET
          description: commercetools client secreet
        - key: CTP_SCOPE
          description: commercetools client scope
        - key: TAX_PROVIDER_API_TOKEN
          description: API Token for communication between the connector and tax provider
```

Here you can see the details about various variables in configuration
- CTP_PROJECT_KEY: The key of commercetools composable commerce project.
- CTP_CLIENT_ID: The client ID of your commercetools composable commerce user account. It is used in commercetools client to communicate with commercetools composable commerce via SDK.
- CTP_CLIENT_SECRET: The client secret of commercetools composable commerce user account. It is used in commercetools client to communicate with commercetools composable commerce via SDK.
- CTP_SCOPE: The scope constrains the endpoints to which the commercetools client has access, as well as the read/write access right to an endpoint.
- CTP_REGION: As the commercetools composable commerce APIs are provided in six different region, it defines the region which your commercetools composable commerce user account belongs to.
- TAX_PROVIDER_API_TOKEN: It defines the API token provided by the external system, which is used to access their API from the connector application.

## Recommendations
#### Implement your own test cases
We have provided sample unit and integration test cases with [sinon](https://sinonjs.org/), [Jest](https://jestjs.io/) and [supertest](https://github.com/ladjs/supertest#readme). The implementation is under `test` folder in both `tax-calculator` and `order-syncer` modules. It is recommended to implement further test cases based on your own needs to test your development. 