import { expect, describe, afterAll, it } from '@jest/globals';
import request from 'supertest';
import server from '../../src/index.js';
import {HTTP_STATUS_BAD_REQUEST, HTTP_STATUS_SUCCESS_ACCEPTED} from '../../src/constants/http.status.constants.js';
import { createApiRoot } from "../../src/clients/create.client.js";
import cartRequestPayload from "./../../resources/cartRequest.json" assert { type: 'json' };

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

  it(`When payload body exists with correct cart information, 
                it should returns actionItems to update the cart`, async () => {
    let response = {};

    response = await request(server).post(`/taxCalculator`).send(cartRequestPayload);

    expect(response).toBeDefined();
    expect(response.statusCode).toEqual(HTTP_STATUS_SUCCESS_ACCEPTED);
    expect(response.body.actions).toBeDefined();
  });



  // Disabled because Needs Environment variables and update the cartId from your CTP project
  xit(`Test against CTP Project`, async () => {
    let response = {};
    const {  body: cartRequestPayload } = await createApiRoot()
        .carts()
        .withId({ID: 'a29b2d3d-42a4-444d-8666-3b385e9a967c'})
        .get()
        .execute();

    response = await request(server).post(`/taxCalculator`).send(cartRequestPayload);

    expect(response).toBeDefined();
    expect(response.statusCode).toEqual(HTTP_STATUS_SUCCESS_ACCEPTED);
    expect(response.body.amount_total).toEqual(cartRequestPayload.totalPrice.centAmount);
    expect(response.body.tax_breakdown[0].taxability_reason).toEqual('not_subject_to_tax');
  });


  afterAll(() => {
    // Enable the function below to close the application on server once all test cases are executed.

    if (server) {
      server.close();
    }
  });
});
