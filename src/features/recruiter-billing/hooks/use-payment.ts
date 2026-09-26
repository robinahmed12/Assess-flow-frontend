"use client";

import {useQuery,type UseQueryOptions} from "@tanstack/react-query";
import {paymentApi} from "../api/payment.api";
import type {PaymentDto} from "../types/payment.dto";
import type {QueryKey} from "@tanstack/react-query";

type PaymentQueryOptions=Partial<
 UseQueryOptions<PaymentDto,Error,PaymentDto,QueryKey>
>;


export function usePayment(
 paymentId:string,
 options:PaymentQueryOptions={}
){


 return useQuery({

 queryKey:[
  "payment",
  "recruiter",
  paymentId
 ],

 queryFn:()=>paymentApi.detail(
  paymentId
 ),

 enabled:Boolean(paymentId),

 ...options

 });

}
