"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Lock, MessageSquareText } from "lucide-react";

import { useAttemptEvaluation } from "../hooks/use-attempt-evaluation";
import { useEvaluateAnswer } from "../hooks/use-evaluate-answer";
import { useFinalizeEvaluation } from "../hooks/use-finalize-evaluation";
import { ATTEMPT_STATUS_LABELS } from "../constants/assessment.constants";
import type {
  AttemptEvaluationDto,
  EvaluationQuestionDto,
} from "../types/assessment.dto";

import {
  Button,
  buttonVariants,
} from "@/src/shared/components/ui/button";
import { Badge } from "@/src/shared/components/ui/badge";
import { Input } from "@/src/shared/components/ui/input";
import { Label } from "@/src/shared/components/ui/label";
import { Textarea } from "@/src/shared/components/ui/textarea";
import { Skeleton } from "@/src/shared/components/ui/skeleton";
import { Separator } from "@/src/shared/components/ui/separator";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/src/shared/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/src/shared/components/ui/alert-dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/shared/components/ui/card";

/** Only a submitted attempt can be scored; everything else is read-only. */
const EDITABLE_STATUS = "SUBMITTED";

export function AssessmentAttemptReviewPage({
  assessmentId,
  attemptId,
}: {
  assessmentId: string;
  attemptId: string;
}) {
  const evaluation = useAttemptEvaluation(attemptId);
  const finalize = useFinalizeEvaluation();

  const data = evaluation.data;

  const maxTotalScore = useMemo(
    () =>
      (data?.questions ?? []).reduce(
        (total, question) => total + question.maxScore,
        0,
      ),
    [data?.questions],
  );

  // Mirrors the backend finalize guard: a written/coding answer needs a score
  // before the attempt can be locked in.
  const unansweredManual = useMemo(
    () =>
      (data?.questions ?? []).filter(
        (question) =>
          question.requiresManualEvaluation && question.answer === null,
      ).length,
    [data?.questions],
  );

  const unscoredManual = useMemo(
    () =>
      (data?.questions ?? []).filter(
        (question) =>
          question.requiresManualEvaluation && question.answer?.score == null,
      ).length,
    [data?.questions],
  );

  const canEdit = data?.status === EDITABLE_STATUS;
  const canFinalize = canEdit && unscoredManual === 0;

  const backHref = `/recruiter/assessments/${assessmentId}/submissions`;

  return (
    <main className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <Link
            href={backHref}
            className={buttonVariants({ variant: "ghost", size: "sm" })}
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Submissions
          </Link>

          <h1 className="text-2xl font-bold">
            {data ? "Review submission" : "Submission review"}
          </h1>

          <p className="text-sm text-muted-foreground">
            {data
              ? `${data.assessment.title} · ${data.candidate.email}`
              : "Scoring and feedback for a candidate attempt"}
          </p>
        </div>

        {data && (
          <Badge variant={data.status === "EVALUATED" ? "default" : "secondary"}>
            {ATTEMPT_STATUS_LABELS[data.status]}
          </Badge>
        )}
      </div>

      {evaluation.isLoading ? (
        <ReviewSkeleton />
      ) : evaluation.isError ? (
        <Alert variant="destructive">
          <AlertTitle>Could not load this submission</AlertTitle>
          <AlertDescription>
            {evaluation.error.message ||
              "The attempt may belong to another assessment."}
          </AlertDescription>
        </Alert>
      ) : data ? (
        <ReviewContent
          data={data}
          canEdit={canEdit}
          canFinalize={canFinalize}
          unscoredManual={unscoredManual}
          unansweredManual={unansweredManual}
          maxTotalScore={maxTotalScore}
          backHref={backHref}
          onFinalize={() => finalize.mutate(data.id)}
          isFinalizing={finalize.isPending}
        />
      ) : null}
    </main>
  );
}

