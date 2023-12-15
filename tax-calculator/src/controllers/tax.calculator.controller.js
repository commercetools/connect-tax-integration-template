import _ from 'lodash';
import stripe from 'stripe';
import { logger } from '../utils/logger.utils.js';
import {
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_SERVER_ERROR,
  HTTP_STATUS_SUCCESS_ACCEPTED,
} from '../constants/http.status.constants.js';
import CustomError from '../errors/custom.error.js';
import configUtils from '../utils/config.util.js';
import { createApiRoot } from "../clients/create.client.js";

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
        const stripeInstance = new stripe(configUtils.readConfiguration().stripeApiToken);

        calculation = await stripeInstance.tax.calculations.create(taxRequest);

        await setCustomField(cartRequestBody.id, calculation);
    } catch (err) {
        logger.error(err);
        if (err.statusCode) return response.status(err.statusCode).send(err);
        return response.status(HTTP_STATUS_SERVER_ERROR).send(err);
    }

    return response.status(HTTP_STATUS_SUCCESS_ACCEPTED).send(calculation);
};

function mapCartRequestToTaxRequest(cartRequest) {
    let taxRequest = {customer_details: {address: {}}, line_items: []};

    taxRequest.currency = cartRequest.totalPrice?.currencyCode;
    taxRequest.customer_details.address.country = cartRequest.country;

    let cartShippingAddress = {};
    if(cartRequest.shippingMode === 'Single'){
        cartShippingAddress = cartRequest.shippingAddress;
    } else {
        cartShippingAddress = cartRequest.shipping[0]?.shippingAddress;
    }
    taxRequest.customer_details.address.postal_code = cartShippingAddress.postal_code;
    taxRequest.customer_details.address.line1 = cartShippingAddress.streetName;
    taxRequest.customer_details.address_source = 'shipping';

    for (const cartLineItem of cartRequest.lineItems) {

        let lineItemData = {};
        lineItemData.amount = cartLineItem.totalPrice?.centAmount;
        lineItemData.reference = cartLineItem.name['en-US'];

        taxRequest.line_items.push(lineItemData);
    }

    return taxRequest;
}

async function setCustomField(cartId, calculation) {

  const { body } = await createApiRoot()
      .carts()
      .withId({ID: cartId})
      .get()
      .execute();

    const customTypeUpdateAction = [{
      action: "setCustomType",
      type: {
        key: "cart-tax-calculation",
        typeId: "type"
      },
      fields: {
        taxCalculationReference: calculation.id
      }
    }];

    return await createApiRoot()
        .carts()
        .withId({ID: cartId})
        .post({
          body: {
            actions: customTypeUpdateAction,
            version: body.version,
          },
        })
        .execute()
        .catch((error) => {
            throw new CustomError(HTTP_STATUS_SERVER_ERROR, error.message, error);
        });
}
