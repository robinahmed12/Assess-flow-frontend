
import { apiClient } from "@/src/shared/lib/api/api-client";
import { unwrap } from "../../auth/api/auth.api";
import type {AdminDashboardDto} from "../types/admin-dashboard.dto";


export const adminDashboardApi={

 getStats:()=> 
  unwrap(
   apiClient<AdminDashboardDto>(
    "/admin/dashboard-stats"
   )
  )

};
