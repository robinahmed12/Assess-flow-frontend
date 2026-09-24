"use client";

import {useMutation,useQueryClient} from "@tanstack/react-query";
import {problemApi} from "../api/problem.api";

export function useCreateProblem(){

 const qc=useQueryClient();

 return useMutation({
  mutationFn:problemApi.create,

  onSuccess:()=>{
   qc.invalidateQueries({
    queryKey:["problems","list"]
   });
  }
 });

}
