
import { apiClient } from "@/src/shared/lib/api/api-client";
import type {ProblemDto,CreateProblemRequestDto} from "../types/problem.dto";
import { unwrap } from "../../auth/api/auth.api";

export const problemApi={

 list:()=> 
  unwrap(
   apiClient<ProblemDto[]>("/problems")
  ),

 get:(id:string)=>
  unwrap(
   apiClient<ProblemDto>(`/problems/${id}`)
  ),

 create:(payload:CreateProblemRequestDto)=>
  unwrap(
   apiClient<ProblemDto>("/problems",{
    method:"POST",
    body:payload
   })
  ),

 update:(id:string,payload:Partial<CreateProblemRequestDto>)=>
  unwrap(
   apiClient<ProblemDto>(`/problems/${id}`,{
    method:"PATCH",
    body:payload
   })
  ),

 archive:(id:string)=>
  unwrap(
   apiClient(`/problems/${id}`,{
    method:"DELETE"
   })
  )

};
