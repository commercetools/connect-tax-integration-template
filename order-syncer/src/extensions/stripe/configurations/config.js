export function loadConfig() {
  try {
    return {
      taxProviderApiToken : process.env.TAX_PROVIDER_API_TOKEN
    };
  } catch (e) {
    throw new Error(
      'Tax provider API token is not provided.'
    );
  }
}

