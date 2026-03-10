import { Page } from '@playwright/test';

export class CartPage {

  constructor(
    readonly page: Page,

    // Cart table
    readonly cartTable = page.getByRole('table'),
    readonly cartRows = page.locator('#cart_info_table tbody tr'),
    readonly emptyCartMessage = page.getByText('Cart is empty!'),
    readonly proceedToCheckoutButton = page.getByText('Proceed To Checkout'),
    readonly registerLoginLink = page.getByRole('link', { name: 'Register / Login' }),

    // Subscription (footer)
    readonly subscriptionTitle = page.locator('h2', { hasText: 'Subscription' }),
    readonly subscriptionEmail = page.getByPlaceholder('Your email address'),
    readonly subscriptionButton = page.locator('#subscribe'),
    readonly subscriptionSuccess = page.locator('.alert-success'),

    // Dynamic locators per row
    readonly cartRowByIndex = (index: number) => cartRows.nth(index),
    readonly cartProductName = (index: number) => cartRowByIndex(index).getByRole('link').last(),
    readonly cartProductPrice = (index: number) => cartRowByIndex(index).locator('.cart_price p'),
    readonly cartProductQuantity = (index: number) => cartRowByIndex(index).locator('.cart_quantity button'),
    readonly cartProductTotal = (index: number) => cartRowByIndex(index).locator('.cart_total_price'),
    readonly cartDeleteButton = (index: number) => cartRowByIndex(index).locator('.cart_quantity_delete'),
  ) {}

  async goto() {
    await this.page.goto('/view_cart');
  }

  async removeProduct(index: number) {
    await this.cartDeleteButton(index).click();
  }

  async proceedToCheckout() {
    await this.proceedToCheckoutButton.click();
  }

  async getProductCount(): Promise<number> {
    return await this.cartRows.count();
  }

  async subscribe(email: string) {
    await this.subscriptionEmail.fill(email);
    await this.subscriptionButton.click();
  }
}