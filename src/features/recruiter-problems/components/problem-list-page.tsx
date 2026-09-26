"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { ChevronRight, Plus, Search } from "lucide-react";

import { useProblems } from "../hooks/use-problems";
import { useArchiveProblem } from "../hooks/use-archive-problem";
import {
  ARCHIVED_STATUS,
  PROBLEM_TYPES,
  PROBLEM_TYPE_BADGE_VARIANTS,
  PROBLEM_TYPE_LABELS,
} from "../constants/problem.constants";
import { formatDifficulty } from "../utils/problem-format";
import type { ProblemDto, ProblemType } from "../types/problem.dto";

import { Button } from "@/src/shared/components/ui/button";
import { Input } from "@/src/shared/components/ui/input";
import { Badge } from "@/src/shared/components/ui/badge";
import { Skeleton } from "@/src/shared/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/shared/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/shared/components/ui/select";
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
import { cn } from "@/src/shared/utils";

type TypeFilter = ProblemType | "ALL";

export function ProblemListPage() {
  const { data = [], isLoading, isError, error, refetch } = useProblems();
  const archive = useArchiveProblem();

  const [search, setSearch] = useState("");
  const [type, setType] = useState<TypeFilter>("ALL");
  const [archiveId, setArchiveId] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  const archiveTarget = archiveId
    ? data.find((problem) => problem.id === archiveId)
    : undefined;

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();

    return data.filter((problem) => {
      if (type !== "ALL" && problem.type !== type) return false;
      if (!term) return true;

      return (
        problem.title.toLowerCase().includes(term) ||
        problem.description.toLowerCase().includes(term) ||
        problem.tags.some((tag) => tag.toLowerCase().includes(term))
      );
    });
  }, [data, search, type]);

  const filtering = search.trim().length > 0 || type !== "ALL";
  const pointsTotal = filtered.reduce((sum, problem) => sum + problem.points, 0);

  function onArchive() {
    if (!archiveTarget) return;

    archive.mutate(archiveTarget.id, {
      onSuccess: () => {
        setArchiveId(null);
        setExpanded(null);
        toast.success("Problem archived");
      },
      onError: () => {
        setArchiveId(null);
        toast.error("Could not archive problem");
      },
    });
  }

  return (
    <main className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">Problems</h1>
          <p className="text-sm text-muted-foreground">
            Your question bank. Problems you add here can be attached to any
            assessment.
          </p>
        </div>

        <Button>
          <Link href="/recruiter/problems/new">
            <Plus className="h-4 w-4" />
            New problem
          </Link>
        </Button>
      </div>

      {isError ? (
        <LoadError
          message={
            error instanceof Error ? error.message : "Could not load problems."
          }
          onRetry={() => void refetch()}
        />
      ) : isLoading ? (
        <ProblemListSkeleton />
      ) : data.length === 0 ? (
        <div className="rounded-xl border border-dashed p-12 text-center">
          <p className="font-medium">No problems yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Add your first MCQ, written or coding problem to start building
            assessments.
          </p>
          <Button className="mt-5">
            <Link href="/recruiter/problems/new">Create problem</Link>
          </Button>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search title, text or tag"
                className="w-64 pl-8"
                aria-label="Search problems"
              />
            </div>

            <Select
              value={type}
              onValueChange={(value) => setType(value as TypeFilter)}
            >
              <SelectTrigger className="w-40" aria-label="Filter by type">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All types</SelectItem>
                {PROBLEM_TYPES.map((item) => (
                  <SelectItem key={item} value={item}>
                    {PROBLEM_TYPE_LABELS[item]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {filtering && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearch("");
                  setType("ALL");
                }}
              >
                Clear
              </Button>
            )}

            <span className="ml-auto text-xs text-muted-foreground">
              {filtered.length} of {data.length} · {pointsTotal} pts
            </span>
          </div>

          {filtered.length === 0 ? (
            <p className="rounded-xl border border-dashed p-10 text-center text-sm text-muted-foreground">
              No problems match your search.
            </p>
          ) : (
            <div className="overflow-x-auto rounded-xl border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Problem</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Difficulty</TableHead>
                    <TableHead className="text-right">Points</TableHead>
                    <TableHead>Tags</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filtered.map((problem) => (
                    <ProblemRows
                      key={problem.id}
                      problem={problem}
                      isOpen={expanded === problem.id}
                      onToggle={() =>
                        setExpanded((current) =>
                          current === problem.id ? null : problem.id,
                        )
                      }
                      onArchive={() => setArchiveId(problem.id)}
                      archiving={archive.isPending && archive.variables === problem.id}
                    />
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </>
      )}

      <AlertDialog
        open={Boolean(archiveId)}
        onOpenChange={(open) => !open && setArchiveId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Archive problem?</AlertDialogTitle>
            <AlertDialogDescription>
              {archiveTarget ? (
                <>
                  <span className="font-semibold">{archiveTarget.title}</span>{" "}
                  will be archived and can no longer be added to assessments.
                  Assessments already using it are not affected.
                </>
              ) : (
                "This problem will be archived."
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={archive.isPending}
              onClick={onArchive}
            >
              Archive
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}

/* ---------- row + MCQ disclosure ---------- */

function ProblemRows({
  problem,
  isOpen,
  onToggle,
  onArchive,
  archiving,
}: {
  problem: ProblemDto;
  isOpen: boolean;
  onToggle: () => void;
  onArchive: () => void;
  archiving: boolean;
}) {
  const archived = problem.status === ARCHIVED_STATUS;
  const options = problem.options ?? [];
  const revealable = problem.type === "MCQ" && options.length > 0;

  return (
    <>
      <TableRow>
        <TableCell className="max-w-[320px]">
          <p className="font-medium">{problem.title}</p>
          <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
            {problem.description || "No description set."}
          </p>
          {archived && (
            <Badge variant="destructive" className="mt-1.5">
              Archived
            </Badge>
          )}
        </TableCell>

        <TableCell>
          <Badge variant={PROBLEM_TYPE_BADGE_VARIANTS[problem.type]}>
            {PROBLEM_TYPE_LABELS[problem.type]}
          </Badge>
        </TableCell>

        <TableCell>{formatDifficulty(problem.difficulty)}</TableCell>

        <TableCell className="text-right font-mono tabular-nums">
          {problem.points}
        </TableCell>

        <TableCell className="max-w-[180px]">
          {problem.tags.length === 0 ? (
            <span className="text-xs text-muted-foreground">—</span>
          ) : (
            <span className="flex flex-wrap gap-1">
              {problem.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
              {problem.tags.length > 3 && (
                <span className="text-xs text-muted-foreground">
                  +{problem.tags.length - 3}
                </span>
              )}
            </span>
          )}
        </TableCell>

        <TableCell className="text-right">
          <div className="flex items-center justify-end gap-1">
            {revealable && (
              <Button
                variant="ghost"
                size="icon"
                aria-label={isOpen ? "Hide options" : "Show options"}
                aria-expanded={isOpen}
                onClick={onToggle}
              >
                <ChevronRight
                  className={cn(
                    "h-4 w-4 transition-transform",
                    isOpen && "rotate-90",
                  )}
                />
              </Button>
            )}

            {!archived && (
              <Button
                variant="ghost"
                size="sm"
                disabled={archiving}
                onClick={onArchive}
              >
                {archiving ? "Archiving…" : "Archive"}
              </Button>
            )}
          </div>
        </TableCell>
      </TableRow>

      {revealable && isOpen && (
        <TableRow className="bg-muted/30 hover:bg-muted/30">
          <TableCell colSpan={6} className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">
              Options · the correct answer is visible to you only
            </p>
            <ol className="space-y-1.5">
              {options.map((option, index) => (
                <li
                  key={option.id ?? index}
                  className="flex items-start gap-2 text-sm"
                >
                  <span className="mt-0.5 font-mono text-xs text-muted-foreground">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="flex-1">{option.text}</span>
                  {option.isCorrect && (
                    <Badge variant="secondary">Correct</Badge>
                  )}
                </li>
              ))}
            </ol>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

/* ---------- pieces ---------- */

function LoadError({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="rounded-xl border border-destructive/40 p-6">
      <p className="font-medium text-destructive">Failed to load problems</p>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{message}</p>
      <Button variant="outline" size="sm" className="mt-4" onClick={onRetry}>
        Try again
      </Button>
    </div>
  );
}

function ProblemListSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-8 w-40" />
      </div>
      {[0, 1, 2, 3].map((index) => (
        <div key={index} className="space-y-2 rounded-xl border p-5">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-3 w-2/3" />
        </div>
      ))}
    </div>
  );
}
