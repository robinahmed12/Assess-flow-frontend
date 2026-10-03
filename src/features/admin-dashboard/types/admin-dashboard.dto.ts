export interface AdminDashboardDto {

 users?:{
  total:number;
  active:number;
  suspended:number;
  byRole?:{
   admin:number;
   recruiter:number;
   candidate:number;
  };
 };

 companies?:{
  total:number;
 };

 problems?:{
  total:number;
 };

 assessments?:{
  total:number;
  draft:number;
  published:number;
  closed:number;
  archived:number;
 };

 attempts?:{
  total:number;
  inProgress:number;
  submitted:number;
  evaluated:number;
  expired:number;
 };

 payments?:{
  total:number;
  pending:number;
  succeeded:number;
  failed:number;
  creditsPurchased:number;
 };

}
