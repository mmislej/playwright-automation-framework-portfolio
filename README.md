# Playwright Automation Framework

![Playwright Tests](https://github.com/mmislej/playwright-automation-framework-portfolio/actions/workflows/playwright.yml/badge.svg?branch=master)
[![View Test Report](https://img.shields.io/badge/Test%20Report-View%20Latest-blue?logo=playwright)](https://mmislej.github.io/playwright-automation-framework-portfolio/)

A professional end-to-end test automation framework built to verify that a real e-commerce website works correctly from a user's perspective. Every time a change is made to the website, this framework can automatically run a full suite of tests to confirm nothing is broken — across three different browsers, in parallel, without any manual effort.

---

## What does this project do?

This framework simulates real user behaviour on [AutomationExercise.com](https://automationexercise.com) — an e-commerce demo site. It opens a browser, clicks through the website exactly as a real customer would, and checks that everything works as expected: registering an account, logging in, browsing products, adding items to a cart, completing a purchase, and more.

It runs **26 automated test scenarios** covering the full customer journey.

---

## Why does this matter?

Manual testing is slow, error-prone, and does not scale. This framework allows a team to:

- **Catch bugs early** — tests run automatically on every code change before it reaches production
- **Save time** — what would take a QA engineer hours to test manually runs in minutes
- **Test on multiple browsers** — Chrome, Firefox, and Safari are all covered simultaneously
- **Trust deployments** — no feature ships without passing a full regression suite

---

## What gets tested?

| Area | What is verified |
|---|---|
| Registration | A new user can create an account with full personal and address details |
| Login | Valid credentials grant access; invalid credentials are rejected with a clear error |
| Logout | A logged-in user can sign out and is redirected correctly |
| Products | Products load correctly, can be searched, filtered by category and brand, and viewed in detail |
| Shopping Cart | Items can be added, quantities can be changed, and products can be removed |
| Checkout | A full purchase can be completed including payment details and order confirmation |
| Invoice | A receipt can be downloaded after a successful order |
| Subscriptions | The email subscription form works from both the homepage and the cart page |
| Reviews | A customer can submit a review on a product page |
| Contact Form | The contact form accepts a message and a file attachment |
| Navigation | All key pages load and scroll behaviour works correctly |

---

## How is the framework built?

The framework is written in **TypeScript** and uses **Playwright** — one of the most modern and widely adopted browser automation tools in the industry today. It is structured following industry best practices that make it easy to maintain and extend.

### The main building blocks

**Pages** — Each page of the website (Home, Login, Products, Cart, etc.) has its own dedicated file that knows how to interact with that page. If the website changes a button or a form, only one file needs to be updated — not every single test.

**Tests** — The test scenarios describe user journeys in plain steps: go to the homepage, search for a product, add it to the cart, proceed to checkout. Tests are readable and focused on behaviour, not implementation details.

**Test Data Generation** — No test uses hardcoded names, emails, or credit card numbers. Every run generates fresh, realistic fake data automatically. This means tests never conflict with each other and can run safely in parallel.

**API Setup** — Some tests need a logged-in user to start. Rather than going through the full registration UI every time, the framework creates and cleans up test accounts directly through the website's API. This makes tests faster and more reliable.

**CI/CD Integration** — The framework is connected to GitHub Actions. Every pull request automatically triggers the full test suite. If any test fails, the pull request is blocked from merging until the issue is resolved.

---

## Framework Architecture

The diagram below shows how all the pieces of the framework connect to each other. Think of it as a production line: the configuration sets the rules, the tests define the scenarios, the fixtures provide everything a test needs to run, the page objects know how to operate the website, and the utilities handle data and API calls behind the scenes.

```mermaid
flowchart TD
    subgraph CONFIG["⚙️ Configuration Layer"]
        PC["playwright.config.ts"]
        TS["tsconfig.json"]
    end

    subgraph TESTS["🧪 Test Layer"]
        SPEC["testSuite.spec.ts\n26 UI tests"]
    end

    subgraph FIXTURES["🔌 Fixture Layer"]
        PMF["pageManagerFixture"]
        TDF["testDataFixture"]
        ACF["apiClientFixture"]
    end

    subgraph PAGES["📄 Page Object Layer"]
        HP["HomePage"]
        LP["LoginPage"]
        SP["SignupPage"]
        PP["ProductsPage"]
        CP["CartPage"]
        CHP["CheckoutPage"]
        COP["ContactPage"]
    end

    subgraph UTILS["🛠️ Utility Layer"]
        TDF2["TestDataFactory"]
        AC["ApiClient"]
    end

    subgraph EXTERNAL["🌐 External"]
        SITE["automationexercise.com"]
        FAKER["Faker.js"]
    end

    CONFIG -->|configures| SPEC
    SPEC -->|uses| PMF
    SPEC -->|uses| TDF
    SPEC -->|uses| ACF
    PMF -->|instantiates| PAGES
    TDF -->|uses| TDF2
    ACF -->|uses| AC
    ACF -->|uses| TDF2
    TDF2 -->|powered by| FAKER
    AC -->|calls| SITE
    PAGES -->|navigates| SITE

    style CONFIG fill:#4A5568,color:#fff,stroke:#2D3748
    style TESTS fill:#276749,color:#fff,stroke:#1C4532
    style FIXTURES fill:#744210,color:#fff,stroke:#5F370E
    style PAGES fill:#2B4A8A,color:#fff,stroke:#1A365D
    style UTILS fill:#6B2D8B,color:#fff,stroke:#553C9A
    style EXTERNAL fill:#2D3748,color:#aaa,stroke:#4A5568
```

### What each layer does

**Configuration (dark gray)** — Sets the global rules for every test run: which browsers to use, how long to wait before giving up on an action, whether to record a video, and how many times to retry a failing test in CI.

**Test Layer (green)** — Contains the 26 test scenarios. Each test reads like a user story: open the homepage, search for a product, add it to the cart, complete the checkout. Tests do not contain any knowledge of how the website is built — they just describe what should happen.

**Fixture Layer (orange)** — Acts as a service provider for the tests. Before each test starts, fixtures automatically prepare everything it needs: the right page objects, a fresh set of fake user data, and an API client. After the test finishes, fixtures clean up (e.g. deleting test accounts). Tests simply declare what they need and receive it automatically.

**Page Object Layer (blue)** — One file per page of the website. Each file knows exactly where every button, form, and link lives on that page and how to interact with it. If the website's layout changes, only the relevant page file needs to be updated — none of the tests need to change.

**Utility Layer (purple)** — Two reusable helpers. The `TestDataFactory` generates realistic fake names, addresses, emails, and payment details for every test run. The `ApiClient` communicates directly with the website's backend to create or delete test accounts without going through the browser.

**External (charcoal)** — Third-party dependencies: the live website being tested, and Faker.js (the library used to generate fake data).

---

## API Testing Layer

In addition to UI tests, this framework includes a dedicated API testing layer that validates the backend endpoints directly — no browser involved. It checks HTTP status codes, response body structure via JSON Schema, and business logic, using the same fixture and assertion patterns as the UI layer.

### What gets tested

| Endpoint | Method | What is verified |
|---|---|---|
| `/verifyLogin` | POST | Valid credentials return user confirmation; missing fields return 400; wrong credentials return 404 |
| `/verifyLogin` | DELETE | Method not allowed returns 405 |
| `/createAccount` | POST | A new account is created and returns 201 |
| `/deleteAccount` | DELETE | An existing account is deleted and returns 200 |
| `/updateAccount` | PUT | Account address details can be updated |
| `/getUserDetailByEmail` | GET | Returns full user details for a given email |
| `/productsList` | GET | Returns a non-empty list of products |
| `/productsList` | POST | Method not allowed returns 405 |
| `/brandsList` | GET | Returns a non-empty list of brands |
| `/brandsList` | PUT | Method not allowed returns 405 |
| `/searchProduct` | POST | Missing parameter returns 400 |

### Architecture

```mermaid
flowchart TD
    subgraph CONFIG["⚙️ Configuration Layer"]
        PC["playwright.config.ts\nbaseURL + project api"]
    end

    subgraph TESTS["🧪 Test Layer"]
        AT["auth.spec.ts\n8 API tests"]
        PT["products.spec.ts\n6 API tests"]
        DD["dataDrivenTestingDemo.spec.ts\n3 data-driven tests"]
    end

    subgraph FIXTURES["🔌 Fixture Layer"]
        RHF["requestHandlerFixture\napi fixture"]
    end

    subgraph UTILS["🛠️ Utility Layer"]
        RH["RequestHandler\nfluent builder"]
        AL["APILogger\nrequest & response logs"]
        CE["customExpects\nshouldEqual / shouldMatchSchema"]
        SV["SchemaValidator\nAJV validation"]
        TDF["TestDataFactory\nrequest bodies"]
    end

    subgraph SCHEMAS["📋 Schema Layer"]
        RS["responseSchemas/\n9 endpoint folders\n14 schema files"]
    end

    subgraph EXTERNAL["🌐 External"]
        API["automationexercise.com/api"]
        FAKER["Faker.js"]
        AJV["AJV + ajv-formats\ngenson-js"]
    end

    CONFIG -->|configures| TESTS
    TESTS -->|imports test| RHF
    TESTS -->|imports expect| CE
    TESTS -->|imports| TDF
    RHF -->|creates| RH
    RHF -->|creates| AL
    RH -->|logs via| AL
    RH -->|sends requests to| API
    CE -->|on failure reads| AL
    CE -->|calls| SV
    SV -->|reads| RS
    SV -->|validates with| AJV
    TDF -->|powered by| FAKER

    style CONFIG fill:#4A5568,color:#fff,stroke:#2D3748
    style TESTS fill:#276749,color:#fff,stroke:#1C4532
    style FIXTURES fill:#744210,color:#fff,stroke:#5F370E
    style UTILS fill:#6B2D8B,color:#fff,stroke:#553C9A
    style SCHEMAS fill:#2B4A8A,color:#fff,stroke:#1A365D
    style EXTERNAL fill:#2D3748,color:#aaa,stroke:#4A5568
```

### How it works

**RequestHandler** — A fluent builder class that wraps Playwright's `APIRequestContext`. Requests are built by chaining methods and executed with a single call that validates the HTTP status automatically.

```typescript
const body = await api
  .path('/verifyLogin')
  .body({ email: 'user@example.com', password: '123456' })
  .postRequest(200);
```

**APILogger** — Records every request and response during a test. When an assertion fails, the full log is automatically included in the error message so you can see exactly what was sent and received.

**SchemaValidator** — Validates response bodies against JSON Schema files using AJV. Each endpoint has its own schema file in `responseSchemas/`. If the API starts returning unexpected fields or missing required data, the validation catches it immediately.

**customExpects** — Custom Playwright matchers that include the API log in every failure message. `shouldMatchSchema` validates the full response structure; `shouldEqual` checks individual field values.

**TestDataFactory** — Provides static methods that return complete request body objects for each endpoint, powered by Faker.js for fresh random data on every run.

### Data-driven testing

`dataDrivenTestingDemo.spec.ts` shows how to run the same test logic with multiple input/output combinations. A dataset array defines the scenarios and a `for...of` loop generates one independent test per entry — adding a new case requires only a new object in the array.

```typescript
const verifyLoginCases = [
  { desc: 'missing email returns 400',        body: { password: 'abc' },                        responseCode: 400 },
  { desc: 'missing password returns 400',     body: { email: 'x@x.com' },                       responseCode: 400 },
  { desc: 'invalid credentials returns 404',  body: { email: 'x@x.com', password: 'wrong' },    responseCode: 404 },
];

for (const { desc, body, responseCode, message } of verifyLoginCases) {
  test(desc, async ({ api }) => { ... });
}
```

---

## How to run the tests

```bash
# Install dependencies
npm install

# Install browsers
npx playwright install

# Run all tests
npx playwright test

# Open the HTML report after the run
npx playwright show-report
```

---

## Technologies used

| Tool | Purpose |
|---|---|
| [Playwright](https://playwright.dev) | Browser automation and test runner |
| TypeScript | Strongly typed JavaScript for safer, more maintainable code |
| Faker.js | Generates realistic fake data for each test run |
| GitHub Actions | Runs the full test suite automatically on every pull request |

---

## Project structure at a glance

```
├── tests/          # The 26 test scenarios
├── pages/          # One file per website page, handling all interactions
├── fixtures/       # Shared setup: page objects, test data, API client
├── utils/          # Test data factory and API helper
└── playwright.config.ts  # Browser and test run settings
```
