import {apiClient} from "@/shared/api/client";
import {unwrap} from "@/shared/api/envelope";
import type {
 AdminUserDto,
 UserListParams
} from "../types/admin-user.dto";


export const adminUsersApi={


list:(params?:UserListParams)=>

 unwrap(
  apiClient<AdminUserDto[]>(
   "/admin/users",
   {
    params
   }
  )
 ),


updateStatus:(
 id:string,
 status:"ACTIVE"|"SUSPENDED"
)=>

 unwrap(
  apiClient(
   `/admin/users/${id}/status`,
   {
    method:"PATCH",
    body:{
     status
    }
   }
  )
 )

};
