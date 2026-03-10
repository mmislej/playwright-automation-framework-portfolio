import { Page } from '@playwright/test';

export class SignupPage {

  constructor(
    readonly page: Page,

    // Account Information
    readonly title = page.getByText('Enter Account Information'),
    readonly genderMr = page.getByLabel('Mr.'),
    readonly genderMrs = page.getByLabel('Mrs.'),
    readonly nameInput = page.getByLabel('Name *'),
    readonly emailInput = page.getByLabel('Email *'),
    readonly passwordInput = page.getByLabel('Password *'),
    readonly daysSelect = page.locator('[data-qa="days"]'),
    readonly monthsSelect = page.locator('[data-qa="months"]'),
    readonly yearsSelect = page.locator('[data-qa="years"]'),
    readonly newsletterCheckbox = page.getByLabel('Sign up for our newsletter!'),
    readonly optinCheckbox = page.getByLabel('Receive special offers from our partners!'),

    // Address Information
    readonly firstNameInput = page.locator('[data-qa="first_name"]'),
    readonly lastNameInput = page.locator('[data-qa="last_name"]'),
    readonly companyInput = page.locator('[data-qa="company"]'),
    readonly addressInput = page.locator('[data-qa="address"]'),
    readonly address2Input = page.locator('[data-qa="address2"]'),
    readonly countrySelect = page.locator('[data-qa="country"]'),
    readonly stateInput = page.locator('[data-qa="state"]'),
    readonly cityInput = page.locator('[data-qa="city"]'),
    readonly zipcodeInput = page.locator('[data-qa="zipcode"]'),
    readonly mobileNumberInput = page.locator('[data-qa="mobile_number"]'),
    readonly createAccountButton = page.getByRole('button', { name: 'Create Account' }),
    readonly accountCreatedTitle = page.getByText('Account Created!'),
    readonly continueButton = page.getByRole('link', { name: 'Continue' }),
  ) {}

  async fillAccountInfo(data: {
    gender?: 'Mr' | 'Mrs';
    password: string;
    day: string;
    month: string;
    year: string;
    newsletter?: boolean;
    optin?: boolean;
  }) {
    if (data.gender === 'Mrs') await this.genderMrs.check();
    else await this.genderMr.check();

    await this.passwordInput.fill(data.password);
    await this.daysSelect.selectOption(data.day);
    await this.monthsSelect.selectOption(data.month);
    await this.yearsSelect.selectOption(data.year);

    if (data.newsletter) await this.newsletterCheckbox.check();
    if (data.optin) await this.optinCheckbox.check();
  }

  async fillAddressInfo(data: {
    firstName: string;
    lastName: string;
    company?: string;
    address: string;
    address2?: string;
    country: string;
    state: string;
    city: string;
    zipcode: string;
    mobileNumber: string;
  }) {
    await this.firstNameInput.fill(data.firstName);
    await this.lastNameInput.fill(data.lastName);
    if (data.company) await this.companyInput.fill(data.company);
    await this.addressInput.fill(data.address);
    if (data.address2) await this.address2Input.fill(data.address2);
    await this.countrySelect.selectOption(data.country);
    await this.stateInput.fill(data.state);
    await this.cityInput.fill(data.city);
    await this.zipcodeInput.fill(data.zipcode);
    await this.mobileNumberInput.fill(data.mobileNumber);
  }

  async submit() {
    await this.createAccountButton.click();
  }
}