import {expect, describe, it, jest} from '@jest/globals';
import {HTTP_STATUS_SUCCESS_ACCEPTED} from '../../src/constants/http.status.constants.js';
import {syncHandler} from "../../src/controllers/sync.controller.js";
import readConfiguration from "../../src/utils/config.util.js";
import * as ConfigUtil from '../../src/utils/config.util.js';

describe('sync.controller.spec', () => {
  it(`should return 400 HTTP status when message data is missing in incoming event message.`, async () => {
    const dummyConfig = {
      clientId: 'dummy-ctp-client-id',
      clientSecret: 'dummy-ctp-client-secret',
      projectKey: 'dummy-ctp-project-key',
      scope: 'dummy-ctp-scope',
      region: 'dummy-ctp-region',
    };

    jest
        .spyOn(ConfigUtil, "default")
        .mockImplementation(({ success }) => success(dummyConfig));

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

    const responseStatusSpy = jest.spyOn(mockResponse, 'status')
    await syncHandler(mockRequest, mockResponse);
    expect(responseStatusSpy).toBeCalledWith(HTTP_STATUS_SUCCESS_ACCEPTED);

  });
});
