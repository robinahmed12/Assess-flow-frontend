export type PageWindowEntry = number | "ellipsis-left" | "ellipsis-right";

/**
 * Truncates a page list so a pagination control keeps a fixed width regardless
 * of `totalPages`, e.g. `[1, '…', 4, 5, 6, '…', 20]`.
 */
export function buildPageWindow(
  currentPage: number,
  totalPages: number,
): PageWindowEntry[] {
  if (totalPages <= 0) return [];

  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set<number>([1, totalPages, currentPage]);

  if (currentPage <= 3) {
    [2, 3, 4].forEach((page) => pages.add(page));
  }

  if (currentPage >= totalPages - 2) {
    [totalPages - 3, totalPages - 2, totalPages - 1].forEach((page) => pages.add(page));
  }

  const sorted = [...pages]
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((a, b) => a - b);

  const window: PageWindowEntry[] = [];

  sorted.forEach((page, index) => {
    const previous = sorted[index - 1];

    if (previous !== undefined && page - previous > 1) {
      window.push(page === totalPages ? "ellipsis-right" : "ellipsis-left");
    }

    window.push(page);
  });

  return window;
}
