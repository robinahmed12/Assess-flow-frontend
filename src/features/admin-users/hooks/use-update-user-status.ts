"use client";

import {
 useMutation,
 useQueryClient
} from "@tanstack/react-query";

import {adminUsersApi} from "../api/admin-users.api";


export function useUpdateUserStatus(){

const qc=useQueryClient();


return useMutation({

 mutationFn:({
  id,
  status
 }:{
  id:string;
  status:"ACTIVE"|"SUSPENDED";
 })=>
 adminUsersApi.updateStatus(
  id,
  status
 ),


 onSuccess:()=>{

  qc.invalidateQueries({
   queryKey:[
    "admin",
    "users"
   ]
  });

 }

});

}
