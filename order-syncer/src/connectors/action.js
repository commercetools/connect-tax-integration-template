import { MESSAGE_TYPE } from '../constants/connectors.constants.js';

export async function deleteChangedOrderSubscription(
  apiRoot,
  ctpOrderChangeSubscriptionKey
) {
  const {
    body: { results: subscriptions },
  } = await apiRoot
    .subscriptions()
    .get({
      queryArgs: {
        where: `key = "${ctpOrderChangeSubscriptionKey}"`,
      },
    })
    .execute();

  if (subscriptions.length > 0) {
    const subscription = subscriptions[0];

    await apiRoot
      .subscriptions()
      .withKey({ key: ctpOrderChangeSubscriptionKey })
      .delete({
        queryArgs: {
          version: subscription.version,
        },
      })
      .execute();
  }
}

export async function createChangedOrderSubscription(
  apiRoot,
  topicName,
  projectId,
  ctpOrderChangeSubscriptionKey
) {
  await deleteChangedOrderSubscription(apiRoot, ctpOrderChangeSubscriptionKey);

  await apiRoot
    .subscriptions()
    .post({
      body: {
        key: ctpOrderChangeSubscriptionKey,
        destination: {
          type: 'GoogleCloudPubSub',
          topic: topicName,
          projectId,
        },
        messages: [
          {
            resourceTypeId: 'order',
            types: MESSAGE_TYPE,
          },
        ],
      },
    })
    .execute();
}
