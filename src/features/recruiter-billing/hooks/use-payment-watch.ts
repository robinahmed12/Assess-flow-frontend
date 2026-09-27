"use client";

import {useEffect,useState} from "react";
import {usePayment} from "./use-payment";


export const PAYMENT_POLL_INTERVAL_MS=3000;
export const PAYMENT_POLL_TIMEOUT_MS=120000;


export function usePaymentWatch(paymentId:string|null){


 const [timedOut,setTimedOut]=useState(false);
 const [previousPaymentId,setPreviousPaymentId]=useState(paymentId);


 if(previousPaymentId!==paymentId){

  setPreviousPaymentId(paymentId);
  setTimedOut(false);

 }


 useEffect(()=>{

 if(!paymentId)return;

 const timer=window.setTimeout(
  ()=>setTimedOut(true),
  PAYMENT_POLL_TIMEOUT_MS
 );

 return()=>window.clearTimeout(timer);

 },[paymentId]);


 const query=usePayment(paymentId??"",{

  enabled:Boolean(paymentId),

  refetchInterval:query=>
   !timedOut && query.state.data?.status==="PENDING"
    ? PAYMENT_POLL_INTERVAL_MS
    : false,

  refetchIntervalInBackground:true

 });


 return {
  ...query,
  timedOut
 };

}
