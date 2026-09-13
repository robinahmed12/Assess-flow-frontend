export type InvitationStatus = "PENDING"|"ACCEPTED"|"REVOKED"|"EXPIRED";
export type AssessmentStatus = "DRAFT"|"PUBLISHED"|"CLOSED"|"ARCHIVED";
export type AttemptStatus = "IN_PROGRESS"|"SUBMITTED"|"EVALUATED"|"EXPIRED";

export interface CandidateAttemptDto {
 id:string;
 status:AttemptStatus;
 startedAt:string;
 expiresAt:string;
 submittedAt:string|null;
 score:number|null;
}

export interface CandidateAssessmentDto {
 id:string;
 token:string;
 candidateEmail:string;
 status:InvitationStatus;
 expiresAt:string|null;

 assessment:{
  id:string;
  title:string;
  description:string|null;
  duration:number;
  passingScore:number|null;
  status:AssessmentStatus;
 };

 attempt:CandidateAttemptDto|null;
}

export interface AttemptHistoryDto {
 id:string;
 status:AttemptStatus;
 startedAt:string;
 expiresAt:string;
 submittedAt:string|null;
 score:number|null;
 percentage:number|null;
 passed:boolean|null;

 assessment:{
  id:string;
  title:string;
  duration:number;
  passingScore:number|null;
 };
}
