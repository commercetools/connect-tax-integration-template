import { createApiRoot } from '../clients/create.client.js';
import { deleteCTPExtension } from './action.js';
import { CTP_TAX_CALCULATOR_EXTENSION_KEY } from './constants.js';

async function preUndeploy() {
  const apiRoot = createApiRoot();
  await deleteCTPExtension(apiRoot, CTP_TAX_CALCULATOR_EXTENSION_KEY);
}

async function run() {
  try {
    await preUndeploy();
  } catch (error) {
    process.stderr.write(`Pre-undeploy failed: ${error.message}\n`);
    process.exitCode = 1;
  }
}

run();
