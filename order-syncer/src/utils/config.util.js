import CustomError from '../errors/custom.error.js';
import envValidators from '../validators/env-var.validator.js';
import { getValidateMessages } from '../validators/helpers.validator.js';

/**
 * Read the configuration env vars
 * (Add yours accordingly)
 *
 * @returns The configuration with the correct env vars
 */
export default function readConfiguration() {
  const envVars = {
    clientId: process.env.CTP_CLIENT_ID,
    clientSecret: process.env.CTP_CLIENT_SECRET,
    projectKey: process.env.CTP_PROJECT_KEY,
    scope: process.env.CTP_SCOPE,
    region: process.env.CTP_REGION,
  };
  console.log(envVars.clientId===undefined)
  console.log(envVars.clientSecret===undefined)
  console.log(envVars.projectKey===undefined)
  console.log(envVars.scope===undefined)
  console.log(envVars.region===undefined)

  const validationErrors = getValidateMessages(envValidators, envVars);

  if (validationErrors.length) {
    throw new CustomError(
      'InvalidEnvironmentVariablesError',
      'Invalid Environment Variables please check your .env file',
      validationErrors
    );
  }

  return envVars;
}
