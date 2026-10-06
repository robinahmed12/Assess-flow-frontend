import { test, expect } from "@playwright/test";
import {
  COMPANY,
  makePayment,
  mockCheckout,
  mockCompany,
  mockPaymentList,
  mockProviderPage,
  seedRecruiterSession,
} from "./support/mocks";

test.describe("Recruiter Billing page", () => {
  test.beforeEach(async ({ page }) => {
    await seedRecruiterSession(page);
    await mockPaymentList(page, {
      payments: [
        makePayment({
          id: "pay_1",
          status: "SUCCEEDED",
          amount: 10,
          creditsPurchased: 10,
          invoiceNumber: "INV-1001",
          createdAt: "2026-09-10T10:00:00.000Z",
        }),
        makePayment({
          id: "pay_2",
          status: "PENDING",
          amount: 40,
          creditsPurchased: 50,
          invoiceNumber: null,
          createdAt: "2026-09-11T12:00:00.000Z",
        }),
        makePayment({
          id: "pay_3",
          status: "FAILED",
          amount: 100,
          creditsPurchased: 150,
          invoiceNumber: null,
          createdAt: "2026-09-12T14:00:00.000Z",
        }),
      ],
    });
  });

  test("renders credit balance and Stripe packages by default", async ({ page }) => {
    await page.goto("/recruiter/billing");

    await expect(page.getByRole("heading", { name: "Billing" }).first()).toBeVisible();
    await expect(page.getByText("Available credits")).toBeVisible();
    await expect(page.getByText("STARTER", { exact: true })).toBeVisible();
    await expect(page.getByText("GROWTH", { exact: true })).toBeVisible();
    await expect(page.getByText("SCALE", { exact: true })).toBeVisible();
    await expect(page.getByText("USD 10.00", { exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Buy with Stripe" }).first()).toBeVisible();
  });

  test("switches packages to bKash when provider changes", async ({ page }) => {
    await page.goto("/recruiter/billing");

    await page.getByRole("button", { name: "bKash" }).click();

    await expect(page.getByRole("button", { name: "Buy with bKash" }).first()).toBeVisible();
    await expect(page.getByText("BDT 500.00", { exact: true })).toBeVisible();
    await expect(page.getByText("BDT 2,000.00", { exact: true })).toBeVisible();
    await expect(page.getByText("BDT 5,000.00", { exact: true })).toBeVisible();
  });

  test("sends only packageCode to checkout and redirects to the provider", async ({ page }) => {
    let checkoutBody: Record<string, unknown> | null = null;

    await mockProviderPage(
      page,
      "https://mock-stripe.test",
      "http://localhost:3000/payments/success?session_id=cs_test_1",
    );

    await page.route((url) => url.pathname === "/api/v1/stripe-payments/checkout", (route) => {
      checkoutBody = (route.request().postDataJSON() as Record<string, unknown>) ?? null;
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ url: "https://mock-stripe.test/checkout" }),
      });
    });

    await page.goto("/recruiter/billing");
    await page.getByRole("button", { name: "Buy with Stripe" }).first().click();

    await page.waitForURL("https://mock-stripe.test/**");
    expect(checkoutBody).toEqual({ packageCode: "STARTER" });
    await expect(page.getByRole("heading", { name: "Mock provider" })).toBeVisible();
  });

  test("shows payment history and filters by status", async ({ page }) => {
    await page.goto("/recruiter/billing");

    await expect(page.getByText("INV-1001")).toBeVisible();
    await expect(page.getByRole("cell", { name: "INV-1001" })).toBeVisible();
    await expect(page.getByRole("cell", { name: "Succeeded" })).toBeVisible();
    await expect(page.getByRole("cell", { name: "Pending" })).toBeVisible();
    await expect(page.getByRole("cell", { name: "Failed" })).toBeVisible();

    await page.getByRole("button", { name: "Failed" }).click();
    await expect(page.getByRole("cell", { name: "Failed" })).toHaveCount(1);
    await expect(page.getByRole("cell", { name: "Succeeded" })).toHaveCount(0);

    await page.getByRole("button", { name: "All" }).click();
    await expect(page.getByRole("cell", { name: "Failed" })).toHaveCount(1);
    await expect(page.getByRole("cell", { name: "Succeeded" })).toHaveCount(1);
  });

  test("shows an error toast when checkout fails instead of navigating", async ({ page }) => {
    await mockCheckout(page, {
      provider: "STRIPE",
      status: 500,
    });

    await page.goto("/recruiter/billing");
    await page.getByRole("button", { name: "Buy with Stripe" }).first().click();

    await expect(page.getByText("Checkout could not be created")).toBeVisible();
    await expect(page).toHaveURL(/\/recruiter\/billing$/);
  });

  test("shows an error toast when the provider URL is missing", async ({ page }) => {
    await mockCheckout(page, {
      provider: "STRIPE",
      rawResponse: { someOtherField: "nope" },
    });

    await page.goto("/recruiter/billing");
    await page.getByRole("button", { name: "Buy with Stripe" }).first().click();

    await expect(
      page.getByText("The payment provider did not return a checkout URL."),
    ).toBeVisible({ timeout: 10_000 });
    await expect(page).toHaveURL(/\/recruiter\/billing$/);
  });

  test("renders empty state when there are no payments", async ({ page }) => {
    await mockPaymentList(page, { payments: [] });

    await page.goto("/recruiter/billing");
    await expect(page.getByText("No payments yet")).toBeVisible();
  });
});

test.describe("Credit balance refresh", () => {
  test("shows updated credits after a payment is recorded", async ({ page }) => {
    await seedRecruiterSession(page);
    await mockCompany(page, { ...COMPANY, credits: 75 });
    await mockPaymentList(page, {
      payments: [
        makePayment({
          id: "pay_1",
          status: "SUCCEEDED",
          creditsPurchased: 10,
          amount: 10,
          invoiceNumber: "INV-2001",
        }),
      ],
    });

    await page.goto("/recruiter/billing");
    await expect(page.getByText("Available credits")).toBeVisible();
    await expect(page.getByText("75", { exact: true })).toBeVisible();
  });
});