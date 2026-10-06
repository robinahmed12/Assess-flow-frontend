import { test, expect } from "@playwright/test";
import {
  APP_ORIGIN,
  APP_PAYMENT_ID,
  BKASH_PAYMENT_ID,
  COMPANY,
  STRIPE_SESSION_ID,
  makePayment,
  mockCheckout,
  mockPaymentDetail,
  mockPaymentList,
  mockProviderPage,
  seedRecruiterSession,
} from "./support/mocks";

test.describe("Stripe credit purchase flow", () => {
  test.beforeEach(async ({ page }) => {
    await seedRecruiterSession(page, { company: { ...COMPANY, credits: 5 } });
  });

  test("completes a successful Stripe checkout and shows confirmed state", async ({ page }) => {
    await mockPaymentList(page, {
      payments: [
        makePayment({
          id: APP_PAYMENT_ID,
          status: "PENDING",
          stripeSessionId: STRIPE_SESSION_ID,
          amount: 10,
          creditsPurchased: 10,
        }),
      ],
    });
    await mockPaymentDetail(page, APP_PAYMENT_ID, ["PENDING", "SUCCEEDED"], {
      stripeSessionId: STRIPE_SESSION_ID,
      amount: 10,
      creditsPurchased: 10,
    });
    await mockCheckout(page, {
      provider: "STRIPE",
      url: "https://mock-stripe.test/checkout",
    });
    await mockProviderPage(
      page,
      "https://mock-stripe.test",
      `${APP_ORIGIN}/payments/success?session_id=${STRIPE_SESSION_ID}`,
    );

    await page.goto("/recruiter/billing");
    await page.getByRole("button", { name: "Buy with Stripe" }).first().click();

    await expect(page.getByRole("heading", { name: "Mock provider" })).toBeVisible();
    await page.getByRole("button", { name: "Pay now" }).click();

    await page.waitForURL("**/payments/success**");
    await expect(
      page.getByRole("heading", { name: "Payment confirmed" }),
    ).toBeVisible({ timeout: 20_000 });
    await expect(page.getByText(/added 10 credits to your company balance/)).toBeVisible();
    await expect(page.getByRole("link", { name: "View payment details" })).toBeVisible();
  });

  test("shows a retry surface when Stripe still processing after timeout", async ({ page }) => {
    test.setTimeout(180_000);
    await mockPaymentList(page, {
      payments: [
        makePayment({
          id: APP_PAYMENT_ID,
          status: "PENDING",
          stripeSessionId: STRIPE_SESSION_ID,
        }),
      ],
    });
    await mockPaymentDetail(page, APP_PAYMENT_ID, ["PENDING"]);

    await page.goto(`/payments/success?session_id=${STRIPE_SESSION_ID}`);
    await expect(page.getByRole("heading", { name: "Still processing" })).toBeVisible({
      timeout: 150_000,
    });
  });

  test("reports missing checkout session", async ({ page }) => {
    await page.goto("/payments/success");
    await expect(page.getByRole("heading", { name: "Missing checkout session" })).toBeVisible();
  });

  test("reports payment not found when the session is unknown", async ({ page }) => {
    await mockPaymentList(page, { payments: [] });
    await page.goto(`/payments/success?session_id=unknown_stream`);
    await expect(page.getByRole("heading", { name: "Payment not found" })).toBeVisible();
  });
});

