export type ResultVisibility = "IMMEDIATE" | "AFTER_REVIEW" | "HIDDEN";

export interface ResultAnswerDto {
  id: string;
  problemId: string;
  problemType: "MCQ" | "WRITTEN" | "CODING";
  score: number | null;
  evaluatedAt: string | null;
}

export interface CandidateResultDto {
  attemptId: string;
  status: "SUBMITTED" | "EVALUATED";
  submittedAt: string | null;
  totalScore: number | null;
  maxScore: number | null;
  percentage: number | null;
  passed: boolean | null;
  isFinal: boolean;
  assessment: {
    id: string;
    title: string;
    resultVisibility: ResultVisibility;
  };
  candidate: {
    id: string;
    name: string;
    email: string;
  };
  candidateEmail: string;
  answers: ResultAnswerDto[];
}
