import Stripe from 'stripe';
import { loadConfig } from '../configurations/config.js';

var stripeClient;

function createClient() {
  const apiToken = loadConfig().taxProviderApiToken;
  return new Stripe(apiToken);
}

export default async function createTaxTransaction(orderId, cart) {
  if (!stripeClient) stripeClient = createClient();

  const calculationId = cart?.custom?.fields?.taxProviderReference;
  if (calculationId) {
    const txnCreateFromCalculationParams = {
      calculation: calculationId,
      reference: orderId,
    };
    const stripeClient = createClient();
    await stripeClient.tax.transactions.createFromCalculation(
      txnCreateFromCalculationParams
    );
  } else {
    throw new Error('Missing calculation ID.');
  }
}
