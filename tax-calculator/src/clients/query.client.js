import { createApiRoot } from './create.client.js';
import CustomError from '../errors/custom.error.js';
import { HTTP_STATUS_RESOURCE_NOT_FOUND } from '../constants/http.status.constants.js';

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
        throw new CustomError(
            HTTP_STATUS_RESOURCE_NOT_FOUND,
            `Bad request: ${error.message}`,
            error
        );
      });
}
