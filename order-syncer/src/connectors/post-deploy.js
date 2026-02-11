import { createApiRoot } from '../clients/create.client.js';
import { createSubscription } from './action.js';
import { CTP_ORDER_CHANGE_SUBSCRIPTION_KEY } from '../constants/connectors.constants.js';
import readConfiguration from '../utils/config.util.js';

async function postDeploy() {
  const config = readConfiguration();
  const apiRoot = createApiRoot();
  await createSubscription(apiRoot, config, CTP_ORDER_CHANGE_SUBSCRIPTION_KEY);
}

async function run() {
  try {
    await postDeploy();
  } catch (error) {
    process.stderr.write(`Post-deploy failed: ${error.message}\n`);
    process.exitCode = 1;
  }
}

run();
