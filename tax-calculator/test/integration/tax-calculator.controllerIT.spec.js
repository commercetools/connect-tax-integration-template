import { expect, describe, afterAll, it } from '@jest/globals';
import request from 'supertest';
import server from '../../src/index.js';
import {HTTP_STATUS_BAD_REQUEST, HTTP_STATUS_SUCCESS_ACCEPTED} from '../../src/constants/http.status.constants.js';

/** Reminder : Please put mandatory environment variables in the settings of your github repository **/
describe('Test tax-calculator.controller.js', () => {
  it(`When resource identifier is absent in URL, it should return 404 http status`, async () => {
    let response = {};
    // Send request to the connector application with following code snippet.

    response = await request(server).post(`/`);
    expect(response).toBeDefined();
    expect(response.statusCode).toEqual(404);
  });

  it(`When payload body does not exist, it should returns 400 http status`, async () => {
    let response = {};
    // Send request to the connector application with following code snippet.
    let payload = {};
    response = await request(server).post(`/taxCalculator`).send(payload);

    expect(response).toBeDefined();
    expect(response.statusCode).toEqual(HTTP_STATUS_BAD_REQUEST);
  });

  it(`When payload body exists without correct cart information, it should returns 400 http status`, async () => {
    let response = {};
    let payload = {};
    response = await request(server).post(`/taxCalculator`).send(payload);

    expect(response).toBeDefined();
    expect(response.statusCode).toEqual(HTTP_STATUS_BAD_REQUEST);
  });

  xit(`When payload body exists with correct cart information, it should returns calculated tax`, async () => {
    let response = {};
    const cartRequestPayload = {
      "type": "Cart",
      "id": "5dacd609-f79d-4db5-8501-af12f28b8eda",
      "version": 25,
      "lineItems": [
        {
          "id": "5e2c8458-74b3-47cc-a9eb-a9e88671f713",
          "productId": "e4a679f3-e8f2-4b3d-bc51-2a48ae411794",
          "name": {
            "en-US": "SwiftTech RapidType Keyboard and Mouse Kit ",
            "sv-SE": "SwiftTech RapidType Keyboard and Mouse Kit "
          },
          "totalPrice": {
            "type": "centPrecision",
            "currencyCode": "EUR",
            "centAmount": 34500,
            "fractionDigits": 2
          }
        },
        {
          "id": "87838704-5aec-41ed-9147-7b9a20f45f18",
          "productId": "3fe060ce-5aec-409b-81d1-12e5d8c961b3",
          "name": {
            "en-US": "Lenovo Ideapad 3 (2022) 15.6\" Laptop",
            "sv-SE": "Lenovo Ideapad 3 (2022) 15.6\" Laptop"
          },
          "totalPrice": {
            "type": "centPrecision",
            "currencyCode": "EUR",
            "centAmount": 79000,
            "fractionDigits": 2
          }
        }
      ],
      "totalPrice": {
        "type": "centPrecision",
        "currencyCode": "EUR",
        "centAmount": 113500,
        "fractionDigits": 2
      },
      "country": "DE",
      "shipping": [{
        "key": "shippingKey",
        "postal_code": 12345,
        "shippingAddress": {
          "country": "DE",
          "streetName": "testStreet"
        }
      }]
    }

    response = await request(server).post(`/taxCalculator`).send(cartRequestPayload);

    expect(response).toBeDefined();
    expect(response.statusCode).toEqual(HTTP_STATUS_SUCCESS_ACCEPTED);
    expect(response.body.amount_total).toEqual(cartRequestPayload.totalPrice.centAmount);
    expect(response.body.tax_breakdown[0].taxability_reason).toEqual('not_collecting');
  });

  afterAll(() => {
    // Enable the function below to close the application on server once all test cases are executed.

    if (server) {
      server.close();
    }
  });
});
