import { test as base } from '@playwright/test';
import { TestDataFactory } from '../utils/testDataFactory';

type TestDataFixtures = {
  signupData: {
    signup: ReturnType<typeof TestDataFactory.createSignupInfo>;
    account: ReturnType<typeof TestDataFactory.createAccountInfo>;
    address: ReturnType<typeof TestDataFactory.createAddressInfo>;
  };
  loginData: ReturnType<typeof TestDataFactory.createLoginInfo>;
};

export const test = base.extend<TestDataFixtures>({
  signupData: async ({}, use) => {
    await use({
      signup: TestDataFactory.createSignupInfo(),
      account: TestDataFactory.createAccountInfo(),
      address: TestDataFactory.createAddressInfo(),
    });
  },

  loginData: async ({}, use) => {
    await use(TestDataFactory.createLoginInfo());
  },
});

export { expect } from '@playwright/test';
