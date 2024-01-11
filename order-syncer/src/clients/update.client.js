import { createApiRoot } from './create.client.js';
import CustomError from '../errors/custom.error.js';
import { HTTP_STATUS_SUCCESS_ACCEPTED } from '../constants/http.status.constants.js';

export async function updateOrder(actions, order) {
  return await createApiRoot()
    .orders()
    .withId({
      ID: Buffer.from(order.id).toString(),
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
