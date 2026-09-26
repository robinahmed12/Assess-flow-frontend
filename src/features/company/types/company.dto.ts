export interface CompanyDto {
 id:string;
 name:string;
 slug:string;
 credits:number;

 companyLicensePaperUrl:string|null;
 selfDocumentUrl:string|null;

 createdAt:string;
 updatedAt:string;
}

export interface UpdateCompanyRequestDto {
 name:string;
}
