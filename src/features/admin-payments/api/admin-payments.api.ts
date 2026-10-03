import {apiClient} from "@/shared/api/client";
import {unwrap} from "@/shared/api/envelope";
import type {
 AdminPaymentDto,
 PaymentFilterDto
} from "../types/payment.dto";


export const adminPaymentsApi={


list:(params?:PaymentFilterDto)=>

 unwrap(
  apiClient<AdminPaymentDto[]>(
   "/admin/payments",
   {
    params
   }
  )
 )


};
