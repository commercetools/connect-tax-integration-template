import { expect, describe, it } from '@jest/globals';

import sinon from 'sinon'
import { syncHandler } from '../../src/controllers/sync.controller.js'
import { HTTP_STATUS_BAD_REQUEST } from '../../src/constants/http.status.constants.js'
const sandbox = sinon.createSandbox()

describe('sync.controller.spec', () => {
    afterEach(() => {
        sandbox.restore()
    })

    it(`should returns 400 HTTP status when message data from incoming event message.`, async () => {
        const mockRequest = { method: 'POST' ,
            url: '/',
        body: {
            message : {}
        }}
        const mockResponse = {
            status: () => {
                return {
                    send: () => {
                    }
                }
            }
        }
        const responseStatusSpy = sandbox.spy(mockResponse, 'status')

        await syncHandler(mockRequest, mockResponse )
        expect(responseStatusSpy.firstCall.firstArg).toEqual(HTTP_STATUS_BAD_REQUEST)

    })
})