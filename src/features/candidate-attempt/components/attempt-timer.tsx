"use client";

import { useEffect, useState } from "react";
import { ClockIcon } from "@phosphor-icons/react";

export function AttemptTimer({ expiresAt }: { expiresAt: string }) {
  const [remaining, setRemaining] = useState("");

  useEffect(() => {
    const update = () => {
      const diff = new Date(expiresAt).getTime() - Date.now();
      if (diff <= 0) {
        setRemaining("00:00");
        return;
      }
      const min = Math.floor(diff / 60000);
      const sec = Math.floor((diff % 60000) / 1000);
      setRemaining(
        `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`,
      );
    };

    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [expiresAt]);

  const isExpired = remaining === "00:00";

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-none border px-3 py-1.5 text-xs font-semibold ${
        isExpired
          ? "border-destructive/40 text-destructive"
          : "border-border text-foreground"
      }`}
      aria-live="polite"
    >
      <ClockIcon className="size-3.5" />
      {isExpired ? "Time expired" : `Time remaining: ${remaining}`}
    </div>
  );
}
