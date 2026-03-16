import { test } from '../../fixtures/requestHandlerFixture';
import { expect } from '../../utils/customExpects';
import { TestDataFactory } from '../../utils/testDataFactory';

test.describe('Auth API', () => {

  test('TC7 - POST verifyLogin with valid credentials returns 200', async ({ api }) => {
    const signup = TestDataFactory.createSignupInfo();
    const account = TestDataFactory.createAccountInfo();
    const address = TestDataFactory.createAddressInfo();

    await api.path('/createAccount').body({
      name: signup.name, email: signup.email, password: account.password,
      title: account.gender, birth_date: account.day, birth_month: account.month, birth_year: account.year,
      firstname: address.firstName, lastname: address.lastName, company: address.company,
      address1: address.address, address2: address.address2, country: address.country,
      state: address.state, city: address.city, zipcode: address.zipcode, mobile_number: address.mobileNumber,
    }).postRequest(200);

    const body = await api
      .path('/verifyLogin')
      .body({ email: signup.email, password: account.password })
      .postRequest(200);

    await expect(body).shouldMatchSchema('verifyLogin', 'POST_verifyLogin');
    expect(body.message).shouldEqual('User exists!');

    await api.path('/deleteAccount').body({ email: signup.email, password: account.password }).deleteRequest(200);
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
      .body({ email: 'invalid@notexist.com', password: 'wrongpassword' })
      .postRequest(200);

    await expect(body).shouldMatchSchema('verifyLogin', 'POST_verifyLogin');
    expect(body.responseCode).shouldEqual(404);
    expect(body.message).shouldEqual('User not found!');
  });

  test('TC11 - POST createAccount returns 201', async ({ api }) => {
    const signup = TestDataFactory.createSignupInfo();
    const account = TestDataFactory.createAccountInfo();
    const address = TestDataFactory.createAddressInfo();

    const body = await api.path('/createAccount').body({
      name: signup.name, email: signup.email, password: account.password,
      title: account.gender, birth_date: account.day, birth_month: account.month, birth_year: account.year,
      firstname: address.firstName, lastname: address.lastName, company: address.company,
      address1: address.address, address2: address.address2, country: address.country,
      state: address.state, city: address.city, zipcode: address.zipcode, mobile_number: address.mobileNumber,
    }).postRequest(200);

    await expect(body).shouldMatchSchema('createAccount', 'POST_createAccount');
    expect(body.responseCode).shouldEqual(201);
    expect(body.message).shouldEqual('User created!');

    await api.path('/deleteAccount').body({ email: signup.email, password: account.password }).deleteRequest(200);
  });

  test('TC12 - DELETE deleteAccount returns 200', async ({ api }) => {
    const signup = TestDataFactory.createSignupInfo();
    const account = TestDataFactory.createAccountInfo();
    const address = TestDataFactory.createAddressInfo();

    await api.path('/createAccount').body({
      name: signup.name, email: signup.email, password: account.password,
      title: account.gender, birth_date: account.day, birth_month: account.month, birth_year: account.year,
      firstname: address.firstName, lastname: address.lastName, company: address.company,
      address1: address.address, address2: address.address2, country: address.country,
      state: address.state, city: address.city, zipcode: address.zipcode, mobile_number: address.mobileNumber,
    }).postRequest(200);

    const body = await api
      .path('/deleteAccount')
      .body({ email: signup.email, password: account.password })
      .deleteRequest(200);

    await expect(body).shouldMatchSchema('deleteAccount', 'DELETE_deleteAccount');
    expect(body.responseCode).shouldEqual(200);
    expect(body.message).shouldEqual('Account deleted!');
  });

  test('TC13 - PUT updateAccount returns 200', async ({ api }) => {
    const signup = TestDataFactory.createSignupInfo();
    const account = TestDataFactory.createAccountInfo();
    const address = TestDataFactory.createAddressInfo();

    await api.path('/createAccount').body({
      name: signup.name, email: signup.email, password: account.password,
      title: account.gender, birth_date: account.day, birth_month: account.month, birth_year: account.year,
      firstname: address.firstName, lastname: address.lastName, company: address.company,
      address1: address.address, address2: address.address2, country: address.country,
      state: address.state, city: address.city, zipcode: address.zipcode, mobile_number: address.mobileNumber,
    }).postRequest(200);

    const updatedAddress = TestDataFactory.createAddressInfo();
    const body = await api.path('/updateAccount').body({
      name: signup.name, email: signup.email, password: account.password,
      title: account.gender, birth_date: account.day, birth_month: account.month, birth_year: account.year,
      firstname: updatedAddress.firstName, lastname: updatedAddress.lastName, company: updatedAddress.company,
      address1: updatedAddress.address, address2: updatedAddress.address2, country: updatedAddress.country,
      state: updatedAddress.state, city: updatedAddress.city, zipcode: updatedAddress.zipcode, mobile_number: updatedAddress.mobileNumber,
    }).putRequest(200);

    await expect(body).shouldMatchSchema('updateAccount', 'PUT_updateAccount');
    expect(body.responseCode).shouldEqual(200);
    expect(body.message).shouldEqual('User updated!');

    await api.path('/deleteAccount').body({ email: signup.email, password: account.password }).deleteRequest(200);
  });

  test('TC14 - GET getUserDetailByEmail returns 200 with user data', async ({ api }) => {
    const signup = TestDataFactory.createSignupInfo();
    const account = TestDataFactory.createAccountInfo();
    const address = TestDataFactory.createAddressInfo();

    await api.path('/createAccount').body({
      name: signup.name, email: signup.email, password: account.password,
      title: account.gender, birth_date: account.day, birth_month: account.month, birth_year: account.year,
      firstname: address.firstName, lastname: address.lastName, company: address.company,
      address1: address.address, address2: address.address2, country: address.country,
      state: address.state, city: address.city, zipcode: address.zipcode, mobile_number: address.mobileNumber,
    }).postRequest(200);

    const body = await api
      .path('/getUserDetailByEmail')
      .params({ email: signup.email })
      .getRequest(200);

    await expect(body).shouldMatchSchema('getUserDetailByEmail', 'GET_getUserDetailByEmail');
    expect(body.user.email).shouldEqual(signup.email);
    expect(body.user.name).shouldEqual(signup.name);

    await api.path('/deleteAccount').body({ email: signup.email, password: account.password }).deleteRequest(200);
  });

});