test.describe("bKash credit purchase flow", () => {
  test.beforeEach(async ({ page }) => {
    await seedRecruiterSession(page, { company: { ...COMPANY, credits: 5 } });
  });

  test("completes a successful bKash checkout (bkashURL) and shows confirmed state", async ({ page }) => {
    await mockPaymentDetail(page, BKASH_PAYMENT_ID, ["PENDING", "SUCCEEDED"], {
      amount: 500,
      creditsPurchased: 10,
    });
    await mockCheckout(page, {
      provider: "BKASH",
      bkashURL: "https://mock-bkash.test/pay",
    });
    await mockProviderPage(
      page,
      "https://mock-bkash.test",
      `${APP_ORIGIN}/payments/bkash-success?payment=${BKASH_PAYMENT_ID}`,
    );

    await page.goto("/recruiter/billing");
    await page.getByRole("button", { name: "bKash" }).click();
    await page.getByRole("button", { name: "Buy with bKash" }).first().click();

    await expect(page.getByRole("heading", { name: "Mock provider" })).toBeVisible();
    await page.getByRole("button", { name: "Pay now" }).click();

    await page.waitForURL("**/payments/bkash-success**");
    await expect(
      page.getByRole("heading", { name: "Payment confirmed" }),
    ).toBeVisible({ timeout: 20_000 });
    await expect(page.getByText(/added 10 credits to your company balance/)).toBeVisible();
  });

  test("normalizes an explicit `url` key for bKash checkout as well", async ({ page }) => {
    await mockPaymentDetail(page, BKASH_PAYMENT_ID, ["SUCCEEDED"], {
      amount: 500,
      creditsPurchased: 50,
    });
    await mockCheckout(page, {
      provider: "BKASH",
      url: "https://mock-bkash.test/pay",
    });
    await mockProviderPage(
      page,
      "https://mock-bkash.test",
      `${APP_ORIGIN}/payments/bkash-success?payment=${BKASH_PAYMENT_ID}`,
    );

    await page.goto("/recruiter/billing");
    await page.getByRole("button", { name: "bKash" }).click();
    await page.getByRole("button", { name: "Buy with bKash" }).first().click();

    await page.waitForURL("https://mock-bkash.test/**");
    await expect(page.getByRole("heading", { name: "Mock provider" })).toBeVisible();
  });

  test("reports a failed bKash payment", async ({ page }) => {
    await mockPaymentDetail(page, BKASH_PAYMENT_ID, ["FAILED"], {
      amount: 500,
      creditsPurchased: 10,
    });

    await page.goto(`/payments/bkash-success?payment=${BKASH_PAYMENT_ID}`);
    await expect(page.getByRole("heading", { name: "Payment failed" })).toBeVisible();
  });

  test("reports missing payment reference", async ({ page }) => {
    await page.goto("/payments/bkash-success");
    await expect(page.getByRole("heading", { name: "Missing payment reference" })).toBeVisible();
  });
});

test.describe("Payment cancel / return states", () => {
  test("cancelled checkout", async ({ page }) => {
    await page.goto("/payments/cancel?reason=cancelled");
    await expect(page.getByRole("heading", { name: "Checkout cancelled" })).toBeVisible();
  });

  test("failed checkout", async ({ page }) => {
    await page.goto("/payments/cancel?reason=failed");
    await expect(page.getByRole("heading", { name: "Payment failed" })).toBeVisible();
  });

  test("verification error state", async ({ page }) => {
    await page.goto("/payments/cancel?reason=error");
    await expect(
      page.getByRole("heading", { name: "Payment could not be verified" }),
    ).toBeVisible();
    await expect(
      page.getByText(/We could not confirm the outcome of this payment/),
    ).toBeVisible();
  });

  test("missing reason defaults to cancelled", async ({ page }) => {
    await page.goto("/payments/cancel");
    await expect(page.getByRole("heading", { name: "Checkout cancelled" })).toBeVisible();
  });

  test("unknown reason falls back to the verification-error state (safest copy)", async ({ page }) => {
    await page.goto("/payments/cancel?reason=some_unknown_code");
    await expect(
      page.getByRole("heading", { name: "Payment could not be verified" }),
    ).toBeVisible();
    await expect(
      page.getByText(/We could not confirm the outcome of this payment/),
    ).toBeVisible();
  });

  test("provider-hosted 'Cancel' returns to the cancelled state", async ({ page }) => {
    await seedRecruiterSession(page, { company: { ...COMPANY, credits: 0 } });
    await mockCheckout(page, {
      provider: "BKASH",
      bkashURL: "https://mock-bkash.test/pay",
    });
    await mockProviderPage(
      page,
      "https://mock-bkash.test",
      `${APP_ORIGIN}/payments/bkash-success?payment=${BKASH_PAYMENT_ID}`,
    );

    await page.goto("/recruiter/billing");
    await page.getByRole("button", { name: "bKash" }).click();
    await page.getByRole("button", { name: "Buy with bKash" }).first().click();

    await expect(page.getByRole("heading", { name: "Mock provider" })).toBeVisible();
    await page.getByRole("button", { name: "Cancel" }).click();

    await expect(page.getByRole("heading", { name: "Checkout cancelled" })).toBeVisible();
  });
});