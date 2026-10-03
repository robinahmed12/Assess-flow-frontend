export interface AuditLogDto {

 id:string;

 action:string;

 entityType:string;

 entityId:string;

 metadata?:unknown;

 createdAt:string;

 actor?:{
  id:string;
  name:string;
  email:string;
 };

}


export interface AuditLogFilterDto {

 page?:number;

 limit?:number;

 actorId?:string;

 action?:string;

 entityType?:string;

 entityId?:string;

 from?:string;

 to?:string;

 sortOrder?:"asc"|"desc";

}
