import { expect, describe, it, afterEach} from '@jest/globals';

import sinon from 'sinon';
import { syncHandler } from '../../src/controllers/sync.controller.js';
import { HTTP_STATUS_BAD_REQUEST } from '../../src/constants/http.status.constants.js';
import * as ConfigUtil from '../../src/utils/config.util.js';

describe('sync.controller.spec', () => {
  afterEach(() => {
    sinon.restore();
  });

  it(`should return 400 HTTP status when message data is missing in incoming event message.`, async () => {
    const dummyConfig = {
      clientId: 'dummy-ctp-client-id',
      clientSecret: 'dummy-ctp-client-secret',
      projectKey: 'dummy-ctp-project-key',
      scope: 'dummy-ctp-scope',
      region: 'dummy-ctp-region',
    };

    sinon.stub(ConfigUtil, 'default').callsFake(() => {
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
    const responseStatusSpy = sinon.spy(mockResponse, 'status');

    await syncHandler(mockRequest, mockResponse);
    expect(responseStatusSpy.firstCall.firstArg).toEqual(
      HTTP_STATUS_BAD_REQUEST
    );
  });
});
