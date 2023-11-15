import _ from 'lodash'
import { serializeError } from 'serialize-error'
import configUtils from '../utils/config.util.js';
import { logger } from "../utils/logger.utils.js";

export async function createCTPExtension(
  apiRoot,
  ctpTaxCalculatorExtensionKey,
  ctpExtensionBaseUrl
) {

  const apiExtensionTemplate = await configUtils.readAndParseJsonFile(
      'resources/api-extension.json',
  )
  try {
    const extensionDraft = JSON.parse(
        _.template(JSON.stringify(apiExtensionTemplate))({
          ctpTaxCalculatorExtensionKey,
          ctpExtensionBaseUrl,
        }),
    )

    const existingExtension = await fetchExtensionByKey(
        apiRoot,
        apiExtensionTemplate.key,
    )
    if (existingExtension === null) {
      await apiRoot.create(apiRoot.builder.extensions, extensionDraft)
      logger.info(
          'Successfully created an API extension for payment resource type ' +
          `(key=${apiExtensionTemplate.key})`,
      )
    } else {
      const actions = buildUpdateActions(existingExtension, extensionDraft)
      if (actions.length > 0) {
        await apiRoot.update(
            apiRoot.builder.extensions,
            existingExtension.id,
            existingExtension.version,
            actions,
        )
        logger.info(
            'Successfully updated the API extension for payment resource type ' +
            `(key=${apiExtensionTemplate.key})`,
        )
      }
    }
  } catch (err) {
    throw Error(
        `Failed to sync API extension (key=${apiExtensionTemplate.key}). ` +
        `Error: ${JSON.stringify(serializeError(err))}`,
    )
  }
}

  function buildUpdateActions(existingExtension, extensionDraft) {
    const actions = []
    if (!_.isEqual(existingExtension.destination, extensionDraft.destination))
      actions.push({
        action: 'changeDestination',
        destination: extensionDraft.destination,
      })

    if (!_.isEqual(existingExtension.triggers, extensionDraft.triggers))
      actions.push({
        action: 'changeTriggers',
        triggers: extensionDraft.triggers,
      })

    return actions
  }

  async function fetchExtensionByKey(apiRoot, key) {
    try {
      const {body} = await apiRoot
          .extensions()
          .get({
            queryArgs: {
              where: `key = "${key}"`,
            },
          })
          .execute();
      return body
    } catch (err) {
      if (err.statusCode === 404) return null
      throw err
    }
  }

export async function deleteCTPExtension(
    apiRoot,
    ctpTaxCalculatorExtensionKey
) {
  const existingExtension = await fetchExtensionByKey(
      apiRoot,
      ctpTaxCalculatorExtensionKey,
  )
  if (existingExtension !== null) {
    await apiRoot
        .extension()
        .withKey({key: ctpTaxCalculatorExtensionKey})
        .delete({
          queryArgs: {
            version: existingExtension.version,
          },
        })
        .execute();
  } else {
    logger.info('No API extension found for the given key ' + `(key=${ctpTaxCalculatorExtensionKey})`)
  }
}

