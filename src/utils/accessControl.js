export const FREE_PROBLEM_COUNT = 5;

// tier 'pro' and 'ultimate' unlock all problems
const PAID_TIERS = new Set(['pro', 'ultimate']);

/**
 * Returns true if the problem at `index` (0-based) is locked for the given tier.
 */
export function isProblemLocked(index, tier) {
  if (PAID_TIERS.has(tier)) return false;
  return index >= FREE_PROBLEM_COUNT;
}
