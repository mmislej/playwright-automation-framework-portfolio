import { test, expect } from '../../fixtures/apiClientFixture';
import { TestDataFactory } from '../../utils/TestDataFactory';

test.describe('Automation Exercise Test Suite', () => {

  test('Test Case 1: Register User', async ({ homePage, loginPage, signupPage }) => {
    test.setTimeout(60000);
    const signup = TestDataFactory.createSignupInfo();
    const account = TestDataFactory.createAccountInfo();
    const address = TestDataFactory.createAddressInfo();

    // Navigate and verify home page
    await homePage.goto();
    await expect(homePage.logo).toBeVisible();

    // Go to Signup / Login and verify
    await homePage.navLogin.click();
    await expect(loginPage.newUserSignupTitle).toBeVisible();

    // Enter name and email, click Signup
    await loginPage.signup(signup.name, signup.email);

    // Verify account information form
    await expect(signupPage.title).toBeVisible();

    // Fill account and address info
    await signupPage.fillAccountInfo(account);
    await signupPage.fillAddressInfo(address);
    await signupPage.submit();

    // Verify account created
    await expect(signupPage.accountCreatedTitle).toBeVisible();
    await signupPage.continueButton.click();

    // Verify logged in
    await expect(homePage.loggedInAs).toBeVisible();

    // Delete account
    await homePage.navDelete.click();
    await expect(homePage.accountDeletedTitle).toBeVisible();
    await homePage.continueButton.click();
  });

  test('Test Case 2: Login User with Correct Credentials', async ({ authenticatedUser, homePage, loginPage }) => {
    const { email, password } = authenticatedUser;

    // Navigate and verify home page
    await homePage.goto();
    await expect(homePage.logo).toBeVisible();

    // Go to login and verify
    await homePage.navLogin.click();
    await expect(loginPage.newUserSignupTitle).toBeVisible();

    // Login with valid credentials
    await loginPage.login(email, password);

    // Verify logged in
    await expect(homePage.loggedInAs).toBeVisible();
    // Teardown handled by authenticatedUser fixture
  });

  test('Test Case 3: Login User with Incorrect Credentials', async ({ homePage, loginPage }) => {
    const { email, password } = TestDataFactory.createLoginInfo();

    // Navigate and verify home page
    await homePage.goto();
    await expect(homePage.logo).toBeVisible();

    // Go to login
    await homePage.navLogin.click();
    await expect(loginPage.newUserSignupTitle).toBeVisible();

    // Login with invalid credentials
    await loginPage.login(email, password);

    // Verify error message
    await expect(loginPage.loginErrorMessage).toBeVisible();
  });

  test('Test Case 4: Logout User', async ({ authenticatedUser, homePage, loginPage }) => {
    const { email, password } = authenticatedUser;

    // Navigate and verify home page
    await homePage.goto();
    await expect(homePage.logo).toBeVisible();

    // Login
    await homePage.navLogin.click();
    await loginPage.login(email, password);

    // Verify logged in
    await expect(homePage.loggedInAs).toBeVisible();

    // Logout
    await homePage.navLogout.click();
    await homePage.page.waitForURL(/login/);

    // Verify redirected to login page
    await expect(loginPage.newUserSignupTitle).toBeVisible();
  });

  test('Test Case 5: Register User with Existing Email', async ({ authenticatedUser, homePage, loginPage }) => {
    const { email, name } = authenticatedUser;

    // Navigate and verify home page
    await homePage.goto();
    await expect(homePage.logo).toBeVisible();

    // Go to Signup / Login
    await homePage.navLogin.click();
    await expect(loginPage.newUserSignupTitle).toBeVisible();

    // Attempt signup with already registered email
    await loginPage.signup(name, email);

    // Verify error message
    await expect(loginPage.signupErrorMessage).toBeVisible();
  });

  test('Test Case 6: Contact Us Form', async ({ homePage, contactPage }) => {
    const { name, email } = TestDataFactory.createSignupInfo();
    const { subject, message } = TestDataFactory.createContactInfo();

    // Navigate and verify home page
    await homePage.goto();
    await expect(homePage.logo).toBeVisible();

    // Go to Contact Us
    await homePage.navContactUs.click();
    await expect(contactPage.contactUsTitle).toBeVisible();

    // Fill form and upload file
    await contactPage.fillForm({ name, email, subject, message });
    await contactPage.uploadFile(__filename);

    // Submit and verify success
    await contactPage.submit();
    await expect(contactPage.successMessage).toBeVisible();
  });

  test('Test Case 7: Verify Test Cases Page', async ({ homePage }) => {
    // Navigate and verify home page
    await homePage.goto();
    await expect(homePage.logo).toBeVisible();

    // Click Test Cases nav
    await homePage.navTestCases.click();

    // Verify navigated to test cases page
    await expect(homePage.page).toHaveURL(/test_cases/);
  });

  test('Test Case 8: Verify All Products and product detail page', async ({ homePage, productsPage }) => {
    // Navigate and verify home page
    await homePage.goto();
    await expect(homePage.logo).toBeVisible();

    // Go to Products page
    await homePage.navProducts.click();
    await expect(productsPage.page).toHaveURL(/products/);
    await expect(productsPage.allProductsTitle).toBeVisible();

    // Verify products list is visible
    await expect(productsPage.productsList.first()).toBeVisible();

    // Click View Product on first product
    await productsPage.viewProduct(0);

    // Verify product detail page
    await expect(productsPage.detailName).toBeVisible();
    await expect(productsPage.detailCategory).toBeVisible();
    await expect(productsPage.detailPrice).toBeVisible();
    await expect(productsPage.detailAvailability).toBeVisible();
    await expect(productsPage.detailCondition).toBeVisible();
    await expect(productsPage.detailBrand).toBeVisible();
  });

  test('Test Case 9: Search Product', async ({ homePage, productsPage }) => {
    // Navigate and verify home page
    await homePage.goto();
    await expect(homePage.logo).toBeVisible();

    // Go to Products page
    await homePage.navProducts.click();
    await expect(productsPage.page).toHaveURL(/products/);
    await expect(productsPage.allProductsTitle).toBeVisible();

    // Search for a product
    await productsPage.searchProduct('Dress');

    // Verify searched products title is visible
    await expect(productsPage.searchedProductsTitle).toBeVisible();

    // Verify search results are visible
    await expect(productsPage.productsList.first()).toBeVisible();
  });

  test('Test Case 10: Verify Subscription in home page', async ({ homePage }) => {
    const { email } = TestDataFactory.createSignupInfo();

    // Navigate and verify home page
    await homePage.goto();
    await expect(homePage.logo).toBeVisible();

    // Scroll to footer and verify subscription section
    await homePage.subscriptionTitle.scrollIntoViewIfNeeded();
    await expect(homePage.subscriptionTitle).toBeVisible();

    // Enter email and subscribe
    await homePage.subscribe(email);

    // Verify success message
    await expect(homePage.subscriptionSuccess).toBeVisible();
  });

  test('Test Case 11: Verify Subscription in Cart page', async ({ homePage, cartPage }) => {
    const { email } = TestDataFactory.createSignupInfo();

    // Navigate and verify home page
    await homePage.goto();
    await expect(homePage.logo).toBeVisible();

    // Go to Cart page
    await homePage.navCart.click();
    await expect(cartPage.page).toHaveURL(/view_cart/);

    // Scroll to footer and verify subscription section
    await cartPage.subscriptionTitle.scrollIntoViewIfNeeded();
    await expect(cartPage.subscriptionTitle).toBeVisible();

    // Enter email and subscribe
    await cartPage.subscribe(email);

    // Verify success message
    await expect(cartPage.subscriptionSuccess).toBeVisible();
  });

  test('Test Case 12: Add Products in Cart', async ({ homePage, productsPage, cartPage }) => {
    // Navigate and verify home page
    await homePage.goto();
    await expect(homePage.logo).toBeVisible();

    // Go to Products page
    await homePage.navProducts.click();
    await expect(productsPage.page).toHaveURL(/products/);

    // Add first product to cart
    await productsPage.addProductToCart(0);
    await productsPage.continueShoppingButton.click();

    // Add second product to cart
    await productsPage.addProductToCart(1);
    await productsPage.viewCartLink.click();

    // Verify both products are in cart
    await expect(cartPage.page).toHaveURL(/view_cart/);
    await expect(cartPage.cartRows).toHaveCount(2);

    // Verify prices, quantities and totals are visible
    await expect(cartPage.cartProductPrice(0)).toBeVisible();
    await expect(cartPage.cartProductQuantity(0)).toBeVisible();
    await expect(cartPage.cartProductTotal(0)).toBeVisible();
    await expect(cartPage.cartProductPrice(1)).toBeVisible();
    await expect(cartPage.cartProductQuantity(1)).toBeVisible();
    await expect(cartPage.cartProductTotal(1)).toBeVisible();
  });

  test('Test Case 13: Verify Product quantity in Cart', async ({ homePage, productsPage, cartPage }) => {
    // Navigate and verify home page
    await homePage.goto();
    await expect(homePage.logo).toBeVisible();

    // View first product detail
    await homePage.navProducts.click();
    await expect(productsPage.page).toHaveURL(/products/);
    await productsPage.viewProduct(0);

    // Verify product detail page is open
    await expect(productsPage.detailName).toBeVisible();

    // Set quantity to 4
    await productsPage.detailQuantity.clear();
    await productsPage.detailQuantity.fill('4');

    // Add to cart and go to cart via modal
    await productsPage.detailAddToCart.click();
    await productsPage.detailViewCart.click();

    // Verify product is in cart with quantity 4
    await expect(cartPage.page).toHaveURL(/view_cart/);
    await expect(cartPage.cartProductQuantity(0)).toHaveText('4');
  });

  test('Test Case 14: Place Order: Register while Checkout', async ({
    homePage, productsPage, cartPage, loginPage, signupPage, checkoutPage,
  }) => {
    test.setTimeout(60000);
    const signup = TestDataFactory.createSignupInfo();
    const account = TestDataFactory.createAccountInfo();
    const address = TestDataFactory.createAddressInfo();
    const payment = TestDataFactory.createPaymentInfo();

    // Navigate and verify home page
    await homePage.goto();
    await expect(homePage.logo).toBeVisible();

    // Add a product to cart
    await homePage.navProducts.click();
    await expect(productsPage.page).toHaveURL(/products/);
    await productsPage.addProductToCart(0);
    await productsPage.continueShoppingButton.click();

    // Go to cart and proceed to checkout
    await homePage.navCart.click();
    await expect(cartPage.page).toHaveURL(/view_cart/);
    await cartPage.proceedToCheckout();

    // Click Register / Login
    await cartPage.registerLoginLink.click();
    await expect(loginPage.newUserSignupTitle).toBeVisible();

    // Register new account
    await loginPage.signup(signup.name, signup.email);
    await expect(signupPage.title).toBeVisible();
    await signupPage.fillAccountInfo(account);
    await signupPage.fillAddressInfo(address);
    await signupPage.submit();
    await expect(signupPage.accountCreatedTitle).toBeVisible();
    await signupPage.continueButton.click();

    // Verify logged in
    await expect(homePage.loggedInAs).toBeVisible();

    // Go back to cart and proceed to checkout
    await homePage.navCart.click();
    await expect(cartPage.page).toHaveURL(/view_cart/);

    // Re-add product if cart is empty after session change on login
    const count = await cartPage.cartRows.count();
    if (count === 0) {
      await homePage.navProducts.click();
      await expect(productsPage.page).toHaveURL(/products/);
      await productsPage.addProductToCart(0);
      await productsPage.viewCartLink.click();
    }

    await cartPage.proceedToCheckout();

    // Verify address details and place order
    await expect(checkoutPage.addressDelivery).toBeVisible();
    await checkoutPage.placeOrder('Test order comment');

    // Fill payment details and confirm
    await checkoutPage.fillPayment(payment);
    await checkoutPage.payButton.click();

    // Verify order success
    await expect(checkoutPage.orderSuccessMessage).toBeVisible();
    await checkoutPage.continueButton.click();

    // Delete account
    await homePage.navDelete.click();
    await expect(homePage.accountDeletedTitle).toBeVisible();
    await homePage.continueButton.click();
  });

  test('Test Case 15: Place Order: Register before Checkout', async ({
    homePage, productsPage, cartPage, loginPage, signupPage, checkoutPage,
  }) => {
    test.setTimeout(60000);
    const signup = TestDataFactory.createSignupInfo();
    const account = TestDataFactory.createAccountInfo();
    const address = TestDataFactory.createAddressInfo();
    const payment = TestDataFactory.createPaymentInfo();

    // Navigate and verify home page
    await homePage.goto();
    await expect(homePage.logo).toBeVisible();

    // Register new account
    await homePage.navLogin.click();
    await expect(loginPage.newUserSignupTitle).toBeVisible();
    await loginPage.signup(signup.name, signup.email);
    await expect(signupPage.title).toBeVisible();
    await signupPage.fillAccountInfo(account);
    await signupPage.fillAddressInfo(address);
    await signupPage.submit();
    await expect(signupPage.accountCreatedTitle).toBeVisible();
    await signupPage.continueButton.click();

    // Verify logged in
    await expect(homePage.loggedInAs).toBeVisible();

    // Add a product to cart
    await homePage.navProducts.click();
    await expect(productsPage.page).toHaveURL(/products/);
    await productsPage.addProductToCart(0);
    await productsPage.continueShoppingButton.click();

    // Go to cart and proceed to checkout
    await homePage.navCart.click();
    await expect(cartPage.page).toHaveURL(/view_cart/);
    await cartPage.proceedToCheckout();

    // Verify address details and place order
    await expect(checkoutPage.addressDelivery).toBeVisible();
    await checkoutPage.placeOrder('Test order comment');

    // Fill payment details and confirm
    await checkoutPage.fillPayment(payment);
    await checkoutPage.payButton.click();

    // Verify order success
    await expect(checkoutPage.orderSuccessMessage).toBeVisible();
    await checkoutPage.continueButton.click();

    // Delete account
    await homePage.navDelete.click();
    await expect(homePage.accountDeletedTitle).toBeVisible();
    await homePage.continueButton.click();
  });

  test('Test Case 16: Place Order: Login before Checkout', async ({
    authenticatedUser, homePage, productsPage, cartPage, loginPage, checkoutPage,
  }) => {
    test.setTimeout(60000);
    const { email, password } = authenticatedUser;
    const payment = TestDataFactory.createPaymentInfo();

    // Navigate and verify home page
    await homePage.goto();
    await expect(homePage.logo).toBeVisible();

    // Login with existing credentials
    await homePage.navLogin.click();
    await expect(loginPage.newUserSignupTitle).toBeVisible();
    await loginPage.login(email, password);

    // Verify logged in
    await expect(homePage.loggedInAs).toBeVisible();

    // Add a product to cart
    await homePage.navProducts.click();
    await expect(productsPage.page).toHaveURL(/products/);
    await productsPage.addProductToCart(0);
    await productsPage.continueShoppingButton.click();

    // Go to cart and proceed to checkout
    await homePage.navCart.click();
    await expect(cartPage.page).toHaveURL(/view_cart/);
    await cartPage.proceedToCheckout();

    // Verify address details and place order
    await expect(checkoutPage.addressDelivery).toBeVisible();
    await checkoutPage.placeOrder('Test order comment');

    // Fill payment details and confirm
    await checkoutPage.fillPayment(payment);
    await checkoutPage.payButton.click();

    // Verify order success
    await expect(checkoutPage.orderSuccessMessage).toBeVisible();
    await checkoutPage.continueButton.click();

    // Delete account
    await homePage.navDelete.click();
    await expect(homePage.accountDeletedTitle).toBeVisible();
    await homePage.continueButton.click();
  });

  test('Test Case 17: Remove Products From Cart', async ({ homePage, productsPage, cartPage }) => {
    // Navigate and verify home page
    await homePage.goto();
    await expect(homePage.logo).toBeVisible();

    // Add a product to cart
    await homePage.navProducts.click();
    await expect(productsPage.page).toHaveURL(/products/);
    await productsPage.addProductToCart(0);
    await productsPage.viewCartLink.click();

    // Verify cart page and product is present
    await expect(cartPage.page).toHaveURL(/view_cart/);
    await expect(cartPage.cartRows).toHaveCount(1);

    // Remove the product
    await cartPage.removeProduct(0);

    // Verify cart is empty
    await expect(cartPage.emptyCartMessage).toBeVisible();
  });

  test('Test Case 18: View Category Products', async ({ homePage, productsPage }) => {
    // Navigate and verify home page
    await homePage.goto();
    await expect(homePage.logo).toBeVisible();

    // Verify categories are visible on left sidebar
    await expect(homePage.categoryWomen).toBeVisible();

    // Click on Women category to expand it
    await homePage.categoryWomen.click();

    // Click on 'Dress' subcategory under Women
    await homePage.categoryLink('/category_products/1').click();

    // Verify category page is displayed with correct title
    await expect(productsPage.page).toHaveURL(/category_products/);
    await expect(productsPage.categoryTitle).toBeVisible();

    // Click on Men category to expand it
    await homePage.categoryMen.click();

    // Click on 'Tshirts' subcategory under Men
    await homePage.categoryLink('/category_products/3').click();

    // Verify user is navigated to Men category page
    await expect(productsPage.page).toHaveURL(/category_products/);
    await expect(productsPage.categoryTitle).toBeVisible();
  });

  test('Test Case 19: View & Cart Brand Products', async ({ homePage, productsPage }) => {
    // Navigate and verify home page
    await homePage.goto();
    await expect(homePage.logo).toBeVisible();

    // Go to Products page
    await homePage.navProducts.click();
    await expect(productsPage.page).toHaveURL(/products/);

    // Verify brands are visible on left sidebar
    await expect(productsPage.brandsList.first()).toBeVisible();

    // Click on first brand
    await productsPage.brandLink(0).click();

    // Verify navigated to brand page with products
    await expect(productsPage.page).toHaveURL(/brand_products/);
    await expect(productsPage.brandTitle).toBeVisible();
    await expect(productsPage.productsList.first()).toBeVisible();

    // Click on second brand
    await productsPage.brandLink(1).click();

    // Verify navigated to second brand page with products
    await expect(productsPage.page).toHaveURL(/brand_products/);
    await expect(productsPage.brandTitle).toBeVisible();
    await expect(productsPage.productsList.first()).toBeVisible();
  });

  test('Test Case 20: Search Products and Verify Cart After Login', async ({
    authenticatedUser, homePage, productsPage, cartPage, loginPage,
  }) => {
    test.setTimeout(60000);
    const { email, password } = authenticatedUser;

    // Navigate and verify home page
    await homePage.goto();
    await expect(homePage.logo).toBeVisible();

    // Go to Products page and search
    await homePage.navProducts.click();
    await expect(productsPage.page).toHaveURL(/products/);
    await expect(productsPage.allProductsTitle).toBeVisible();
    await productsPage.searchProduct('Dress');

    // Verify searched products are visible
    await expect(productsPage.searchedProductsTitle).toBeVisible();
    await expect(productsPage.productsList.first()).toBeVisible();

    // Add first two search results to cart
    await productsPage.addProductToCart(0);
    await productsPage.continueShoppingButton.click();
    await productsPage.addProductToCart(1);
    await productsPage.continueShoppingButton.click();

    // Go to cart and verify products are present
    await homePage.navCart.click();
    await expect(cartPage.page).toHaveURL(/view_cart/);
    await expect(cartPage.cartRows.first()).toBeVisible();

    // Login
    await homePage.navLogin.click();
    await expect(loginPage.newUserSignupTitle).toBeVisible();
    await loginPage.login(email, password);
    await expect(homePage.loggedInAs).toBeVisible();

    // Go back to cart and verify products are still there
    await homePage.navCart.click();
    await expect(cartPage.page).toHaveURL(/view_cart/);
    await expect(cartPage.cartRows.first()).toBeVisible();
  });

  test('Test Case 21: Add review on product', async ({ homePage, productsPage }) => {
    const { name, email } = TestDataFactory.createSignupInfo();

    // Navigate and verify home page
    await homePage.goto();
    await expect(homePage.logo).toBeVisible();

    // Go to Products page
    await homePage.navProducts.click();
    await expect(productsPage.page).toHaveURL(/products/);
    await expect(productsPage.allProductsTitle).toBeVisible();

    // Click View Product on first product
    await productsPage.viewProduct(0);

    // Verify 'Write Your Review' is visible
    await expect(productsPage.reviewTitle).toBeVisible();

    // Fill and submit review
    await productsPage.reviewName.fill(name);
    await productsPage.reviewEmail.fill(email);
    await productsPage.reviewText.fill('Great product, highly recommend!');
    await productsPage.reviewSubmit.click();

    // Verify success message
    await expect(productsPage.reviewSuccess).toBeVisible();
  });

  test('Test Case 22: Add to cart from Recommended Items', async ({ homePage, cartPage }) => {
    // Navigate and verify home page
    await homePage.goto();
    await expect(homePage.logo).toBeVisible();

    // Scroll to recommended items section
    await homePage.recommendedTitle.scrollIntoViewIfNeeded();

    // Verify recommended items are visible
    await expect(homePage.recommendedTitle).toBeVisible();

    // Add first recommended product to cart
    await homePage.recommendedAddToCart(0).click();

    // Click View Cart from modal
    await homePage.viewCartModalLink.click();

    // Verify product is in cart
    await expect(cartPage.page).toHaveURL(/view_cart/);
    await expect(cartPage.cartRows.first()).toBeVisible();
  });

  test('Test Case 23: Verify address details in checkout page', async ({
    homePage, productsPage, cartPage, loginPage, signupPage, checkoutPage,
  }) => {
    test.setTimeout(60000);
    const signup = TestDataFactory.createSignupInfo();
    const account = TestDataFactory.createAccountInfo();
    const address = TestDataFactory.createAddressInfo();

    // Navigate and verify home page
    await homePage.goto();
    await expect(homePage.logo).toBeVisible();

    // Register new account
    await homePage.navLogin.click();
    await expect(loginPage.newUserSignupTitle).toBeVisible();
    await loginPage.signup(signup.name, signup.email);
    await expect(signupPage.title).toBeVisible();
    await signupPage.fillAccountInfo(account);
    await signupPage.fillAddressInfo(address);
    await signupPage.submit();
    await expect(signupPage.accountCreatedTitle).toBeVisible();
    await signupPage.continueButton.click();

    // Verify logged in
    await expect(homePage.loggedInAs).toBeVisible();

    // Add a product to cart
    await homePage.navProducts.click();
    await expect(productsPage.page).toHaveURL(/products/);
    await productsPage.addProductToCart(0);
    await productsPage.continueShoppingButton.click();

    // Go to cart and proceed to checkout
    await homePage.navCart.click();
    await expect(cartPage.page).toHaveURL(/view_cart/);
    await cartPage.proceedToCheckout();

    // Verify delivery and billing addresses contain registered name
    await expect(checkoutPage.addressDelivery).toContainText(address.firstName);
    await expect(checkoutPage.addressDelivery).toContainText(address.lastName);
    await expect(checkoutPage.addressBilling).toContainText(address.firstName);
    await expect(checkoutPage.addressBilling).toContainText(address.lastName);

    // Delete account
    await homePage.navDelete.click();
    await expect(homePage.accountDeletedTitle).toBeVisible();
    await homePage.continueButton.click();
  });

  test('Test Case 24: Download Invoice after purchase order', async ({
    homePage, productsPage, cartPage, loginPage, signupPage, checkoutPage, browserName,
  }) => {
    test.setTimeout(60000);
    const signup = TestDataFactory.createSignupInfo();
    const account = TestDataFactory.createAccountInfo();
    const address = TestDataFactory.createAddressInfo();
    const payment = TestDataFactory.createPaymentInfo();

    // Navigate and verify home page
    await homePage.goto();
    await expect(homePage.logo).toBeVisible();

    // Add a product to cart and go to cart via modal
    await homePage.navProducts.click();
    await expect(productsPage.page).toHaveURL(/products/);
    await productsPage.addProductToCart(0);
    await productsPage.viewCartLink.click();

    // Proceed to checkout
    await expect(cartPage.page).toHaveURL(/view_cart/);
    await cartPage.proceedToCheckout();

    // Click Register / Login
    await cartPage.registerLoginLink.click();
    await expect(loginPage.newUserSignupTitle).toBeVisible();

    // Register new account
    await loginPage.signup(signup.name, signup.email);
    await expect(signupPage.title).toBeVisible();
    await signupPage.fillAccountInfo(account);
    await signupPage.fillAddressInfo(address);
    await signupPage.submit();
    await expect(signupPage.accountCreatedTitle).toBeVisible();
    await signupPage.continueButton.click();
    await expect(homePage.loggedInAs).toBeVisible();

    // Go back to cart
    await homePage.navCart.click();
    await expect(cartPage.page).toHaveURL(/view_cart/);

    // Re-add product if cart is empty after session change on login
    const count = await cartPage.cartRows.count();
    if (count === 0) {
      await homePage.navProducts.click();
      await productsPage.addProductToCart(0);
      await productsPage.viewCartLink.click();
    }

    await cartPage.proceedToCheckout();

    // Verify address details and place order
    await expect(checkoutPage.addressDelivery).toBeVisible();
    await checkoutPage.placeOrder('Test order comment');

    // Fill payment and confirm
    await checkoutPage.fillPayment(payment);
    await checkoutPage.payButton.click();

    // Verify order success and download invoice
    await expect(checkoutPage.orderSuccessMessage).toBeVisible();
    if (browserName === 'webkit') {
      // WebKit opens downloads inline rather than triggering a download event
      await checkoutPage.downloadInvoice.click();
    } else {
      const [download] = await Promise.all([
        checkoutPage.page.waitForEvent('download'),
        checkoutPage.downloadInvoice.click(),
      ]);
      expect(download.suggestedFilename()).toBeTruthy();
    }

    // Continue and delete account
    await checkoutPage.continueButton.click();
    await homePage.navDelete.click();
    await expect(homePage.accountDeletedTitle).toBeVisible();
    await homePage.continueButton.click();
  });

  test('Test Case 25: Verify Scroll Up using Arrow button and Scroll Down functionality', async ({ homePage }) => {
    // Navigate and verify home page
    await homePage.goto();
    await expect(homePage.logo).toBeVisible();

    // Scroll down to footer subscription section
    await homePage.subscriptionTitle.scrollIntoViewIfNeeded();
    await expect(homePage.subscriptionTitle).toBeVisible();

    // Click scroll up arrow button
    await homePage.scrollUpButton.click();

    // Verify page scrolled back to top (logo is in viewport at top)
    await expect(homePage.logo).toBeInViewport();
  });

  test('Test Case 26: Verify Scroll Up without Arrow button and Scroll Down functionality', async ({ homePage }) => {
    // Navigate and verify home page
    await homePage.goto();
    await expect(homePage.logo).toBeVisible();

    // Scroll down to footer subscription section
    await homePage.subscriptionTitle.scrollIntoViewIfNeeded();
    await expect(homePage.subscriptionTitle).toBeVisible();

    // Scroll back to top using keyboard
    await homePage.page.keyboard.press('Home');

    // Verify page scrolled back to top
    await expect(homePage.logo).toBeInViewport();
  });

});
