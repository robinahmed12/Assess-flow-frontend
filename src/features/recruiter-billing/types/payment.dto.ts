export type PaymentStatus =
  | "PENDING"
  | "SUCCEEDED"
  | "FAILED"
  | "REFUNDED";


export interface PaymentDto {

  id:string;

  amount:number;

  creditsPurchased:number;

  status:PaymentStatus;

  stripeSessionId?:string|null;

  stripePaymentIntentId?:string|null;

  bkashPaymentId?:string|null;

  bkashTransactionId?:string|null;

  invoiceNumber?:string|null;

  invoiceEmailSentAt?:string|null;

  companyId?:string|null;

  createdAt:string;

  updatedAt?:string|null;

}


export interface CheckoutRequestDto {
  packageCode:string;
}


export interface CheckoutResponseDto {
  url:string;
}
