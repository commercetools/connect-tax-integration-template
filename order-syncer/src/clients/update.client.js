import { createApiRoot } from './create.client.js';
import CustomError from '../errors/custom.error.js';
import { HTTP_STATUS_SUCCESS_ACCEPTED } from '../constants/http.status.constants.js';
import { getOrder } from './query.client.js';

export async function updateOrder(actions, orderId) {
  const order = await getOrder(orderId);
  return await createApiRoot()
    .orders()
    .withId({
      ID: order.id,
    })
    .post({
      body: {
        actions: actions,
        version: order.version,
      },
    })
    .execute()
    .catch((error) => {
      throw new CustomError(HTTP_STATUS_SUCCESS_ACCEPTED, error.message, error);
    });
}
