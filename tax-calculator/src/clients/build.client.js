import { ClientBuilder } from '@commercetools/sdk-client-v2';
import { getAuthMiddlewareOptions } from '../middlewares/auth.middleware.js';
import { getHttpMiddlewareOptions } from '../middlewares/http.middleware.js';
import configUtils from '../utils/config.util.js';

/**
 * Create a new client builder.
 * This code creates a new client builder that can be used to make API calls
 */
export const createClient = () =>
  new ClientBuilder()
    .withProjectKey(configUtils.readConfiguration().projectKey)
    .withClientCredentialsFlow(getAuthMiddlewareOptions())
    .withHttpMiddleware(getHttpMiddlewareOptions())
    .build();
