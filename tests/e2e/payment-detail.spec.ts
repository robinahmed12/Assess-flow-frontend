import { test, expect } from "@playwright/test";
import {
  BKASH_PAYMENT_ID,
  mockPaymentDetail,
  seedRecruiterSession,
} from "./support/mocks";

test.describe("Recruiter payment detail", () => {
  test("renders a succeeded payment with provider references", async ({ page }) => {
    await seedRecruiterSession(page);
    await mockPaymentDetail(page, BKASH_PAYMENT_ID, ["SUCCEEDED"], {
      amount: 500,
      creditsPurchased: 10,
      invoiceNumber: "INV-5000",
      bkashPaymentId: "bkash_trx_abc",
      bkashTransactionId: "TRX-123",
    });

    await page.goto(`/recruiter/billing/payments/${BKASH_PAYMENT_ID}`);

    await expect(page.getByText(/^Payment pay_bkas/)).toBeVisible();
    await expect(page.getByText("Invoice INV-5000")).toBeVisible();
    await expect(page.getByText("Succeeded").first()).toBeVisible();
    await expect(page.getByText("500.00", { exact: true })).toBeVisible();
    await expect(page.getByText("TRX-123")).toBeVisible();
    await expect(page.getByText("bkash_trx_abc")).toBeVisible();
  });

  test("renders a stripe payment with session and intent references", async ({ page }) => {
    await seedRecruiterSession(page);
    await mockPaymentDetail(page, "pay_stripe_1", ["PENDING"], {
      amount: 1000,
      creditsPurchased: 100,
      invoiceNumber: null,
      stripeSessionId: "cs_live_xyz",
      stripePaymentIntentId: "pi_live_xyz",
    });

    await page.goto("/recruiter/billing/payments/pay_stripe_1");

    await expect(page.getByText("Invoice not issued yet")).toBeVisible();
    await expect(page.getByText("Pending").first()).toBeVisible();
    await expect(page.getByText("cs_live_xyz")).toBeVisible();
    await expect(page.getByText("pi_live_xyz")).toBeVisible();
  });

  test("shows not-found state for a missing payment", async ({ page }) => {
    await seedRecruiterSession(page);
    await page.route((url) => url.pathname === "/api/v1/stripe-payments/pay_ghost", (route) =>
      route.fulfill({
        status: 404,
        contentType: "application/json",
        body: JSON.stringify({ success: false, message: "Payment not found" }),
      }),
    );

    await page.goto("/recruiter/billing/payments/pay_ghost");

    await expect(page.getByText("Payment not found", { exact: true })).toBeVisible();
  });
});