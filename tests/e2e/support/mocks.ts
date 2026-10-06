import type { Page, Route } from "@playwright/test";

export const APP_ORIGIN = "http://localhost:3000";
export const API_ORIGIN = "http://localhost:5000";

export const RECRUITER_USER = {
  id: "rec_1",
  name: "Test Recruiter",
  email: "recruiter@example.com",
  role: "RECRUITER",
  status: "ACTIVE",
  createdAt: "2026-01-01T00:00:00.000Z",
};

export const COMPANY = {
  id: "co_1",
  name: "Test Co",
  slug: "test-co",
  credits: 0,
  companyLicensePaperUrl: null,
  selfDocumentUrl: null,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

export function makePayment(overrides: Record<string, unknown> = {}) {
  return {
    id: "pay_1",
    amount: 500,
    creditsPurchased: 10,
    status: "PENDING",
    stripeSessionId: null,
    stripePaymentIntentId: null,
    bkashPaymentId: null,
    bkashTransactionId: null,
    invoiceNumber: null,
    invoiceEmailSentAt: null,
    companyId: "co_1",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    ...overrides,
  } as const;
}

export const STRIPE_SESSION_ID = "cs_test_0000001";
export const BKASH_PAYMENT_ID = "pay_bkash_0001";
export const APP_PAYMENT_ID = "pay_1";

export function setAuthCookie(page: Page) {
  return page.context().addCookies([
    {
      name: "accessToken",
      value: "test-access-token",
      url: APP_ORIGIN,
    },
  ]);
}

/** Responds to any request whose pathname starts with `/api/v1/<path>`. */
async function mockPath(
  page: Page,
  path: string,
  handler: (route: Route) => void | Promise<void>,
) {
  await page.route((url) => url.pathname.startsWith(`/api/v1/${path}`), handler);
}

/** Catch-all so an unmocked API call fails loudly and obviously. */
export async function mockUnhandledApi(page: Page) {
  await page.route("**/api/v1/**", (route) =>
    route.fulfill({ status: 404, contentType: "application/json", body: JSON.stringify({ success: false, message: "Unmocked e2e API route" }) }),
  );
}

export async function mockAuth(page: Page, user = RECRUITER_USER) {
  await mockPath(page, "auth/me", (route) =>
    route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(user) }),
  );
}

export async function mockCompany(page: Page, company = COMPANY) {
  await mockPath(page, "companies/me", (route) =>
    route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(company) }),
  );
}

export interface PaymentListMock {
  payments?: ReturnType<typeof makePayment>[];
  status?: number;
}

export async function mockPaymentList(page: Page, options: PaymentListMock = {}) {
  const payments = options.payments ?? [];
  const pageBody = {
    items: payments,
    meta: { page: 1, limit: 100, total: payments.length, totalPages: 1 },
  };
  await mockPath(page, "stripe-payments", (route) => {
    if (/\/stripe-payments\/[^/]+$/.test(route.request().url())) {
      return route.fallback();
    }
    if (options.status) {
      return route.fulfill({ status: options.status, contentType: "application/json", body: JSON.stringify({ success: false, message: "load failed" }) });
    }
    return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(pageBody) });
  });
}

export type PaymentStatus = "PENDING" | "SUCCEEDED" | "FAILED" | "REFUNDED";

/**
 * Mocks `GET /stripe-payments/:id`. Status is taken from `statuses` in
 * call order; the last entry is sticky for all further calls.
 */
export async function mockPaymentDetail(
  page: Page,
  paymentId: string,
  statuses: PaymentStatus[],
  overrides: Record<string, unknown> = {},
) {
  let call = 0;
  await mockPath(page, `stripe-payments/${paymentId}`, (route) => {
    const status = statuses[Math.min(call, statuses.length - 1)];
    call += 1;
    return route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(makePayment({ id: paymentId, status, ...overrides })),
    });
  });
}

export interface CheckoutMock {
  provider: "STRIPE" | "BKASH";
  url?: string;
  /** Preferred as returned by the *live* backend for bKash (`bkashURL`). */
  bkashURL?: string;
  rawResponse?: unknown;
  status?: number;
}

export async function mockCheckout(page: Page, options: CheckoutMock) {
  const path =
    options.provider === "STRIPE" ? "stripe-payments/checkout" : "bkash-payments/checkout";

  await mockPath(page, path, (route) => {
    if (options.status && options.status >= 400) {
      return route.fulfill({
        status: options.status,
        contentType: "application/json",
        body: JSON.stringify({ success: false, message: "Checkout could not be created" }),
      });
    }
    const payload = options.rawResponse ?? {
      url: options.url,
      bkashURL: options.bkashURL,
    };
    return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(payload) });
  });
}

/** A minimal "provider-hosted" page to simulate Stripe Checkout / bKash. */
export async function mockProviderPage(page: Page, origin: string, successUrl: string) {
  await page.route(`${origin}/**`, (route) =>
    route.fulfill({
      status: 200,
      contentType: "text/html",
      body: `<!doctype html><html><body>
        <h1>Mock provider</h1>
        <p>Complete the payment to continue.</p>
        <button id="pay" onclick="window.location.href='${successUrl}'">Pay now</button>
        <button id="cancel" onclick="window.location.href='http://localhost:3000/payments/cancel?reason=cancelled'">Cancel</button>
      </body></html>`,
    }),
  );
}

/** Standard recruiter session: auth cookie + /auth/me + company + 404 catch-all. */
export async function seedRecruiterSession(
  page: Page,
  opts: { user?: typeof RECRUITER_USER; company?: typeof COMPANY } = {},
) {
  await mockUnhandledApi(page);
  await mockAuth(page, opts.user ?? RECRUITER_USER);
  await mockCompany(page, opts.company ?? COMPANY);
  await setAuthCookie(page);
}