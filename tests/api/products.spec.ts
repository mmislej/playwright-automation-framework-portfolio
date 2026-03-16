import { test } from '../../fixtures/requestHandlerFixture';
import { expect } from '../../utils/customExpects';

test.describe('Products API', () => {

  test('TC1 - GET productsList returns 200 with non-empty list', async ({ api }) => {
    const body = await api
      .path('/productsList')
      .getRequest(200);

    await expect(body).shouldMatchSchema('productsList', 'GET_productsList');
    expect(body.products).shouldBeDefined();
    expect(body.products.length).shouldBeGreaterThan(0);
  });

  test('TC2 - POST productsList returns 405 method not supported', async ({ api }) => {
    const body = await api
      .path('/productsList')
      .postRequest(200);

    await expect(body).shouldMatchSchema('productsList', 'POST_productsList');
    expect(body.responseCode).shouldEqual(405);
    expect(body.message).shouldEqual('This request method is not supported.');
  });

  test('TC3 - GET brandsList returns 200 with non-empty list', async ({ api }) => {
    const body = await api
      .path('/brandsList')
      .getRequest(200);

    await expect(body).shouldMatchSchema('brandsList', 'GET_brandsList');
    expect(body.brands).shouldBeDefined();
    expect(body.brands.length).shouldBeGreaterThan(0);
  });

  test('TC4 - PUT brandsList returns 405 method not supported', async ({ api }) => {
    const body = await api
      .path('/brandsList')
      .putRequest(200);

    await expect(body).shouldMatchSchema('brandsList', 'PUT_brandsList');
    expect(body.responseCode).shouldEqual(405);
    expect(body.message).shouldEqual('This request method is not supported.');
  });

  test('TC5 - GET productsList contains product Men Tshirt', async ({ api }) => {
    const body = await api
      .path('/productsList')
      .getRequest(200);

    await expect(body).shouldMatchSchema('productsList', 'GET_productsList');
    const found = body.products.some((p: any) => p.name === 'Men Tshirt');
    expect(found).shouldEqual(true);
  });

  test('TC6 - POST searchProduct without parameter returns 400', async ({ api }) => {
    const body = await api
      .path('/searchProduct')
      .postRequest(200);

    await expect(body).shouldMatchSchema('searchProduct', 'POST_searchProduct');
    expect(body.responseCode).shouldEqual(400);
    expect(body.message).shouldEqual('Bad request, search_product parameter is missing in POST request.');
  });

});
