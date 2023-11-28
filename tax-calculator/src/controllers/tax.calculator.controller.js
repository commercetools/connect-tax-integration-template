import _ from 'lodash';
import stripe from 'stripe';
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

  const taxRequest = mapCartRequestToTaxRequest(cartRequestBody);
  try {

    const stripeInstance = new stripe('sk_test_51O0LZcHv2XDZJhXBlX6nug97JaQ4Xry6D809YqY3Jea5Ubs5DFgBwsmmjas6FOZwf9WVmZ4AUWJCDKGPc5iWPApA00MViLnZZf')

    calculation = await stripeInstance.tax.calculations.create(taxRequest);
  } catch (err) {
    logger.error(err);
    if (err.statusCode) return response.status(err.statusCode).send(err);
    return response.status(HTTP_STATUS_SERVER_ERROR).send(err);
  }

  return response.status(HTTP_STATUS_SUCCESS_ACCEPTED).send(calculation);
};

function mapCartRequestToTaxRequest(cartRequest) {
  let taxRequest = {customer_details: {address: {}}, line_items: []};

  taxRequest.currency = cartRequest.totalPrice.currencyCode;
  taxRequest.customer_details.address.country = cartRequest.country;

  const cartShippingAddress = cartRequest.shipping[0];
  taxRequest.customer_details.address.postal_code = cartShippingAddress?.postal_code ? cartShippingAddress.postal_code: 12345;
  taxRequest.customer_details.address.line1 = cartShippingAddress?.shippingAddress.streetName;
  taxRequest.customer_details.address_source = 'shipping';

  for (const cartLineItem of cartRequest.lineItems) {

    let lineItemData= {};
    lineItemData.amount = cartLineItem.totalPrice?.centAmount;
    lineItemData.reference = cartLineItem.name['en-US'];

    taxRequest.line_items.push(lineItemData);
  }

  return taxRequest;
}
