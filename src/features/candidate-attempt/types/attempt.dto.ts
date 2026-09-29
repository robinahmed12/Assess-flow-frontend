export type AttemptStatus =
  | "IN_PROGRESS"
  | "SUBMITTED"
  | "EVALUATED"
  | "EXPIRED";

export type ProblemType = "MCQ" | "WRITTEN" | "CODING";

export interface AttemptProblemDto {
  id: string;
  order: number;
  title: string;
  description: string;
  type: ProblemType;
  points: number;
  difficulty: string | null;
  tags: string[];
  options?: {
    id: string;
    text: string;
  }[];
}

export interface AttemptAnswerDto {
  id: string;
  problemId: string;
  selectedOptionId: string | null;
  answerText: string | null;
  score: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface AttemptDetailDto {
  id: string;
  status: AttemptStatus;
  startedAt: string;
  expiresAt: string;
  submittedAt: string | null;
  score: number | null;
  percentage: number | null;
  passed: boolean | null;
  assessment: {
    id: string;
    title: string;
    description: string | null;
    duration: number;
    passingScore: number | null;
    problems: AttemptProblemDto[];
  };
  answers: AttemptAnswerDto[];
}
