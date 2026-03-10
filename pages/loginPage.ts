import { Page, Locator } from '@playwright/test';

export class LoginPage {

  constructor(
    readonly page: Page,
    readonly emailInput = page.getByPlaceholder('Email Address').first(),
    readonly passwordInput = page.getByPlaceholder('Password'),
    readonly loginButton = page.getByRole('button', { name: 'Login' }),
    readonly signupNameInput = page.getByPlaceholder('Name'),
    readonly signupEmailInput = page.locator('[data-qa="signup-email"]'),
    readonly signupButton = page.getByRole('button', { name: 'Signup' }),
    readonly loginErrorMessage = page.getByText('Your email or password is incorrect!'),
    readonly signupErrorMessage = page.getByText('Email Address already exist!'),
    readonly newUserSignupTitle = page.getByText('New User Signup!'),
  ) {}

  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async signup(name: string, email: string) {
    await this.signupNameInput.fill(name);
    await this.signupEmailInput.fill(email);
    await this.signupButton.click();
  }
}