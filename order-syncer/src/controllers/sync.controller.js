import { logger } from '../utils/logger.util.js';
import { doValidation } from '../validators/order-change.validators.js';
import { decodeToJson } from '../utils/decoder.util.js';
import { getCartByOrderId } from '../clients/query.client.js';
import {
  HTTP_STATUS_SUCCESS_NO_CONTENT,
  HTTP_STATUS_SERVER_ERROR,
} from '../constants/http.status.constants.js';
import createTaxTransaction from '../extensions/stripe/clients/client.js';
import CustomError from '../errors/custom.error.js';
import { HTTP_STATUS_SUCCESS_ACCEPTED } from '../constants/http.status.constants.js';

async function syncToTaxProvider(orderId, cart) {
  await createTaxTransaction(orderId, cart).catch((error) => {
    throw new CustomError(
      HTTP_STATUS_SUCCESS_ACCEPTED,
      `Error from extension : ${error.message}`,
      error
    );
  });
}

export const syncHandler = async (request, response) => {
  try {
    // Receive the Pub/Sub message
    const encodedMessageBody = request.body.message.data;
    const messageBody = decodeToJson(encodedMessageBody);
    doValidation(messageBody);

    const orderId = messageBody?.resource?.id;

    if (orderId) {
      const cart = await getCartByOrderId(orderId);
      if (cart) {
        await syncToTaxProvider(orderId, cart);
      }
    }
  } catch (err) {
    logger.error(err);
    if (err.statusCode) return response.status(err.statusCode).send(err);
    return response.status(HTTP_STATUS_SERVER_ERROR).send(err);
  }

  // Return the response for the client
  return response.status(HTTP_STATUS_SUCCESS_NO_CONTENT).send();
};
