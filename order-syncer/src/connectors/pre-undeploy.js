import { createApiRoot } from '../clients/create.client.js';
import { CTP_ORDER_CHANGE_SUBSCRIPTION_KEY } from '../constants/connectors.constants.js';
import { deleteChangedOrderSubscription } from './actions.js';

async function preUndeploy(properties) {
  const apiRoot = createApiRoot();
  const ctpOrderChangeSubscriptionKey = properties.get(
    CTP_ORDER_CHANGE_SUBSCRIPTION_KEY
  );
  await deleteChangedOrderSubscription(apiRoot, ctpOrderChangeSubscriptionKey);
}

async function run() {
  try {
    const properties = new Map(Object.entries(process.env));
    await preUndeploy(properties);
  } catch (error) {
    process.stderr.write(`Post-undeploy failed: ${error.message}\n`);
    process.exitCode = 1;
  }
}

run();
