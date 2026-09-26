import { DIFFICULTIES, DIFFICULTY_LABELS } from "../constants/problem.constants";

const EMPTY_LABEL = "—";

/** Maps a stored difficulty value to its human label, falling back to the raw value. */
export function formatDifficulty(value?: string | null): string {
  const trimmed = value?.trim();

  if (!trimmed) return EMPTY_LABEL;

  const known = DIFFICULTIES.find(
    (item) => item === trimmed.toUpperCase(),
  );

  return known ? DIFFICULTY_LABELS[known] : trimmed;
}
