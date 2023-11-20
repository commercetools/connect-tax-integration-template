import _ from 'lodash';
import { logger } from '../utils/logger.utils.js';
import {
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_SERVER_ERROR,
  HTTP_STATUS_SUCCESS_ACCEPTED,
} from '../constants/http.status.constants.js';
import CustomError from '../errors/custom.error.js';

export const taxHandler = async (request, response) => {
  let calculation;

  const cartRequestBody = request.body;
  if (_.isEmpty(cartRequestBody)) {
    return response
      .status(HTTP_STATUS_BAD_REQUEST)
      .send(
        new CustomError(
          HTTP_STATUS_BAD_REQUEST,
          'Missing cart information in the request body.'
        )
      );
  }

  try {
    // Implement tax calculation. For reference, Check the branch in this git repo: stripe-implementation
    calculation = {};
  } catch (err) {
    logger.error(err);
    if (err.statusCode) return response.status(err.statusCode).send(err);
    return response.status(HTTP_STATUS_SERVER_ERROR).send(err);
  }

  return response.status(HTTP_STATUS_SUCCESS_ACCEPTED).send(calculation);
};
