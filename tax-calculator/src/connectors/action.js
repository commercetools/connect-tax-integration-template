import _ from 'lodash';
import { serializeError } from 'serialize-error';
import { logger } from '../utils/logger.utils.js';
import extensionTemplate from "./../../resources/api-extension.json" assert { type: 'json' };

export async function createCTPExtension(
  apiRoot,
  ctpTaxCalculatorExtensionKey,
  ctpExtensionBaseUrl
) {
  try {
    const extensionDraft = JSON.parse(
      _.template(JSON.stringify(extensionTemplate))({
        ctpTaxCalculatorExtensionKey,
        ctpExtensionBaseUrl,
      })
    );

    logger.info(`Connect tax-integration deployment service url: ${ctpExtensionBaseUrl} `)

    const response = await fetchExtensionByKey(
      apiRoot,
      ctpTaxCalculatorExtensionKey
    );
    const existingExtension = response?.results;
    if (existingExtension?.length) {
      const updateActions = buildUpdateActions(existingExtension[0], extensionDraft);
      if (updateActions.length > 0) {
        await apiRoot
            .extensions()
            .withId({ ID: existingExtension[0].id })
            .post({
              body: {
                actions: updateActions,
                version: existingExtension[0].version,
              },
            })
            .execute();
        logger.info(
            'Successfully updated the API extension for payment resource type ' +
            `key=${ctpTaxCalculatorExtensionKey}`
        );
      } else {
        logger.info('No update actions found to update CTP Extension ' +
            `key=${ctpTaxCalculatorExtensionKey}` );
      }
    } else {
      await apiRoot.extensions().post({ body: extensionDraft}).execute();
      logger.info(
          'Successfully created an API extension for payment resource type ' +
          `key=${ctpTaxCalculatorExtensionKey}`
      );
    }
  } catch (err) {
    throw Error(
      `Failed to sync API extension (key=${ctpTaxCalculatorExtensionKey}). ` +
        `Error: ${JSON.stringify(serializeError(err))}`
    );
  }
}

function buildUpdateActions(existingExtension, extensionDraft) {
  const actions = [];
  if (!_.isEqual(existingExtension.destination, extensionDraft.destination))
    actions.push({
      action: 'changeDestination',
      destination: extensionDraft.destination,
    });

  if (!_.isEqual(existingExtension.triggers, extensionDraft.triggers))
    actions.push({
      action: 'changeTriggers',
      triggers: extensionDraft.triggers,
    });

  return actions;
}

async function fetchExtensionByKey(apiRoot, key) {
  try {
    const { body } = await apiRoot
      .extensions()
      .get({
        queryArgs: {
          where: `key = "${key}"`,
        },
      })
      .execute();
    return body;
  } catch (err) {
    if (err.statusCode === 404) return null;
    throw err;
  }
}

export async function deleteCTPExtension(
  apiRoot,
  ctpTaxCalculatorExtensionKey
) {
  const existingExtension = await fetchExtensionByKey(
    apiRoot,
    ctpTaxCalculatorExtensionKey
  );
  if (existingExtension !== null) {
    await apiRoot
      .extension()
      .withKey({ key: ctpTaxCalculatorExtensionKey })
      .delete({
        queryArgs: {
          version: existingExtension.version,
        },
      })
      .execute();
  } else {
    logger.info(
      'No API extension found for the given key ' +
        `(key=${ctpTaxCalculatorExtensionKey})`
    );
  }
}
