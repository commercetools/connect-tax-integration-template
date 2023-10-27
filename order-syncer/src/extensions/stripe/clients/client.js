import Stripe from 'stripe';
import { loadConfig } from '../configurations/config.js';

var stripeClient;

function createClient() {
  const apiToken = loadConfig().taxProviderApiToken;
  return new Stripe(apiToken);
}

export default async function createTaxTransaction(orderId, cart) {
  if (!stripeClient) stripeClient = createClient();

  const calculationId = cart?.custom?.fields?.taxCalculationReference;
  if (calculationId) {
    const txnCreateFromCalculationParams = {
      calculation: calculationId,
      reference: orderId,
    };
    await stripeClient.tax.transactions.createFromCalculation(
      txnCreateFromCalculationParams
    );
  } else {
    throw new Error('Missing calculation ID.');
  }
}
