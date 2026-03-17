import { test } from '../../fixtures/requestHandlerFixture';
import { expect } from '../../utils/customExpects';
import { TestDataFactory } from '../../utils/testDataFactory';

test.describe('Auth API', () => {

  test('TC7 - POST verifyLogin with valid credentials returns 200', async ({ api }) => {
    const accountBody = TestDataFactory.createAccountRequestBody();
    await api.path('/createAccount').body(accountBody).postRequest(200);

    const body = await api
      .path('/verifyLogin')
      .body(TestDataFactory.verifyLoginRequestBody(accountBody.email, accountBody.password))
      .postRequest(200);

    await expect(body).shouldMatchSchema('verifyLogin', 'POST_verifyLogin');
    expect(body.message).shouldEqual('User exists!');

    await api.path('/deleteAccount').body(TestDataFactory.deleteAccountRequestBody(accountBody.email, accountBody.password)).deleteRequest(200);
  });

  test('TC8 - POST verifyLogin without email returns 400', async ({ api }) => {
    const body = await api
      .path('/verifyLogin')
      .body({ password: 'somepassword' })
      .postRequest(200);

    await expect(body).shouldMatchSchema('verifyLogin', 'POST_verifyLogin');
    expect(body.responseCode).shouldEqual(400);
    expect(body.message).shouldEqual('Bad request, email or password parameter is missing in POST request.');
  });

  test('TC9 - DELETE verifyLogin returns 405', async ({ api }) => {
    const body = await api
      .path('/verifyLogin')
      .deleteRequest(200);

    await expect(body).shouldMatchSchema('verifyLogin', 'DELETE_verifyLogin');
    expect(body.responseCode).shouldEqual(405);
    expect(body.message).shouldEqual('This request method is not supported.');
  });

  test('TC10 - POST verifyLogin with invalid credentials returns 404', async ({ api }) => {
    const body = await api
      .path('/verifyLogin')
      .body(TestDataFactory.verifyLoginRequestBody('invalid@notexist.com', 'wrongpassword'))
      .postRequest(200);

    await expect(body).shouldMatchSchema('verifyLogin', 'POST_verifyLogin');
    expect(body.responseCode).shouldEqual(404);
    expect(body.message).shouldEqual('User not found!');
  });

  test('TC11 - POST createAccount returns 201', async ({ api }) => {
    const accountBody = TestDataFactory.createAccountRequestBody();

    const body = await api.path('/createAccount').body(accountBody).postRequest(200);

    await expect(body).shouldMatchSchema('createAccount', 'POST_createAccount');
    expect(body.responseCode).shouldEqual(201);
    expect(body.message).shouldEqual('User created!');

    await api.path('/deleteAccount').body(TestDataFactory.deleteAccountRequestBody(accountBody.email, accountBody.password)).deleteRequest(200);
  });

  test('TC12 - DELETE deleteAccount returns 200', async ({ api }) => {
    const accountBody = TestDataFactory.createAccountRequestBody();
    await api.path('/createAccount').body(accountBody).postRequest(200);

    const body = await api
      .path('/deleteAccount')
      .body(TestDataFactory.deleteAccountRequestBody(accountBody.email, accountBody.password))
      .deleteRequest(200);

    await expect(body).shouldMatchSchema('deleteAccount', 'DELETE_deleteAccount');
    expect(body.responseCode).shouldEqual(200);
    expect(body.message).shouldEqual('Account deleted!');
  });

  test('TC13 - PUT updateAccount returns 200', async ({ api }) => {
    const accountBody = TestDataFactory.createAccountRequestBody();
    await api.path('/createAccount').body(accountBody).postRequest(200);

    const body = await api
      .path('/updateAccount')
      .body(TestDataFactory.updateAccountRequestBody(accountBody))
      .putRequest(200);

    await expect(body).shouldMatchSchema('updateAccount', 'PUT_updateAccount');
    expect(body.responseCode).shouldEqual(200);
    expect(body.message).shouldEqual('User updated!');

    await api.path('/deleteAccount').body(TestDataFactory.deleteAccountRequestBody(accountBody.email, accountBody.password)).deleteRequest(200);
  });

  test('TC14 - GET getUserDetailByEmail returns 200 with user data', async ({ api }) => {
    const accountBody = TestDataFactory.createAccountRequestBody();
    await api.path('/createAccount').body(accountBody).postRequest(200);

    const body = await api
      .path('/getUserDetailByEmail')
      .params({ email: accountBody.email })
      .getRequest(200);

    await expect(body).shouldMatchSchema('getUserDetailByEmail', 'GET_getUserDetailByEmail');
    expect(body.user.email).shouldEqual(accountBody.email);
    expect(body.user.name).shouldEqual(accountBody.name);

    await api.path('/deleteAccount').body(TestDataFactory.deleteAccountRequestBody(accountBody.email, accountBody.password)).deleteRequest(200);
  });

});
