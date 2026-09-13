"use client";

import {useQuery} from "@tanstack/react-query";
import {candidateResultApi} from "../api/candidate-result.api";

export function useCandidateResult(attemptId:string){
 return useQuery({
  queryKey:["evaluation","result",attemptId],
  queryFn:()=>candidateResultApi.getResult(attemptId),
  enabled:!!attemptId,
 });
}
