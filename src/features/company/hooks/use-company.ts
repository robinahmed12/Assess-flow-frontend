"use client";

import {useQuery} from "@tanstack/react-query";
import {companyApi} from "../api/company.api";

export function useCompany(){

 return useQuery({
  queryKey:["company","me"],
  queryFn:companyApi.getMe
 });

}
