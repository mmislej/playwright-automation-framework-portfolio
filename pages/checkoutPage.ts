import { Page } from '@playwright/test';

export class CheckoutPage {

  constructor(
    readonly page: Page,

    // Checkout page
    readonly addressDelivery = page.locator('#address_delivery'),
    readonly addressBilling = page.locator('#address_invoice'),
    readonly commentArea = page.locator('textarea.form-control'),
    readonly placeOrderButton = page.getByRole('link', { name: 'Place Order' }),

    // Payment page
    readonly nameOnCard = page.locator('[data-qa="name-on-card"]'),
    readonly cardNumber = page.locator('[data-qa="card-number"]'),
    readonly cvc = page.locator('[data-qa="cvc"]'),
    readonly expiryMonth = page.locator('[data-qa="expiry-month"]'),
    readonly expiryYear = page.locator('[data-qa="expiry-year"]'),
    readonly payButton = page.locator('[data-qa="pay-button"]'),

    // Order confirmation
    readonly orderSuccessMessage = page.getByText('Congratulations! Your order has been confirmed!'),
    readonly downloadInvoice = page.getByRole('link', { name: 'Download Invoice' }),
    readonly continueButton = page.getByRole('link', { name: 'Continue' }),
  ) {}

  async goto() {
    await this.page.goto('/checkout');
  }

  async fillPayment(data: { name: string; cardNumber: string; cvc: string; expiryMonth: string; expiryYear: string }) {
    await this.nameOnCard.fill(data.name);
    await this.cardNumber.fill(data.cardNumber);
    await this.cvc.fill(data.cvc);
    await this.expiryMonth.fill(data.expiryMonth);
    await this.expiryYear.fill(data.expiryYear);
  }

  async placeOrder(comment: string) {
    await this.commentArea.fill(comment);
    await this.placeOrderButton.click();
  }
}
