import { logger } from '../utils/logger.utils.js';
const stripe = require('stripe')

export const taxHandler = async (request, response) => {
  let calculation;
  try {
    const cart = request.body.message.data;
    calculation = await stripe.tax.calculations.create(cart);

  } catch (err) {
    logger.error(err);
    if (err.statusCode) return response.status(err.statusCode).send(err);
    return response.status(500).send(err);
  }

  return response.status(200).send(calculation);
};
