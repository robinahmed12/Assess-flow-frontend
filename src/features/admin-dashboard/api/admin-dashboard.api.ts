import {apiClient} from "@/shared/api/client";
import {unwrap} from "@/shared/api/envelope";
import type {AdminDashboardDto} from "../types/admin-dashboard.dto";


export const adminDashboardApi={

 getStats:()=> 
  unwrap(
   apiClient<AdminDashboardDto>(
    "/admin/dashboard-stats"
   )
  )

};
