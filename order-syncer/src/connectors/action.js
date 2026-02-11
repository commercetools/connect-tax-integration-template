import { MESSAGE_TYPE } from '../constants/connectors.constants.js';
import { assertNonNullable } from '../utils/assert.util.js';

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

function buildDestination(config) {
  assertNonNullable(
    config.connectSubscriptionDestination,
    'CONNECT_SUBSCRIPTION_DESTINATION is required'
  );

  switch (config.connectSubscriptionDestination) {
    case 'GoogleCloudPubSub':
      assertNonNullable(
        config.connectGcpTopicName,
        'CONNECT_GCP_TOPIC_NAME is required for GCP destination'
      );
      assertNonNullable(
        config.connectGcpProjectId,
        'CONNECT_GCP_PROJECT_ID is required for GCP destination'
      );
      return {
        type: 'GoogleCloudPubSub',
        topic: config.connectGcpTopicName,
        projectId: config.connectGcpProjectId,
      };
    case 'SNS':
      assertNonNullable(
        config.connectAwsTopicArn,
        'CONNECT_AWS_TOPIC_ARN is required for SNS destination'
      );
      return {
        type: 'SNS',
        topicArn: config.connectAwsTopicArn,
        authenticationMode: 'IAM',
      };
    default:
      throw new Error(
        `Unsupported subscription destination: ${config.connectSubscriptionDestination}. Valid options are 'GoogleCloudPubSub' or 'SNS'.`
      );
  }
}

export async function createSubscription(
  apiRoot,
  config,
  ctpOrderChangeSubscriptionKey
) {
  await deleteChangedOrderSubscription(apiRoot, ctpOrderChangeSubscriptionKey);

  const destination = buildDestination(config);

  await apiRoot
    .subscriptions()
    .post({
      body: {
        key: ctpOrderChangeSubscriptionKey,
        destination,
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
