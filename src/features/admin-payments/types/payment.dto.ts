export type PaymentStatus =
 | "PENDING"
 | "SUCCEEDED"
 | "FAILED"
 | "REFUNDED";


export interface AdminPaymentDto {

 id:string;

 amount:number;

 creditsPurchased:number;

 status:PaymentStatus;

 company:{
  id:string;
  name:string;
  slug:string;
 };

 createdAt:string;

}


export interface PaymentFilterDto {

 page?:number;

 limit?:number;

 status?:PaymentStatus;

 companyId?:string;

 sortOrder?:"asc"|"desc";

}
