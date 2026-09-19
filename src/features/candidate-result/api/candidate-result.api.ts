import { apiClient } from "@/src/shared/lib/api/api-client";
import { unwrap } from "../../auth/api";


export const candidateResultApi = {
 getResult:(attemptId:string)=>
  unwrap(
   apiClient(
    `/evaluation/attempts/${attemptId}/result`
   )
  )
};
