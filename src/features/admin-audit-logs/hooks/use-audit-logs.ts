"use client";

import {useQuery} from "@tanstack/react-query";
import {auditLogApi} from "../api/audit-log.api";


export function useAuditLogs(){

return useQuery({

 queryKey:[
  "admin",
  "audit-logs"
 ],

 queryFn:()=>auditLogApi.list()

});

}
