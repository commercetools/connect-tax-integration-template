import _ from 'lodash';
import stripe from 'stripe';
import {logger} from '../utils/logger.utils.js';
import {
    HTTP_STATUS_BAD_REQUEST,
    HTTP_STATUS_SERVER_ERROR,
    HTTP_STATUS_SUCCESS_ACCEPTED,
} from '../constants/http.status.constants.js';

import CustomError from '../errors/custom.error.js';
import configUtils from '../utils/config.util.js';

const CTP_TYPE_TAX_TXN_KEY = 'stripe-tax';

export const taxHandler = async (request, response) => {
    let calculation;

    logger.info(`request body: ${JSON.stringify(request.body)}`);
    const cartRequestBody = request.body?.resource?.obj;
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
    let actionItems;
    try {
        const stripeInstance = new stripe(configUtils.readConfiguration().stripeApiToken);
        calculation = await stripeInstance.tax.calculations.create(taxRequest);

        actionItems = await addUpdateCartLineItems(cartRequestBody.id, calculation);
    } catch (err) {
        logger.error(err);
        if (err.statusCode) return response.status(err.statusCode).send(err);
        return response.status(HTTP_STATUS_SERVER_ERROR).send(err);
    }

    return response.status(HTTP_STATUS_SUCCESS_ACCEPTED).send(
        { actions: actionItems }
    );
};

async function addUpdateCartLineItems(cartId, calculation) {
    let actionItems = [];

    actionItems.push({
        action: "setCustomType",
        type: {
            key: `${CTP_TYPE_TAX_TXN_KEY}`,
            typeId: "type"
        },
        fields: {
            taxCalculationReference: calculation.id
        }
    });

    const taxRateDetails = calculation.tax_breakdown[0]?.tax_rate_details;
    const calculatedLineItems = calculation.line_items?.data;
    for (const lineItemTaxData of calculatedLineItems) {
        actionItems.push({
            action: "setLineItemTaxAmount",
            lineItemId: lineItemTaxData.reference,
            externalTaxAmount: {
                totalGross: {
                    currencyCode: calculation.currency?.toUpperCase(),
                    centAmount: lineItemTaxData.amount_tax
                },
                taxRate: {
                    name: taxRateDetails?.tax_type,
                    amount: parseFloat(taxRateDetails?.percentage_decimal),
                    country: taxRateDetails?.country
                }
            }
        });
    }

    return actionItems;
}

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
        lineItemData.reference = cartLineItem.id;

        taxRequest.line_items.push(lineItemData);
    }

    taxRequest.expand = ['line_items']

    return taxRequest;
}
