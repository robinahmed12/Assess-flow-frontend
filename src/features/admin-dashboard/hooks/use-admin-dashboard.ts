"use client";

import {useQuery} from "@tanstack/react-query";
import {adminDashboardApi} from "../api/admin-dashboard.api";


export function useAdminDashboard(){

return useQuery({

 queryKey:[
  "dashboard",
  "admin"
 ],

 queryFn:
 adminDashboardApi.getStats

});

}
