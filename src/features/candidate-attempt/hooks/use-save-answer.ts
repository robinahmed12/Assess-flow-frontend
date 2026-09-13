"use client";

import {useMutation} from "@tanstack/react-query";
import {attemptApi} from "../api/attempt.api";

export function useSaveAnswer(){

 return useMutation({
  mutationFn:({
    attemptId,
    problemId,
    payload,
  }:{
    attemptId:string;
    problemId:string;
    payload:object;
  }) =>
    attemptApi.saveAnswer(
      attemptId,
      problemId,
      payload
    ),
 });
}
