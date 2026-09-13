"use client";

import {useQuery} from "@tanstack/react-query";
import {attemptApi} from "../api/attempt.api";

export function useAttemptDetail(id:string){
 return useQuery({
  queryKey:["attempts","detail",id],
  queryFn:()=>attemptApi.getAttempt(id),
  enabled:!!id,
 });
}
