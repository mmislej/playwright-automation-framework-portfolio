import { test } from '../../fixtures/requestHandlerFixture';
import { expect } from '../../utils/customExpects';
import { TestDataFactory } from '../../utils/testDataFactory';

const verifyLoginCases = [
  {
    desc: 'missing email returns 400',
    body: { password: 'somepassword' },
    responseCode: 400,
    message: 'Bad request, email or password parameter is missing in POST request.',
  },
  {
    desc: 'missing password returns 400',
    body: { email: 'someuser@example.com' },
    responseCode: 400,
    message: 'Bad request, email or password parameter is missing in POST request.',
  },
  {
    desc: 'invalid credentials returns 404',
    body: TestDataFactory.verifyLoginRequestBody('invalid@notexist.com', 'wrongpassword'),
    responseCode: 404,
    message: 'User not found!',
  },
];

test.describe('Data Driven Testing Demo - POST /verifyLogin', () => {

  for (const { desc, body, responseCode, message } of verifyLoginCases) {
    test(desc, async ({ api }) => {
      const responseBody = await api
        .path('/verifyLogin')
        .body(body)
        .postRequest(200);

      await expect(responseBody).shouldMatchSchema('verifyLogin', 'POST_verifyLogin');
      expect(responseBody.responseCode).shouldEqual(responseCode);
      expect(responseBody.message).shouldEqual(message);
    });
  }

});
