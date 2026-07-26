/** Truncate a hex hash for UI display (e.g. a3f1c9…e4a2). */
export function truncateHash(hash: string, head = 6, tail = 4): string {
  if (hash.length <= head + tail + 1) return hash;
  return `${hash.slice(0, head)}…${hash.slice(-tail)}`;
}
