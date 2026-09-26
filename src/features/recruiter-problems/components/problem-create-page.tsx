"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, X } from "lucide-react";

import { useCreateProblem } from "../hooks/use-create-problem";
import {
  DIFFICULTIES,
  DIFFICULTY_LABELS,
  MAX_TAG_LENGTH,
  MAX_TAGS,
  NO_DIFFICULTY,
  PROBLEM_TYPE_HINTS,
  PROBLEM_TYPE_LABELS,
  PROBLEM_TYPES,
} from "../constants/problem.constants";
import { createProblemSchema } from "../schemas/problem.schemas";
import type { ProblemType } from "../types/problem.dto";

import { Button } from "@/src/shared/components/ui/button";
import { Input } from "@/src/shared/components/ui/input";
import { Label } from "@/src/shared/components/ui/label";
import { Textarea } from "@/src/shared/components/ui/textarea";
import { Badge } from "@/src/shared/components/ui/badge";
import { Separator } from "@/src/shared/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/shared/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/shared/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/src/shared/components/ui/radio-group";
import { cn } from "@/src/shared/utils";

type OptionDraft = { id: string; text: string };

let optionSeq = 0;
const nextOptionId = () => `option-${optionSeq++}`;

export function ProblemCreatePage() {
  const router = useRouter();
  const create = useCreateProblem();

  const [type, setType] = useState<ProblemType>("MCQ");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [points, setPoints] = useState("1");
  const [difficulty, setDifficulty] = useState<string>(NO_DIFFICULTY);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [options, setOptions] = useState<OptionDraft[]>([
    { id: nextOptionId(), text: "" },
    { id: nextOptionId(), text: "" },
  ]);
  const [correctId, setCorrectId] = useState<string>(() => options[0].id);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isMcq = type === "MCQ";

  function addTags(raw: string) {
    const incoming = raw
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    if (incoming.length === 0) {
      setTagInput("");
      return;
    }

    setTags((current) => {
      const next = [...current];

      for (const tag of incoming) {
        if (next.length >= MAX_TAGS) break;
        if (next.some((existing) => existing.toLowerCase() === tag.toLowerCase()))
          continue;

        next.push(tag.slice(0, MAX_TAG_LENGTH));
      }

      return next;
    });

    setTagInput("");
  }

  function removeTag(tag: string) {
    setTags((current) => current.filter((item) => item !== tag));
  }

  function addOption() {
    setOptions((current) => [...current, { id: nextOptionId(), text: "" }]);
  }

  function updateOption(id: string, text: string) {
    setOptions((current) =>
      current.map((option) => (option.id === id ? { ...option, text } : option)),
    );
  }

  function removeOption(id: string) {
    if (options.length <= 2) return;

    const next = options.filter((option) => option.id !== id);

    setOptions(next);

    if (id === correctId) {
      setCorrectId(next[0]?.id ?? "");
    }
  }

  function onSubmit() {
    const parsed = createProblemSchema.safeParse({
      title,
      description,
      type,
      points,
      difficulty: difficulty === NO_DIFFICULTY ? undefined : difficulty,
      tags,
      options: isMcq
        ? options.map((option) => ({
            text: option.text,
            isCorrect: option.id === correctId,
          }))
        : undefined,
    });

    if (!parsed.success) {
      const next: Record<string, string> = {};

      parsed.error.issues.forEach((issue) => {
        const key = issue.path.map(String).join(".") || "form";
        if (!next[key]) next[key] = issue.message;
      });

      setErrors(next);
      return;
    }

    setErrors({});

    const { difficulty: parsedDifficulty, ...rest } = parsed.data;

    create.mutate(
      {
        ...rest,
        ...(parsedDifficulty ? { difficulty: parsedDifficulty } : {}),
      },
      {
        onSuccess: () => {
          toast.success("Problem created");
          router.push("/recruiter/problems");
        },
        onError: () => {
          toast.error("Could not create problem");
        },
      },
    );
  }

  return (
    <main className="mx-auto max-w-3xl space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">Create Problem</h1>
        <p className="text-sm text-muted-foreground">
          Problems live in your question bank and can be reused across multiple
          assessments.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Type</CardTitle>
          <CardDescription>
            The type decides how the answer is captured and scored.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <RadioGroup
            value={type}
            onValueChange={(value) => setType(value as ProblemType)}
            className="grid grid-cols-1 gap-2 sm:grid-cols-3"
          >
            {PROBLEM_TYPES.map((item) => (
              <label
                key={item}
                className="flex cursor-pointer items-start gap-2.5 rounded-lg border p-3 transition-colors hover:bg-muted/40 has-data-checked:border-primary/60"
              >
                <RadioGroupItem value={item} className="mt-0.5" />
                <span className="space-y-0.5">
                  <span className="block text-sm font-medium">
                    {PROBLEM_TYPE_LABELS[item]}
                  </span>
                  <span className="block text-xs text-muted-foreground">
                    {PROBLEM_TYPE_HINTS[item]}
                  </span>
                </span>
              </label>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Explain the difference between let and const"
              aria-invalid={Boolean(errors.title)}
            />
            <FieldError message={errors.title} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              rows={5}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Give candidates the full context they need to answer."
              aria-invalid={Boolean(errors.description)}
            />
            <FieldError message={errors.description} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="points">Points</Label>
              <Input
                id="points"
                type="number"
                min={1}
                value={points}
                onChange={(event) => setPoints(event.target.value)}
                aria-invalid={Boolean(errors.points)}
              />
              <FieldError message={errors.points} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="difficulty">Difficulty (optional)</Label>
              <Select
                value={difficulty}
                onValueChange={(value)=>setDifficulty(value??NO_DIFFICULTY)}
              >
                <SelectTrigger id="difficulty" className="w-full">
                  <SelectValue placeholder="Not set" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NO_DIFFICULTY}>Not set</SelectItem>
                  {DIFFICULTIES.map((item) => (
                    <SelectItem key={item} value={item}>
                      {DIFFICULTY_LABELS[item]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError message={errors.difficulty} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <CardTitle>Tags</CardTitle>
            <CardDescription>
              Optional keywords that make the problem easier to find.
            </CardDescription>
          </div>
          <Badge variant="secondary">
            {tags.length}/{MAX_TAGS}
          </Badge>
        </CardHeader>

        <CardContent className="space-y-3">
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="gap-1 pr-1 pl-2">
                  {tag}
                  <button
                    type="button"
                    aria-label={`Remove ${tag}`}
                    className="rounded-sm p-0.5 opacity-70 transition-opacity hover:opacity-100"
                    onClick={() => removeTag(tag)}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="tagInput">Add a tag</Label>
            <div className="flex gap-2">
              <Input
                id="tagInput"
                value={tagInput}
                disabled={tags.length >= MAX_TAGS}
                onChange={(event) => setTagInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === ",") {
                    event.preventDefault();
                    addTags(tagInput);
                  }
                }}
                placeholder="javascript"
                aria-invalid={Boolean(errors.tags)}
              />
              <Button
                type="button"
                variant="outline"
                disabled={tags.length >= MAX_TAGS || tagInput.trim().length === 0}
                onClick={() => addTags(tagInput)}
              >
                Add
              </Button>
            </div>
            <FieldError message={errors.tags} />
            <p className="text-xs text-muted-foreground">
              Press Enter or comma to add. Duplicates are ignored.
            </p>
          </div>
        </CardContent>
      </Card>

      {isMcq && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <CardTitle>Options</CardTitle>
              <CardDescription>
                Add at least two options and mark the correct one.
              </CardDescription>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={addOption}>
              <Plus className="h-3.5 w-3.5" />
              Add option
            </Button>
          </CardHeader>

          <CardContent className="space-y-3">
            <RadioGroup
              value={correctId}
              onValueChange={setCorrectId}
              className="gap-2"
              aria-label="Correct option"
            >
              {options.map((option, index) => {
                const isCorrect = option.id === correctId;

                return (
                  <div
                    key={option.id}
                    className={cn(
                      "flex items-center gap-3 rounded-lg border p-2.5 transition-colors",
                      isCorrect && "border-primary/60 bg-muted/40",
                    )}
                  >
                    <span className="w-5 shrink-0 text-center font-mono text-xs text-muted-foreground">
                      {String.fromCharCode(65 + index)}
                    </span>

                    <div className="flex-1 space-y-1">
                      <Input
                        value={option.text}
                        onChange={(event) =>
                          updateOption(option.id, event.target.value)
                        }
                        placeholder={`Option ${String.fromCharCode(65 + index)}`}
                        aria-label={`Option ${index + 1}`}
                        aria-invalid={Boolean(errors[`options.${index}.text`])}
                      />
                      {errors[`options.${index}.text`] && (
                        <p className="text-xs text-destructive">
                          {errors[`options.${index}.text`]}
                        </p>
                      )}
                    </div>

                    <label className="flex shrink-0 cursor-pointer items-center gap-1.5 text-xs text-muted-foreground">
                      <RadioGroupItem value={option.id} />
                      Correct
                    </label>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      disabled={options.length <= 2}
                      aria-label={`Remove option ${index + 1}`}
                      onClick={() => removeOption(option.id)}
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                );
              })}
            </RadioGroup>

            <FieldError message={errors.options} />
          </CardContent>
        </Card>
      )}

      <Separator />

      <div className="flex items-center justify-end gap-2">
        <Button variant="outline">
          <Link href="/recruiter/problems">Cancel</Link>
        </Button>
        <Button disabled={create.isPending} onClick={onSubmit}>
          {create.isPending ? "Creating…" : "Create problem"}
        </Button>
      </div>
    </main>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;

  return <p className="text-xs text-destructive">{message}</p>;
}
