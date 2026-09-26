"use client";

import {
 useMutation,
 useQueryClient
} from "@tanstack/react-query";

import {companyApi} from "../api/company.api";


export function useUpdateCompany(){

 const queryClient=useQueryClient();

 return useMutation({

  mutationFn:companyApi.updateMe,

  onSuccess:()=>{

   queryClient.invalidateQueries({
    queryKey:["company","me"]
   });

  }

 });

}
