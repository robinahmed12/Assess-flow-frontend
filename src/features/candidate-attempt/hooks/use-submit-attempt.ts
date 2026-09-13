"use client";

import {useMutation} from "@tanstack/react-query";
import {attemptApi} from "../api/attempt.api";

export function useSubmitAttempt(){

 return useMutation({
  mutationFn:(id:string)=>
    attemptApi.submit(id),
 });
}
