import { apiClient } from "@/shared/api/client";
import { unwrap } from "@/shared/api/envelope";

export const candidateResultApi = {
 getResult:(attemptId:string)=>
  unwrap(
   apiClient(
    `/evaluation/attempts/${attemptId}/result`
   )
  )
};
