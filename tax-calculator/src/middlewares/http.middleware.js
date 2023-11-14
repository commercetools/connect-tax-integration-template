import configUtils from '../utils/config.util.js';

/**
 * Configure Middleware. Example only. Adapt on your own
 */
export const httpMiddlewareOptions = {
  host: `https://api.${configUtils.readConfiguration().region}.commercetools.com`,
};
