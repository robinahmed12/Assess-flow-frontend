"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/shared/components/ui/card";
import { SaveStatus } from "./save-status";
import type { AttemptProblemDto } from "../types/attempt.dto";

export type LocalAnswer =
  | { type: "MCQ"; selectedOptionId: string }
  | { type: "WRITTEN" | "CODING"; answerText: string };

export function questionValue(problem: AttemptProblemDto, answer: LocalAnswer | undefined): string {
  if (!answer) return "";
  if (problem.type === "MCQ" && answer.type === "MCQ") {
    return answer.selectedOptionId;
  }
  if (problem.type !== "MCQ" && answer.type !== "MCQ") {
    return answer.answerText;
  }
  return "";
}

export function QuestionCard({
  problem,
  value,
  onChange,
  readOnly = false,
  saveState = "idle",
}: {
  problem: AttemptProblemDto;
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
  saveState?: "idle" | "saving" | "saved" | "failed";
}) {
  return (
    <Card size="sm">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-medium tracking-widest text-muted-foreground uppercase">
              Question {problem.order} · {problem.type} · {problem.points} pts
            </span>
            <CardTitle>{problem.title}</CardTitle>
          </div>
          <SaveStatus state={saveState} />
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <p className="text-xs text-muted-foreground">{problem.description}</p>

        {problem.type === "MCQ" ? (
          <div className="flex flex-col gap-2" role="radiogroup" aria-label={problem.title}>
            {problem.options?.map((option) => (
              <label
                key={option.id}
                className={`flex cursor-pointer items-center gap-2.5 rounded-none border px-3 py-2 text-xs transition-colors ${
                  value === option.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:bg-muted"
                } ${readOnly ? "cursor-not-allowed opacity-60" : ""}`}
              >
                <input
                  type="radio"
                  name={`problem-${problem.id}`}
                  checked={value === option.id}
                  disabled={readOnly}
                  onChange={() => onChange(option.id)}
                  className="size-3.5 accent-primary"
                />
                <span className="text-foreground">{option.text}</span>
              </label>
            ))}
          </div>
        ) : (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={readOnly}
            placeholder="Write your answer..."
            rows={6}
            className="w-full rounded-none border border-border bg-background p-3 text-xs text-foreground outline-none placeholder:text-muted-foreground focus-visible:border-ring disabled:cursor-not-allowed disabled:opacity-60"
          />
        )}
      </CardContent>
    </Card>
  );
}
