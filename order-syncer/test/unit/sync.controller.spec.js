import { expect, describe, it } from '@jest/globals';

import sinon from 'sinon';
import { syncHandler } from '../../src/controllers/sync.controller.js';
import { HTTP_STATUS_BAD_REQUEST } from '../../src/constants/http.status.constants.js';
const sandbox = sinon.createSandbox();
import configUtil from '../../src/utils/config.util.js';

describe('sync.controller.spec', () => {
  afterEach(() => {
    sandbox.restore();
  });

  it(`should returns 400 HTTP status when message data is missing in incoming event message.`, async () => {
    const dummyConfig = {
      clientId: 'dummy-ctp-client-id',
      clientSecret: 'dummy-ctp-client-secret',
      projectKey: 'dummy-ctp-project-key',
      scope: 'dummy-ctp-scope',
      region: 'dummy-ctp-region',
    };
    sandbox.stub(configUtil, 'readConfiguration').callsFake(() => {
      return dummyConfig;
    });
    const mockRequest = {
      method: 'POST',
      url: '/',
      body: {
        message: {},
      },
    };
    const mockResponse = {
      status: () => {
        return {
          send: () => {},
        };
      },
    };
    const responseStatusSpy = sandbox.spy(mockResponse, 'status');

    await syncHandler(mockRequest, mockResponse);
    expect(responseStatusSpy.firstCall.firstArg).toEqual(
      HTTP_STATUS_BAD_REQUEST
    );
  });
});
