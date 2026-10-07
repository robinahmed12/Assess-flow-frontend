type PageLoaderProps = {
  label?: string;
};

/**
 * Full-screen-ish centered spinner used as the Next.js `loading.tsx` fallback
 * (root and route segments) while a server-rendered route streams in.
 */
export function PageLoader({ label = "Loading..." }: PageLoaderProps) {
  return (
    <div
      role="status"
      className="flex min-h-[50vh] w-full flex-col items-center justify-center gap-3"
    >
      <span
        aria-hidden="true"
        className="size-8 animate-spin rounded-full border-[3px] border-primary/15 border-t-primary"
      />
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
