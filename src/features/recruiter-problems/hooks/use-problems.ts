"use client";

import {useQuery} from "@tanstack/react-query";
import {problemApi} from "../api/problem.api";

export function useProblems(){

 return useQuery({
  queryKey:["problems","list"],
  queryFn:problemApi.list
 });

}
