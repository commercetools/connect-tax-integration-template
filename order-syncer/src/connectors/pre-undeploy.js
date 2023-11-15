import { createApiRoot } from '../clients/create.client.js';
import { CTP_ORDER_CHANGE_SUBSCRIPTION_KEY } from '../constants/connectors.constants.js';
import { deleteChangedOrderSubscription } from './actions.js';

async function preUndeploy() {
  const apiRoot = createApiRoot();
  await deleteChangedOrderSubscription(
    apiRoot,
    CTP_ORDER_CHANGE_SUBSCRIPTION_KEY
  );
}

async function run() {
  try {
    await preUndeploy();
  } catch (error) {
    process.stderr.write(`Post-undeploy failed: ${error.message}\n`);
    process.exitCode = 1;
  }
}

run();
