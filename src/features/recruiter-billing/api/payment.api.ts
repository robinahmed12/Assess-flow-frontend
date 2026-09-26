
import { apiClient } from "@/src/shared/lib/api/api-client";
import type {
  CheckoutRequestDto,
  CheckoutResponseDto,
  PaymentDto
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
    typeof raw === "string" ? raw.trim() : raw && typeof raw === "object" ? fromObject(raw) : null;

  if (!url) {
    throw new Error("The payment provider did not return a checkout URL.");
  }

  return { url };
}


type PaymentListResponse =
  | PaymentDto[]
  | {
      data?: PaymentDto[];
      payments?: PaymentDto[];
      items?: PaymentDto[];
      results?: PaymentDto[];
      rows?: PaymentDto[];
    };

type PaymentDetailResponse =
  | PaymentDto
  | {
      data?: PaymentDto;
      payment?: PaymentDto;
      item?: PaymentDto;
    };

function toPaymentDto(raw: PaymentDetailResponse): PaymentDto {
  if (raw && typeof raw === "object" && !("id" in raw)) {
    const nested = [raw.data, raw.payment, raw.item];
    const match = nested.find(
      (value): value is PaymentDto =>
        Boolean(value) && typeof value === "object" && "id" in value
    );
    if (match) return match;
  }

  return raw as PaymentDto;
}


function toPaymentList(raw: PaymentListResponse): PaymentDto[] {
  if (Array.isArray(raw)) return raw;

  if (raw && typeof raw === "object") {
    const nested = [
      raw.data,
      raw.payments,
      raw.items,
      raw.results,
      raw.rows,
    ];
    const list = nested.find(
      (value): value is PaymentDto[] => Array.isArray(value)
    );
    if (list) return list;
  }

  return [];
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


list:()=>
  unwrap<PaymentListResponse>(
   apiClient<PaymentListResponse>(
    "/stripe-payments"
   )
  ).then(toPaymentList),


detail:(id:string)=>
  unwrap<PaymentDetailResponse>(
   apiClient<PaymentDetailResponse>(
    `/stripe-payments/${id}`
   )
  ).then(toPaymentDto)

};
