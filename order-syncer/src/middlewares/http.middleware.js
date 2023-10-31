import readConfiguration from '../utils/config.util.js';

/**
 * Configure Middleware. Example only. Adapt on your own
 */
const config = readConfiguration;
export const httpMiddlewareOptions = {
  host: `https://api.${config.region}.commercetools.com`,
};
