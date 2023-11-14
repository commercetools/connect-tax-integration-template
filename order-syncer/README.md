# Order Syncer
This module provides an application based on [commercetools Connect](https://docs.commercetools.com/connect), which receives messages from commercetools project once there is an order created. The corresponding order details are then synchronized to the external tax provider.

The module also provides scripts for post-deployment and pre-undeployment action. After deployment via connect service completed, [commercetools Subscription](https://docs.commercetools.com/api/projects/subscriptions) is created by post-deployment script which listen to any order creation in commercetools Project. Once order has been created, the commercetools Subscription sends message to Google Cloud Pub/Sub topic and then notify the order syncer to handle the corresponding changes.

The commercetools Subscription would be cleared once the tax integration connector is undeployed.

## Get started
#### Change the key of commercetools Subscription
Please specify your desired key for creation of commercetools Subscription [here](https://github.com/commercetools/connect-search-ingestion-template/blob/c4f1a3e04988a4a44842d3e1607638c96983ef29/incremental-updater/src/connectors/actions.js#L1).