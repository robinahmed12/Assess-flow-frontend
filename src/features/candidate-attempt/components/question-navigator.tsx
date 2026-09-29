"use client";

import { Button } from "@/src/shared/components/ui/button";

export function QuestionNavigator({
  count,
  current,
  answered,
  onChange,
}: {
  count: number;
  current: number;
  answered: (index: number) => boolean;
  onChange: (index: number) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2" role="navigation" aria-label="Questions">
      {Array.from({ length: count }).map((_, i) => {
        const isCurrent = current === i;
        const isAnswered = answered(i);
        return (
          <Button
            key={i}
            size="sm"
            variant={isCurrent ? "default" : isAnswered ? "secondary" : "outline"}
            onClick={() => onChange(i)}
            aria-current={isCurrent ? "true" : undefined}
          >
            {i + 1}
          </Button>
        );
      })}
    </div>
  );
}
