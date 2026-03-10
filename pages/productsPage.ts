import { Page } from '@playwright/test';

export class ProductsPage {

  constructor(
    readonly page: Page,
    readonly searchInput = page.getByPlaceholder('Search Product'),
    readonly searchButton = page.locator('#submit_search'),
    readonly productsList = page.locator('.features_items .col-sm-4'),
    readonly allProductsTitle = page.getByRole('heading', { name: 'All Products' }),
    readonly searchedProductsTitle = page.getByRole('heading', { name: 'Searched Products' }),
    readonly categoryTitle = page.locator('.features_items h2.title'),
    readonly brandsList = page.locator('.brands_products .brands-name li'),
    readonly brandLink = (index: number) => page.locator('.brands_products .brands-name li').nth(index).locator('a'),
    readonly brandTitle = page.locator('.features_items h2.title'),
    readonly continueShoppingButton = page.getByRole('button', { name: 'Continue Shopping' }),
    readonly viewCartLink = page.getByRole('link', { name: 'View Cart' }),
    readonly productCard = (index: number) => productsList.nth(index),
    readonly productAddToCart = (index: number) => productCard(index).locator('.add-to-cart').first(),
    readonly productViewLink = (index: number) => productCard(index).locator('a[href^="/product_details"]'),
    readonly productName = (index: number) => productCard(index).locator('.productinfo p'),
    readonly productPrice = (index: number) => productCard(index).locator('.productinfo h2'),

    // Product detail page
    readonly reviewTitle = page.locator('a', { hasText: 'Write Your Review' }),
    readonly reviewName = page.locator('#name'),
    readonly reviewEmail = page.locator('#email'),
    readonly reviewText = page.locator('#review'),
    readonly reviewSubmit = page.locator('#button-review'),
    readonly reviewSuccess = page.locator('.alert-success', { hasText: 'Thank you for your review' }),
    readonly detailName = page.locator('.product-information h2'),
    readonly detailCategory = page.locator('.product-information p').filter({ hasText: 'Category' }),
    readonly detailPrice = page.locator('.product-information span span'),
    readonly detailAvailability = page.locator('.product-information p').filter({ hasText: 'Availability' }),
    readonly detailCondition = page.locator('.product-information p').filter({ hasText: 'Condition' }),
    readonly detailBrand = page.locator('.product-information p').filter({ hasText: 'Brand' }),
    readonly detailQuantity = page.locator('#quantity'),
    readonly detailAddToCart = page.locator('button.btn-default.cart'),
    readonly detailViewCart = page.locator('#cartModal').getByRole('link', { name: 'View Cart' }),
  ) {}

  async goto() {
    await this.page.goto('/products');
  }

  async searchProduct(productName: string) {
    await this.searchInput.fill(productName);
    await this.searchButton.click();
  }

  async addProductToCart(index: number) {
    await this.productCard(index).hover();
    await this.productAddToCart(index).click();
  }

  async viewProduct(index: number) {
    await this.productViewLink(index).click();
  }
}