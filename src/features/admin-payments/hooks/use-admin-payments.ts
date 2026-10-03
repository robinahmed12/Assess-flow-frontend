"use client";

import {useQuery} from "@tanstack/react-query";
import {adminPaymentsApi} from "../api/admin-payments.api";


export function useAdminPayments(){

return useQuery({

 queryKey:[
  "admin",
  "payments"
 ],

 queryFn:()=>adminPaymentsApi.list()

});

}
