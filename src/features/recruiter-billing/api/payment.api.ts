
import { apiClient } from "@/src/shared/lib/api/api-client";
import type {
  CheckoutRequestDto,
  CheckoutResponseDto,
  PaymentDto,
  PaymentStatus
} from "../types/payment.dto";
import { unwrap } from "../../auth/api";
import { CHECKOUT_URL_KEYS } from "../constants/payment.constants";


type CheckoutRawResponse =
  | string
  | {
      url?: unknown;
      checkoutUrl?: unknown;
      bkashURL?: unknown;
      paymentUrl?: unknown;
      redirectUrl?: unknown;
      checkout?: {
        url?: unknown;
        checkoutUrl?: unknown;
        bkashURL?: unknown;
        paymentUrl?: unknown;
        redirectUrl?: unknown;
      };
      bkash?: {
        bkashURL?: unknown;
        url?: unknown;
        paymentUrl?: unknown;
        redirectUrl?: unknown;
      };
    };

function toCheckoutResponse(raw: CheckoutRawResponse): CheckoutResponseDto {
  const fromObject = (obj: Exclude<CheckoutRawResponse, string>): string | null => {
    const candidates = [
      ...CHECKOUT_URL_KEYS.map((key) => obj[key]),
      obj.checkout?.url,
      obj.checkout?.checkoutUrl,
      obj.checkout?.bkashURL,
      obj.checkout?.paymentUrl,
      obj.checkout?.redirectUrl,
      obj.bkash?.bkashURL,
      obj.bkash?.url,
      obj.bkash?.paymentUrl,
      obj.bkash?.redirectUrl,
    ];

    const url = candidates.find(
      (value): value is string => typeof value === "string" && value.trim().length > 0
    );

    return url ? url.trim() : null;
  };

  const url =
    typeof raw === "string"
      ? raw.trim()
      : raw && typeof raw === "object"
        ? fromObject(raw)
        : null;

  if (!url) {
    throw new Error("The payment provider did not return a checkout URL.");
  }

  return { url };
}


export interface PaymentListParams {
  page?: number;
  limit?: number;
  status?: PaymentStatus;
}

export interface PaymentPage {
  items: PaymentDto[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

type PaymentListResponse =
  | PaymentDto[]
  | {
      meta?: {
        page?: number;
        limit?: number;
        total?: number;
        totalPages?: number;
      };
      data?: PaymentDto[];
      payments?: PaymentDto[];
      items?: PaymentDto[];
      results?: PaymentDto[];
      rows?: PaymentDto[];
    };

function toPaymentPage(raw: PaymentListResponse): PaymentPage {
  if (Array.isArray(raw)) {
    return {
      items: raw,
      meta: {
        page: 1,
        limit: raw.length,
        total: raw.length,
        totalPages: 1,
      },
    };
  }

  const items =
    [raw.data, raw.payments, raw.items, raw.results, raw.rows].find(
      (value): value is PaymentDto[] => Array.isArray(value)
    ) ?? [];
  const meta = raw.meta ?? {};

  return {
    items,
    meta: {
      page: meta.page ?? 1,
      limit: meta.limit ?? items.length,
      total: meta.total ?? items.length,
      totalPages: meta.totalPages ?? 1,
    },
  };
}


export const paymentApi={


stripeCheckout:(payload:CheckoutRequestDto)=>
  unwrap(
   apiClient<CheckoutRawResponse>(
    "/stripe-payments/checkout",
    {
     method:"POST",
     body:payload
    }
   )
  ).then(toCheckoutResponse),


bkashCheckout:(payload:CheckoutRequestDto)=>
  unwrap(
   apiClient<CheckoutRawResponse>(
    "/bkash-payments/checkout",
    {
     method:"POST",
     body:payload
    }
   )
  ).then(toCheckoutResponse),


listPage:(params:PaymentListParams={})=>{
  const query=new URLSearchParams();

  if(params.page)query.set("page",String(params.page));
  if(params.limit)query.set("limit",String(params.limit));
  if(params.status)query.set("status",params.status);

  const qs=query.toString();

  return unwrap<PaymentListResponse>(
   apiClient<PaymentListResponse>(
    `/stripe-payments${qs?`?${qs}`:""}`
   )
  ).then(toPaymentPage);
},


detail:(id:string)=>
  unwrap(
   apiClient<PaymentDto>(
    `/stripe-payments/${id}`
   )
  )

};
