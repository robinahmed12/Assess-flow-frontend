export type ProblemType =
 | "MCQ"
 | "WRITTEN"
 | "CODING";

export type ProblemStatus =
 | "ACTIVE"
 | "ARCHIVED";

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
 status:ProblemStatus;
 options?:ProblemOptionDto[];
 createdAt?:string;
 updatedAt?:string;
}

export interface CreateProblemOptionDto {
 text:string;
 isCorrect:boolean;
}

export interface CreateProblemRequestDto {
 title:string;
 description:string;
 type:ProblemType;
 points:number;
 difficulty?:string;
 tags:string[];
 options?:CreateProblemOptionDto[];
}

export type UpdateProblemRequestDto=Partial<CreateProblemRequestDto>;
