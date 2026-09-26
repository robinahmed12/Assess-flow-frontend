"use client";

import {useMutation} from "@tanstack/react-query";
import {paymentApi} from "../api/payment.api";
import type {PaymentProvider} from "../constants/payment.constants";


export function useCheckout(){

 return useMutation({

 mutationFn:({

 provider,
 packageCode

 }:{
 provider:PaymentProvider;
 packageCode:string;
 })=>{

  return provider==="STRIPE"
   ? paymentApi.stripeCheckout({packageCode})
   : paymentApi.bkashCheckout({packageCode});

 }

 });

}
