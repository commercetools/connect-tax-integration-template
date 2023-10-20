import Stripe from 'stripe';
import { loadConfig } from "../configurations/config.js";

var stripeClient

function createClient() {
  console.log('=== createClient ===')
  const apiToken = loadConfig().taxProviderApiToken;
  return new Stripe('kkkk');
}

export default async function createTaxTransaction(order, cart) {
  console.log('=== createTaxTransaction ===')
  if (!stripeClient)
    stripeClient = createClient();
  const account = await stripeClient.accounts.retrieve().catch(error => console.log(error))
  console.log(account.id)
  // const calculationId = cart?.custom?.fields?.taxProviderReference;
  // if (calculationId) {
  //   const txnCreateFromCalculationParams = {
  //     calculation: calculationId,
  //     reference: order.id,
  //   };
  //   const stripeClient = createClient();
  //   await stripeClient.tax.transactions.createFromCalculation(
  //     txnCreateFromCalculationParams
  //   );
  // } else {
  //   throw new Error('Missing calculation ID.');
  // }
}
