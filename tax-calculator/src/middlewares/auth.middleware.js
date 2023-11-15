import configUtils from '../utils/config.util.js';

const config = configUtils.readConfiguration();

/**
 * Configure Middleware. Example only. Adapt on your own
 */
export const authMiddlewareOptions = {
  host: `https://auth.${config.region}.commercetools.com`,
  projectKey: config.projectKey,
  credentials: {
    clientId: config.clientId,
    clientSecret: config.clientSecret,
  },
  scopes: [config.scope ? config.scope : 'default'],
};
