import { createApiRoot } from '../clients/create.client.js';
import { createChangedOrderSubscription } from './action.js';

const CONNECT_GCP_TOPIC_NAME_KEY = 'CONNECT_GCP_TOPIC_NAME';
const CONNECT_GCP_PROJECT_ID_KEY = 'CONNECT_GCP_PROJECT_ID';
const CTP_ORDER_CHANGE_SUBSCRIPTION_KEY = 'CTP_ORDER_CHANGE_SUBSCRIPTION_KEY';

async function postDeploy(properties) {
  const topicName = properties.get(CONNECT_GCP_TOPIC_NAME_KEY);
  const projectId = properties.get(CONNECT_GCP_PROJECT_ID_KEY);
  const ctpOrderChangeSubscriptionKey = properties.get(CTP_ORDER_CHANGE_SUBSCRIPTION_KEY);

  const apiRoot = createApiRoot();
  await createChangedOrderSubscription(apiRoot, topicName, projectId, ctpOrderChangeSubscriptionKey);
}

async function run() {
  try {
    const properties = new Map(Object.entries(process.env));
    await postDeploy(properties);
  } catch (error) {
    process.stderr.write(`Post-deploy failed: ${error.message}\n`);
    process.exitCode = 1;
  }
}

run();
