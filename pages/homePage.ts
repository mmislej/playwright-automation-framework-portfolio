import { Page } from '@playwright/test';

export class HomePage {

  constructor(
    readonly page: Page,

    // Navbar
    readonly logo = page.getByRole('link', { name: 'Website for automation practice' }),
    readonly navHome = page.getByRole('link', { name: 'Home' }),
    readonly navProducts = page.getByRole('link', { name: 'Products' }),
    readonly navCart = page.getByRole('link', { name: 'Cart' }).first(),
    readonly navLogin = page.getByRole('link', { name: 'Signup / Login' }),
    readonly navLogout = page.getByRole('link', { name: 'Logout' }),
    readonly navDelete = page.getByRole('link', { name: 'Delete Account' }),
    readonly navContactUs = page.getByRole('link', { name: 'Contact us' }),
    readonly navTestCases = page.locator('li a[href="/test_cases"]').first(),
    readonly loggedInAs = page.getByText(/Logged in as/),

    // Categories
    readonly categoryWomen = page.locator('a[href="#Women"]'),
    readonly categoryMen = page.locator('a[href="#Men"]'),
    readonly categoryKids = page.locator('a[href="#Kids"]'),
    readonly categoryLink = (href: string) => page.locator(`a[href="${href}"]`),

    // Featured products
    readonly featuredItems = page.locator('.features_items .col-sm-4'),
    readonly featuredProductCard = (index: number) => featuredItems.nth(index),
    readonly featuredProductName = (index: number) => featuredProductCard(index).locator('.productinfo p'),
    readonly featuredProductPrice = (index: number) => featuredProductCard(index).locator('.productinfo h2'),
    readonly featuredAddToCart = (index: number) => featuredProductCard(index).locator('.add-to-cart').first(),
    readonly featuredViewProduct = (index: number) => featuredProductCard(index).locator('a[href^="/product_details"]'),

    // Recommended items
    readonly recommendedTitle = page.locator('h2', { hasText: 'recommended items' }),
    readonly recommendedItems = page.locator('#recommended-item-carousel .item.active'),
    readonly recommendedAddToCart = (index: number) => recommendedItems.locator('.add-to-cart').nth(index),

    // Cart modal
    readonly continueShoppingButton = page.getByRole('button', { name: 'Continue Shopping' }),
    readonly viewCartModalLink = page.getByRole('link', { name: 'View Cart' }),

    // Subscription
    readonly subscriptionTitle = page.locator('h2', { hasText: 'Subscription' }),
    readonly subscriptionEmail = page.getByPlaceholder('Your email address'),
    readonly subscriptionButton = page.locator('#subscribe'),
    readonly subscriptionSuccess = page.locator('.alert-success'),

    // Scroll
    readonly scrollUpButton = page.locator('#scrollUp'),

    // Account actions
    readonly accountDeletedTitle = page.getByText('Account Deleted!'),
    readonly continueButton = page.getByRole('link', { name: 'Continue' }),
  ) {}

  async goto() {
    await this.page.goto('/');
    await this.page.keyboard.press('Escape');
  }

  async addFeaturedToCart(index: number) {
    await this.featuredProductCard(index).hover();
    await this.featuredAddToCart(index).click();
  }

  async subscribe(email: string) {
    await this.subscriptionEmail.fill(email);
    await this.subscriptionButton.click();
  }

  async navigateToCategory(href: string) {
    await this.categoryLink(href).click();
  }
}