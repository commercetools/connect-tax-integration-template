import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'node:fs/promises';
import CustomError from '../errors/custom.error.js';
import envValidators from '../validators/env-var.validators.js';
import { getValidateMessages } from '../validators/helpers.validators.js';

/**
 * Read the configuration env vars
 * (Add yours accordingly)
 *
 * @returns The configuration with the correct env vars
 */

function readConfiguration() {
  const envVars = {
    clientId: process.env.CTP_CLIENT_ID,
    clientSecret: process.env.CTP_CLIENT_SECRET,
    projectKey: process.env.CTP_PROJECT_KEY,
    scope: process.env.CTP_SCOPE,
    region: process.env.CTP_REGION,
  };

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

async function readAndParseJsonFile(pathToJsonFileFromProjectRoot) {
  const currentFilePath = fileURLToPath(__filename);
  const currentDirPath = path.dirname(currentFilePath);
  const projectRoot = path.resolve(currentDirPath, '..');
  const pathToFile = path.resolve(projectRoot, pathToJsonFileFromProjectRoot);
  const fileContent = await fs.readFile(pathToFile);
  return JSON.parse(fileContent);
}

export default {
  readConfiguration,
  readAndParseJsonFile,
};
