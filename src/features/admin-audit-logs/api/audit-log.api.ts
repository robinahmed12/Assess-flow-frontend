import {apiClient} from "@/shared/api/client";
import {unwrap} from "@/shared/api/envelope";
import type {AuditLogDto,AuditLogFilterDto} from "../types/audit-log.dto";


export const auditLogApi={


list:(params?:AuditLogFilterDto)=>

 unwrap(
  apiClient<AuditLogDto[]>(
   "/admin/audit-logs",
   {
    params
   }
  )
 )

};