function ReviewContent({
  data,
  canEdit,
  canFinalize,
  unscoredManual,
  unansweredManual,
  maxTotalScore,
  backHref,
  onFinalize,
  isFinalizing,
}: {
  data: AttemptEvaluationDto;
  canEdit: boolean;
  canFinalize: boolean;
  unscoredManual: number;
  unansweredManual: number;
  maxTotalScore: number;
  backHref: string;
  onFinalize: () => void;
  isFinalizing: boolean;
}) {
  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Summary</CardTitle>

          {canEdit ? (
            <FinalizeDialog
              canFinalize={canFinalize}
              isFinalizing={isFinalizing}
              onFinalize={onFinalize}
            />
          ) : (
            <Badge variant="outline" className="gap-1">
              <Lock className="h-3 w-3" />
              Read only
            </Badge>
          )}
        </CardHeader>

        <CardContent className="space-y-4 pt-0">
          <dl className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
            <SummaryItem label="Candidate" value={data.candidate.name ?? "—"} />
            <SummaryItem label="Email" value={data.candidateEmail} />
            <SummaryItem
              label="Submitted"
              value={formatDateTime(data.submittedAt)}
            />
            <SummaryItem label="Duration" value={`${data.assessment.duration} min`} />
          </dl>

          <Separator />

          <dl className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
            <SummaryItem
              label="Score"
              value={
                data.totalScore == null
                  ? "—"
                  : `${data.totalScore} / ${maxTotalScore}`
              }
            />
            <SummaryItem
              label="Percentage"
              value={data.percentage == null ? "—" : `${data.percentage}%`}
            />
            <SummaryItem
              label="Passing score"
              value={
                data.assessment.passingScore == null
                  ? "—"
                  : String(data.assessment.passingScore)
              }
            />
            <div className="space-y-1">
              <dt className="text-xs text-muted-foreground">Result</dt>
              <dd>
                {data.passed == null ? (
                  <span className="text-muted-foreground">Pending</span>
                ) : data.passed ? (
                  <Badge>Passed</Badge>
                ) : (
                  <Badge variant="destructive">Failed</Badge>
                )}
              </dd>
            </div>
          </dl>

          {canEdit && (unscoredManual > 0 || unansweredManual > 0) && (
            <Alert>
              <AlertTitle>Scoring incomplete</AlertTitle>
              <AlertDescription>
                {unscoredManual > 0
                  ? `${unscoredManual} written/coding answer${
                      unscoredManual === 1 ? "" : "s"
                    } still need${
                      unscoredManual === 1 ? "s" : ""
                    } a score. `
                  : ""}
                {unansweredManual > 0
                  ? `${unansweredManual} question${
                      unansweredManual === 1 ? "" : "s"
                    } ${unansweredManual === 1 ? "was" : "were"} left unanswered and cannot be scored from here. `
                  : ""}
                The attempt cannot be finalized until this is resolved.
              </AlertDescription>
            </Alert>
          )}

          {data.status === "EVALUATED" && (
            <Alert>
              <AlertTitle>Evaluation finalized</AlertTitle>
              <AlertDescription>
                Scores are locked and the candidate has been notified.
              </AlertDescription>
            </Alert>
          )}

          {data.status === "IN_PROGRESS" && (
            <Alert>
              <AlertTitle>Attempt not submitted yet</AlertTitle>
              <AlertDescription>
                Scoring unlocks once the candidate submits.
              </AlertDescription>
            </Alert>
          )}

          {data.status === "EXPIRED" && (
            <Alert>
              <AlertTitle>Attempt expired</AlertTitle>
              <AlertDescription>
                Expired attempts cannot be scored or finalized.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {data.questions.map((question) => (
        <QuestionCard
          key={question.assessmentProblemId}
          question={question}
          attemptId={data.id}
          canEdit={canEdit}
        />
      ))}

      <Separator />

      <div className="flex justify-end">
        <Link
          href={backHref}
          className={buttonVariants({ variant: "outline", size: "sm" })}
        >
          Back to submissions
        </Link>
      </div>
    </>
  );
}

function FinalizeDialog({
  canFinalize,
  isFinalizing,
  onFinalize,
}: {
  canFinalize: boolean;
  isFinalizing: boolean;
  onFinalize: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <Button
        size="sm"
        disabled={!canFinalize || isFinalizing}
        onClick={() => setOpen(true)}
      >
        {isFinalizing ? "Finalizing…" : "Finalize evaluation"}
      </Button>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Finalize this evaluation?</AlertDialogTitle>
          <AlertDialogDescription>
            This locks every score, marks the attempt as evaluated and emails
            the result to the candidate. This cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isFinalizing}>
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            disabled={isFinalizing}
            onClick={(event) => {
              // The dialog closes on click; keep it open while the request is
              // in flight so a failure stays visibly recoverable.
              event.preventDefault();
              onFinalize();
            }}
          >
            {isFinalizing ? "Finalizing…" : "Finalize and notify"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function QuestionCard({
  question,
  attemptId,
  canEdit,
}: {
  question: EvaluationQuestionDto;
  attemptId: string;
  canEdit: boolean;
}) {
  const evaluate = useEvaluateAnswer();

  const { problem, answer } = question;
  const maxScore = question.maxScore;

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-3">
        <CardTitle className="text-base">
          <span className="text-muted-foreground">
            Q{question.order}.{" "}
          </span>
          {problem.title}
        </CardTitle>

        <div className="flex shrink-0 items-center gap-2">
          <Badge variant="outline">{problem.type}</Badge>
          <Badge variant="secondary">{maxScore} pts</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-0">
        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
          {problem.description}
        </p>

        <Separator />

        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">
            Candidate answer
          </p>

          {answer === null ? (
            <p className="text-sm text-muted-foreground italic">
              Not answered
            </p>
          ) : question.requiresManualEvaluation ? (
            <p className="text-sm whitespace-pre-wrap">
              {answer.answerText?.trim() || "No answer provided"}
            </p>
          ) : (
            <p className="text-sm">
              {resolveSelectedOptionText(problem, answer.selectedOptionId) ??
                "No option selected"}
            </p>
          )}
        </div>

        {question.requiresManualEvaluation ? (
          answer === null ? (
            <Alert>
              <AlertTitle>Unanswered</AlertTitle>
              <AlertDescription>
                There is no answer record to score, so this question blocks
                finalization.
              </AlertDescription>
            </Alert>
          ) : (
            <ManualEvaluationForm
              attemptId={attemptId}
              answerId={answer.id}
              maxScore={maxScore}
              initialScore={answer.score}
              initialFeedback={answer.feedback}
              disabled={!canEdit || evaluate.isPending}
              isPending={evaluate.isPending}
              onSave={(payload) =>
                evaluate.mutate({ attemptId, answerId: answer.id, payload })
              }
            />
          )
        ) : (
          <AutoScoreRow
            score={answer?.score ?? null}
            maxScore={maxScore}
            feedback={answer?.feedback ?? null}
          />
        )}
      </CardContent>
    </Card>
  );
}

function ManualEvaluationForm({
  attemptId,
  answerId,
  maxScore,
  initialScore,
  initialFeedback,
  disabled,
  isPending,
  onSave,
}: {
  attemptId: string;
  answerId: string;
  maxScore: number;
  initialScore: number | null;
  initialFeedback: string | null;
  disabled: boolean;
  isPending: boolean;
  onSave: (payload: { score: number; feedback?: string }) => void;
}) {
  const [score, setScore] = useState(
    initialScore == null ? "" : String(initialScore),
  );
  const [feedback, setFeedback] = useState(initialFeedback ?? "");
  const [error, setError] = useState<string | null>(null);

  const parsed = Number(score);
  const isValid =
    score.trim() !== "" && Number.isFinite(parsed) && parsed >= 0 && parsed <= maxScore;

  return (
    <div className="space-y-3 rounded-md border p-3">
      <div className="grid gap-3 sm:grid-cols-[8rem_1fr] sm:items-start">
        <div className="space-y-2">
          <Label htmlFor={`score-${answerId}`}>
            Score <span className="text-muted-foreground">/ {maxScore}</span>
          </Label>
          <Input
            id={`score-${answerId}`}
            type="number"
            inputMode="decimal"
            min={0}
            max={maxScore}
            step="any"
            value={score}
            disabled={disabled}
            onChange={(event) => {
              setScore(event.target.value);
              setError(null);
            }}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={`feedback-${answerId}`} className="gap-1">
            <MessageSquareText className="h-3.5 w-3.5" />
            Feedback
          </Label>
          <Textarea
            id={`feedback-${answerId}`}
            rows={4}
            maxLength={5000}
            placeholder="Visible to the candidate"
            value={feedback}
            disabled={disabled}
            onChange={(event) => setFeedback(event.target.value)}
          />
        </div>
      </div>

      {error && (
        <p className="text-xs text-destructive" role="alert">
          {error}
        </p>
      )}

      <div className="flex items-center justify-end gap-2">
        {initialScore != null && !isPending && (
          <span className="mr-auto text-xs text-muted-foreground">
            Previously scored {initialScore} / {maxScore}
          </span>
        )}

        <Button
          size="sm"
          disabled={disabled || !isValid}
          onClick={() => {
            if (!isValid) {
              setError(`Score must be a number between 0 and ${maxScore}.`);
              return;
            }

            const trimmedFeedback = feedback.trim();

            onSave(
              trimmedFeedback
                ? { score: parsed, feedback: trimmedFeedback }
                : { score: parsed },
            );
          }}
        >
          {isPending ? "Saving…" : "Save score"}
        </Button>
      </div>

      {initialScore != null && !isPending && (
        <p className="text-right text-xs text-muted-foreground">
          Attempt {attemptId.slice(0, 8)}…
        </p>
      )}
    </div>
  );
}

function AutoScoreRow({
  score,
  maxScore,
  feedback,
}: {
  score: number | null;
  maxScore: number;
  feedback: string | null;
}) {
  const full = score != null && score >= maxScore;
  const zero = score === 0;

  return (
    <div className="space-y-2 rounded-md border p-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-muted-foreground">
          Auto-scored (MCQ)
        </p>
        <Badge variant={full ? "default" : zero ? "destructive" : "secondary"}>
          {score == null ? "Not scored" : `${score} / ${maxScore}`}
        </Badge>
      </div>

      {feedback && (
        <p className="text-sm whitespace-pre-wrap">{feedback}</p>
      )}
    </div>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}

function resolveSelectedOptionText(
  problem: EvaluationQuestionDto["problem"],
  selectedOptionId: string | null,
) {
  if (!selectedOptionId) return null;

  return (
    problem.options?.find((option) => option.id === selectedOptionId)?.text ??
    null
  );
}

function formatDateTime(value: string | null) {
  if (!value) return "—";

  return new Date(value).toLocaleString();
}

function ReviewSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-40 w-full" />

      {[0, 1, 2].map((index) => (
        <Skeleton key={index} className="h-52 w-full" />
      ))}
    </div>
  );
}