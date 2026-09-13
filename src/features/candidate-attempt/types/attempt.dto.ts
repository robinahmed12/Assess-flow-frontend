export type AttemptStatus =
 | "IN_PROGRESS"
 | "SUBMITTED"
 | "EVALUATED"
 | "EXPIRED";

export type ProblemType =
 | "MCQ"
 | "WRITTEN"
 | "CODING";

export interface AttemptProblemDto {
 id:string;
 title:string;
 description:string;
 type:ProblemType;
 points:number;

 options?:{
  id:string;
  text:string;
 }[];
}

export interface AttemptDetailDto {
 id:string;
 status:AttemptStatus;
 expiresAt:string;

 assessment:{
  id:string;
  title:string;
  problems:AttemptProblemDto[];
 };

 answers:{
  problemId:string;
  answerText?:string|null;
  selectedOptionId?:string|null;
 }[];
}
