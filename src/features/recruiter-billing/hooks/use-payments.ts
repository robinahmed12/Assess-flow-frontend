"use client";

import {useQuery} from "@tanstack/react-query";
import {paymentApi} from "../api/payment.api";


export function usePayments(){

return useQuery({

queryKey:[
 "payments",
 "recruiter"
],

queryFn:paymentApi.list

});

}
