/**
 * Utility helper functions for the Tetris game.
 */

/**
 * Clamp a value between min and max
 *
 * @param value - Value to clamp
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns Clamped value
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Calculate gravity drop speed based on level
 * Formula: (0.8 - ((level - 1) × 0.007))^(level - 1) seconds
 *
 * TODO: Verify formula matches NES Tetris or modern guideline
 *
 * @param level - Current game level
 * @returns Drop interval in milliseconds
 */
export function calculateDropSpeed(level: number): number {
  const clampedLevel = clamp(level, 1, 29);
  const seconds = Math.pow(0.8 - (clampedLevel - 1) * 0.007, clampedLevel - 1);
  return seconds * 1000; // Convert to milliseconds
}

/**
 * Shuffle an array using Fisher-Yates algorithm
 * TODO: Use for 7-bag randomizer
 *
 * @param array - Array to shuffle
 * @returns Shuffled array (mutates original)
 */
export function shuffle<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j]!, array[i]!];
  }
  return array;
}

/**
 * Format score with leading zeros
 *
 * @param score - Score value
 * @param digits - Number of digits (default: 6)
 * @returns Formatted score string
 */
export function formatScore(score: number, digits: number = 6): string {
  return score.toString().padStart(digits, '0');
}

/**
 * Format time in MM:SS format
 *
 * @param milliseconds - Time in milliseconds
 * @returns Formatted time string
 */
export function formatTime(milliseconds: number): string {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Deep clone an object (simple version)
 * TODO: Consider using structuredClone for better performance
 *
 * @param obj - Object to clone
 * @returns Cloned object
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Check if two positions are equal
 *
 * @param a - First position
 * @param b - Second position
 * @returns True if positions are equal
 */
export function positionsEqual(
  a: { x: number; y: number },
  b: { x: number; y: number }
): boolean {
  return a.x === b.x && a.y === b.y;
}

/**
 * Linear interpolation between two values
 *
 * @param start - Start value
 * @param end - End value
 * @param t - Interpolation factor (0-1)
 * @returns Interpolated value
 */
export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

/**
 * Debounce a function
 * TODO: Use for input handling if needed
 *
 * @param func - Function to debounce
 * @param wait - Wait time in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function (this: any, ...args: Parameters<T>) {
    const context = this;

    if (timeout) clearTimeout(timeout);

    timeout = setTimeout(() => {
      func.apply(context, args);
    }, wait);
  };
}

/**
 * Throttle a function
 * TODO: Use for rendering if needed
 *
 * @param func - Function to throttle
 * @param limit - Time limit in milliseconds
 * @returns Throttled function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function (this: any, ...args: Parameters<T>) {
    const context = this;

    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
