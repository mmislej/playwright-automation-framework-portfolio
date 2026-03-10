import { test as base, mergeTests } from '@playwright/test';
import { ApiClient } from '../utils/ApiClient';
import { TestDataFactory } from '../utils/TestDataFactory';
import { test as pageManagerTest } from './pageManagerFixture';

type ApiClientFixture = {
  apiClient: ApiClient;
  authenticatedUser: { email: string; password: string; name: string };
};

const apiTest = base.extend<ApiClientFixture>({
  apiClient: async ({ request }, use) => {
    await use(new ApiClient(request));
  },

  authenticatedUser: async ({ apiClient }, use) => {
    const { name, email } = TestDataFactory.createSignupInfo();
    const { password } = TestDataFactory.createAccountInfo();
    const address = TestDataFactory.createAddressInfo();

    await apiClient.createAccount({
      name,
      email,
      password,
      title: 'Mr',
      birth_date: '1',
      birth_month: '1',
      birth_year: '1990',
      firstname: address.firstName,
      lastname: address.lastName,
      address1: address.address,
      country: address.country,
      state: address.state,
      city: address.city,
      zipcode: address.zipcode,
      mobile_number: address.mobileNumber,
    });

    await use({ email, password, name });

    await apiClient.deleteAccount(email, password).catch(() => {
      // Account may have been deleted by the test itself (e.g. TC16)
    });
  },
});

export const test = mergeTests(pageManagerTest, apiTest);
export { expect } from '@playwright/test';
