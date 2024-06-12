import {expect, describe, it, jest} from '@jest/globals';
import configUtil from '../../src/utils/config.util.js';
import { HTTP_STATUS_SUCCESS_ACCEPTED } from '../../src/constants/http.status.constants.js';
import {taxHandler} from "../../src/controllers/tax.calculator.controller.js";

describe('tax-calculator.controller.spec', () => {
  it(`should return 400 HTTP status when message data is missing in incoming event message.`, async () => {
    const dummyConfig = {
      clientId: 'dummy-ctp-client-id',
      clientSecret: 'dummy-ctp-client-secret',
      projectKey: 'dummy-ctp-project-key',
      scope: 'dummy-ctp-scope',
      region: 'dummy-ctp-region',
    };

    jest
        .spyOn(configUtil, "readConfiguration")
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
    await taxHandler(mockRequest, mockResponse);
    expect(responseStatusSpy).toBeCalledWith(HTTP_STATUS_SUCCESS_ACCEPTED);
  });

});
