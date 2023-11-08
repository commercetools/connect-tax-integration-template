import readConfiguration from '../utils/config.util.js';

/**
 * Configure Middleware. Example only. Adapt on your own
 */
const config = readConfiguration();

export const authMiddlewareOptions = {
  host: `https://auth.${config.region}.commercetools.com`,
  projectKey: config.projectKey,
  credentials: {
    clientId: config.clientId,
    clientSecret: config.clientSecret,
  },
  scopes: [config.scope ? config.scope : 'default'],
};
