export function SaveStatus({
  state,
}: {
  state: "idle" | "saving" | "saved" | "failed";
}) {
  if (state === "idle") return null;

  const styles: Record<string, string> = {
    saving: "text-muted-foreground",
    saved: "text-primary",
    failed: "text-destructive",
  };

  const labels: Record<string, string> = {
    saving: "Saving...",
    saved: "Saved",
    failed: "Save failed — retrying when you type",
  };

  return (
    <span className={`text-[11px] font-medium ${styles[state]}`} role="status">
      {labels[state]}
    </span>
  );
}
