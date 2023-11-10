import { createApiRoot } from './create.client.js';
import CustomError from '../errors/custom.error.js';
import { HTTP_STATUS_SUCCESS_ACCEPTED } from '../constants/http.status.constants.js';
const queryArgs = {
  withTotal: false,
  expand: ['cart'],
};

export async function getCartByOrderId(orderId) {
  return await createApiRoot()
    .orders()
    .withId({
      ID: Buffer.from(orderId).toString(),
    })
    .get({ queryArgs })
    .execute()
    .then((response) => response.body?.cart.obj)
    .catch((error) => {
      throw new CustomError(HTTP_STATUS_SUCCESS_ACCEPTED, error.message, error);
    });
}
