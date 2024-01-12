export function loadConfig() {
  if (process.env.TAX_PROVIDER_API_TOKEN) {
    return {
      taxProviderApiToken: process.env.TAX_PROVIDER_API_TOKEN,
    };
  } else {
    throw new Error('Tax provider API token is not provided.');
  }
}
