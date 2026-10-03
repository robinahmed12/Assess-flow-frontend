"use client";

import {useQuery} from "@tanstack/react-query";
import {adminUsersApi} from "../api/admin-users.api";


export function useAdminUsers(){

return useQuery({

 queryKey:[
  "admin",
  "users"
 ],

 queryFn:()=>adminUsersApi.list()

});

}
