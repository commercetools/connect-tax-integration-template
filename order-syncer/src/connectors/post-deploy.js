import { createApiRoot } from '../clients/create.client.js';
import { createChangedOrderSubscription } from './action.js';
import { CTP_ORDER_CHANGE_SUBSCRIPTION_KEY } from '../constants/connectors.constants.js';
const CONNECT_GCP_TOPIC_NAME_KEY = 'CONNECT_GCP_TOPIC_NAME';
const CONNECT_GCP_PROJECT_ID_KEY = 'CONNECT_GCP_PROJECT_ID';

async function postDeploy(properties) {
  const topicName = properties.get(CONNECT_GCP_TOPIC_NAME_KEY);
  const projectId = properties.get(CONNECT_GCP_PROJECT_ID_KEY);

  const apiRoot = createApiRoot();
  await createChangedOrderSubscription(
    apiRoot,
    topicName,
    projectId,
    CTP_ORDER_CHANGE_SUBSCRIPTION_KEY
  );
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
