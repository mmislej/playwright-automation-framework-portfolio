import { faker } from '@faker-js/faker';

export class TestDataFactory {

  static createAccountInfo() {
    return {
      gender: faker.helpers.arrayElement(['Mr', 'Mrs'] as const),
      password: faker.internet.password({ length: 12 }),
      day: faker.number.int({ min: 1, max: 28 }).toString(),
      month: faker.number.int({ min: 1, max: 12 }).toString(),
      year: faker.number.int({ min: 1950, max: 2005 }).toString(),
      newsletter: faker.datatype.boolean(),
      optin: faker.datatype.boolean(),
    };
  }

  static createAddressInfo() {
    return {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      company: faker.company.name(),
      address: faker.location.streetAddress(),
      address2: faker.location.secondaryAddress(),
      country: faker.helpers.arrayElement([
        'India', 'United States', 'Canada', 'Australia',
        'Israel', 'New Zealand', 'Singapore',
      ]),
      state: faker.location.state(),
      city: faker.location.city(),
      zipcode: faker.location.zipCode(),
      mobileNumber: faker.phone.number(),
    };
  }

  static createSignupInfo() {
    return {
      name: faker.person.fullName(),
      email: faker.internet.email(),
    };
  }

  static createLoginInfo() {
    return {
      email: faker.internet.email(),
      password: faker.internet.password({ length: 12 }),
    };
  }

  static createContactInfo() {
    return {
      subject: faker.lorem.sentence({ min: 3, max: 6 }),
      message: faker.lorem.paragraph(),
    };
  }

  static createPaymentInfo() {
    return {
      name: faker.person.fullName(),
      cardNumber: faker.finance.creditCardNumber('################'),
      cvc: faker.finance.creditCardCVV(),
      expiryMonth: faker.number.int({ min: 1, max: 12 }).toString().padStart(2, '0'),
      expiryYear: faker.number.int({ min: 2026, max: 2035 }).toString(),
    };
  }

  static createAccountRequestBody() {
    const signup = this.createSignupInfo();
    const account = this.createAccountInfo();
    const address = this.createAddressInfo();
    return {
      name: signup.name, email: signup.email, password: account.password,
      title: account.gender, birth_date: account.day, birth_month: account.month, birth_year: account.year,
      firstname: address.firstName, lastname: address.lastName, company: address.company,
      address1: address.address, address2: address.address2, country: address.country,
      state: address.state, city: address.city, zipcode: address.zipcode, mobile_number: address.mobileNumber,
    };
  }

  static verifyLoginRequestBody(email: string, password: string) {
    return { email, password };
  }

  static deleteAccountRequestBody(email: string, password: string) {
    return { email, password };
  }

  static updateAccountRequestBody(accountBody: ReturnType<typeof TestDataFactory.createAccountRequestBody>) {
    const newAddress = this.createAddressInfo();
    return {
      ...accountBody,
      firstname: newAddress.firstName, lastname: newAddress.lastName, company: newAddress.company,
      address1: newAddress.address, address2: newAddress.address2, country: newAddress.country,
      state: newAddress.state, city: newAddress.city, zipcode: newAddress.zipcode, mobile_number: newAddress.mobileNumber,
    };
  }
}