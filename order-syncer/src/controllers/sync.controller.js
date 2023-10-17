import { logger } from '../utils/logger.util.js';
import { decodeToJson } from '../utils/decoder.util.js';



export const syncHandler = async (request, response) => {
  try {
    console.log('OrderSyncer')
    // Receive the Pub/Sub message
    const encodedMessageBody = request.body.message.data;
    const messageBody = decodeToJson(encodedMessageBody);
    if (messageBody) {
      const notificationType = messageBody.notificationType;
      const productId = messageBody.resource.id;


    }
  } catch (err) {
    logger.error(err);
    if (err.statusCode) return response.status(err.statusCode).send(err);
    return response.status(500).send(err);
  }

  // Return the response for the client
  return response.status(200).send();
};
