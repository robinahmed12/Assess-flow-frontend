
import { apiClient } from "@/src/shared/lib/api/api-client";
import type {CompanyDto, UpdateCompanyRequestDto} from "../types/company.dto";
import { unwrap } from "../../auth/api";

export const companyApi = {

 getMe:()=> 
  unwrap(
   apiClient<CompanyDto>(
    "/companies/me"
   )
  ),

 updateMe:(payload:UpdateCompanyRequestDto)=>
  unwrap(
   apiClient<CompanyDto>(
    "/companies/me",
    {
     method:"PATCH",
     body:payload
    }
   )
  )

};
