"use client";

import {useQuery} from "@tanstack/react-query";
import {paymentApi} from "../api/payment.api";
import type {PaymentListParams} from "../api/payment.api";

const PAGE_LIMIT=100;
const MAX_PAGES=10;


export function usePayments(params:PaymentListParams={}){


 return useQuery({

 queryKey:[
  "payments",
  "recruiter",
  params
 ],

 queryFn:async()=>{

  const first=await paymentApi.listPage({
   ...params,
   page:1,
   limit:PAGE_LIMIT
  });

  const totalPages=Math.max(
   1,
   Math.min(first.meta.totalPages,MAX_PAGES)
  );

  if(totalPages===1)return first.items;

  const rest=await Promise.all(
   Array.from(
    {length:totalPages-1},
    (_,index)=>paymentApi.listPage({
     ...params,
     page:index+2,
     limit:PAGE_LIMIT
    })
   )
  );

  return [
   ...first.items,
   ...rest.flatMap(page=>page.items)
  ];

 }

 });

}
