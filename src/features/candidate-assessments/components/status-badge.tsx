import { Badge } from "@/src/shared/components/ui/badge";

type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

export function StatusBadge({
  label,
  variant = "default",
}: {
  label: string;
  variant?: BadgeVariant;
}) {
  return <Badge variant={variant}>{label}</Badge>;
}
