"use client";

import { useRef, useState } from "react";
import { ChartLineUpIcon } from "@phosphor-icons/react";

import { Button } from "@/src/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/shared/components/ui/card";
import { useAttemptDetail } from "../hooks/use-attempt-detail";
import { useSaveAnswer } from "../hooks/use-save-answer";
import { useSubmitAttempt } from "../hooks/use-submit-attempt";
import { AutosaveQueue } from "../utils/autosave-queue";
import { isReadOnly } from "../utils/attempt-mode";
import type { SaveAnswerPayload } from "../api/attempt.api";
import { AttemptTimer } from "./attempt-timer";
import {
  QuestionCard,
  questionValue,
  type LocalAnswer,
} from "./question-card";
import { QuestionNavigator } from "./question-navigator";
import { SubmitDialog } from "./submit-dialog";

type SaveState = "idle" | "saving" | "saved" | "failed";

function toPayload(answer: LocalAnswer): SaveAnswerPayload {
  return answer.type === "MCQ"
    ? { selectedOptionId: answer.selectedOptionId }
    : { answerText: answer.answerText };
}

function fromServerAnswer(answer: {
  selectedOptionId: string | null;
  answerText: string | null;
}): LocalAnswer | null {
  if (answer.selectedOptionId) {
    return { type: "MCQ", selectedOptionId: answer.selectedOptionId };
  }
  if (answer.answerText) {
    return { type: "WRITTEN", answerText: answer.answerText };
  }
  return null;
}

export function AttemptWorkspace({ attemptId }: { attemptId: string }) {
  const { data, isLoading, isError } = useAttemptDetail(attemptId);
  const save = useSaveAnswer();
  const submit = useSubmitAttempt();

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, LocalAnswer>>({});
  const [saveStates, setSaveStates] = useState<Record<string, SaveState>>({});
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [hydratedAttemptId, setHydratedAttemptId] = useState<string | null>(null);
  const autosave = useRef(new AutosaveQueue());

  const status = data?.status ?? "IN_PROGRESS";
  const readOnly = isReadOnly(status);
  const problems = data?.assessment?.problems ?? [];

  // Hydrate saved server answers once per attempt (render-phase adjustment).
  if (data && hydratedAttemptId !== data.id) {
    const hydrated: Record<string, LocalAnswer> = {};
    for (const answer of data.answers) {
      const local = fromServerAnswer(answer);
      if (local) {
        hydrated[answer.problemId] = local;
      }
    }
    setHydratedAttemptId(data.id);
    setAnswers(hydrated);
  }

  const problem = problems[current];

  const answeredCount = problems.filter((p) => answers[p.id] !== undefined).length;

  function handleChange(problemId: string, rawValue: string) {
    if (!problem || readOnly) return;

    const value: LocalAnswer =
      problem.type === "MCQ"
        ? { type: "MCQ", selectedOptionId: rawValue }
        : { type: "WRITTEN", answerText: rawValue };

    setAnswers((prev) => ({ ...prev, [problemId]: value }));

    const version = autosave.current.next(problemId);
    setSaveStates((prev) => ({ ...prev, [problemId]: "saving" }));

    save.mutate(
      { attemptId, problemId, payload: toPayload(value) },
      {
        onSuccess: () => {
          if (autosave.current.isLatest(problemId, version)) {
            setSaveStates((prev) => ({ ...prev, [problemId]: "saved" }));
          }
        },
        onError: () => {
          if (autosave.current.isLatest(problemId, version)) {
            setSaveStates((prev) => ({ ...prev, [problemId]: "failed" }));
          }
        },
      },
    );
  }

  function isAnswered(index: number): boolean {
    const p = problems[index];
    return p ? answers[p.id] !== undefined : false;
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4" aria-busy="true">
        <div className="h-8 w-56 animate-pulse rounded-none bg-muted" />
        <div className="h-10 w-40 animate-pulse rounded-none bg-muted" />
        <div className="h-64 animate-pulse rounded-none bg-muted" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="rounded-none border border-destructive/40 bg-destructive/5 p-6 text-xs text-destructive">
        Failed to load this attempt. It may have expired or been removed.
      </div>
    );
  }

  const canSubmit = !readOnly && answeredCount > 0 && !submit.isPending;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="font-heading text-xl font-semibold text-foreground">
            {data.assessment.title}
          </h1>
          <p className="text-xs text-muted-foreground">
            {answeredCount} of {problems.length} answered
          </p>
        </div>
        <AttemptTimer expiresAt={data.expiresAt} />
      </div>

      {readOnly ? (
        <div className="rounded-none border border-border bg-muted/40 px-4 py-2.5 text-xs text-muted-foreground">
          This attempt is {status.toLowerCase().replace("_", " ")} and can no
          longer be edited.
        </div>
      ) : null}

      <QuestionNavigator
        count={problems.length}
        current={current}
        answered={isAnswered}
        onChange={setCurrent}
      />

      {problem ? (
        <QuestionCard
          problem={problem}
          value={questionValue(problem, answers[problem.id])}
          onChange={(value) => handleChange(problem.id, value)}
          readOnly={readOnly}
          saveState={saveStates[problem.id] ?? "idle"}
        />
      ) : null}

      <Card size="sm">
        <CardHeader>
          <CardTitle>Finish</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <p className="text-xs text-muted-foreground">
            {answeredCount} of {problems.length} questions answered. You can
            navigate back and change answers before submitting.
          </p>
          <div>
            <Button
              size="sm"
              disabled={!canSubmit}
              onClick={() => setConfirmOpen(true)}
            >
              <ChartLineUpIcon className="size-4" />
              {submit.isPending ? "Submitting..." : "Submit assessment"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <SubmitDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        onConfirm={() => {
          setConfirmOpen(false);
          submit.mutate(attemptId);
        }}
      />
    </div>
  );
}
