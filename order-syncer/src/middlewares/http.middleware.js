import readConfiguration from '../utils/config.util.js';

/**
 * Configure Middleware. Example only. Adapt on your own
 */

export const getHttpMiddlewareOptions = () => {
  return {
    host: `https://api.${readConfiguration().region}.commercetools.com`,
  };
};
