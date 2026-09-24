export type ProblemType =
 | "MCQ"
 | "WRITTEN"
 | "CODING";

export interface ProblemOptionDto {
 id:string;
 text:string;
 isCorrect?:boolean;
}

export interface ProblemDto {
 id:string;
 title:string;
 description:string;
 type:ProblemType;
 points:number;
 difficulty?:string|null;
 tags:string[];
 status:string;
 options?:ProblemOptionDto[];
}

export interface CreateProblemRequestDto {
 title:string;
 description:string;
 type:ProblemType;
 points:number;
 difficulty?:string;
 tags:string[];
 options?:{
  text:string;
  isCorrect:boolean;
 }[];
}
