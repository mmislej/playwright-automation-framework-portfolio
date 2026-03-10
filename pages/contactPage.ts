import { Page } from '@playwright/test';

export class ContactPage {

  constructor(
    readonly page: Page,
    readonly contactUsTitle = page.getByText('Get In Touch'),
    readonly successMessage = page.locator('.status.alert-success'),
    readonly nameInput = page.locator('#contact-us-form input[name="name"]'),
    readonly emailInput = page.locator('#contact-us-form input[name="email"]'),
    readonly subjectInput = page.locator('#contact-us-form input[name="subject"]'),
    readonly messageInput = page.locator('#contact-us-form textarea#message'),
    readonly fileUpload = page.locator('#contact-us-form input[name="upload_file"]'),
    readonly submitButton = page.locator('#contact-us-form input[name="submit"]'),
  ) {}

  async goto() {
    await this.page.goto('/contact_us');
  }

  async fillForm(data: { name: string; email: string; subject: string; message: string }) {
    await this.nameInput.waitFor({ state: 'visible' });
    await this.nameInput.click();
    await this.nameInput.pressSequentially(data.name, { delay: 50 });
    await this.emailInput.click();
    await this.emailInput.pressSequentially(data.email, { delay: 50 });
    await this.subjectInput.click();
    await this.subjectInput.pressSequentially(data.subject, { delay: 50 });
    await this.messageInput.click();
    await this.messageInput.pressSequentially(data.message, { delay: 50 });
  }

  async uploadFile(filePath: string) {
    await this.fileUpload.setInputFiles(filePath);
  }

  async submit() {
    this.page.once('dialog', dialog => dialog.accept());
    await this.submitButton.click({ force: true });
  }
}
