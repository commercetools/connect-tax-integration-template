import { createApiRoot } from '../clients/create.client.js';
import { createCTPExtension } from './action.js';
import {
  CONNECT_SERVICE_URL,
  CTP_TAX_CALCULATOR_EXTENSION_KEY,
} from './constants.js';

async function postDeploy(properties) {
  //The URL of deployed connector could be obtained via env-var CONNECT_SERVICE_URL after deployment.
  const ctpExtensionBaseUrl = properties.get(CONNECT_SERVICE_URL);

  const apiRoot = createApiRoot();
  await createCTPExtension(
    apiRoot,
    CTP_TAX_CALCULATOR_EXTENSION_KEY,
    ctpExtensionBaseUrl
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
