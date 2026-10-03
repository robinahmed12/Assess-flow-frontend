export type UserRole =
 | "ADMIN"
 | "RECRUITER"
 | "CANDIDATE";

export type UserStatus =
 | "ACTIVE"
 | "SUSPENDED";


export interface AdminUserDto {

 id:string;

 name:string;

 email:string;

 role:UserRole;

 status:UserStatus;

 createdAt:string;

 updatedAt:string;

}


export interface UserListParams {

 page?:number;

 limit?:number;

 q?:string;

 role?:UserRole;

 status?:UserStatus;

 sortBy?:string;

 sortOrder?:"asc"|"desc";

}
