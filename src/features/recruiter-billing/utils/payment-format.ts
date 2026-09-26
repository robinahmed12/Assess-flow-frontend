const amountFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const dateTimeFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
});

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
});

export function formatAmount(amount: number): string {
  if (typeof amount !== "number" || Number.isNaN(amount)) return "0.00";

  return amountFormatter.format(amount);
}

export function formatDateTime(value?: string | null): string {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return dateTimeFormatter.format(date);
}

export function formatDate(value?: string | null): string {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return dateFormatter.format(date);
}

export function truncateId(id: string): string {
  if (id.length <= 8) return id;

  return `${id.slice(0, 8)}…`;
}
