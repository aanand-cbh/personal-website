import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

export function getBaseUrl() {
  // Check for environment variables first
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL.trim().replace(/\/$/, "")
  }

  // When deploying to Vercel, we can use the VERCEL_URL environment variable
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  
  // In development, use localhost
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000"
  }

  // Fallback to the production domain
  return "https://kaivlya.com"
}

/**
 * Escapes special characters in a string for use in a regular expression
 */
export function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Checks if a text contains an exact word match
 */
export function containsExactWord(text: string | undefined | null, word: string): boolean {
  if (!text?.toLowerCase || !word) return false;
  
  try {
    const escapedWord = escapeRegExp(word.toLowerCase());
    const regex = new RegExp(`\\b${escapedWord}\\b`, 'i');
    return regex.test(text.toLowerCase());
  } catch (err) {
    console.error('Error in containsExactWord:', err);
    return false;
  }
}

/**
 * Checks if a text contains a partial word match
 */
export function containsPartialWord(text: string | undefined | null, word: string): boolean {
  if (!text?.toLowerCase || !word) return false;
  
  try {
    const escapedWord = escapeRegExp(word.toLowerCase());
    const regex = new RegExp(escapedWord, 'i');
    return regex.test(text.toLowerCase());
  } catch (err) {
    console.error('Error in containsPartialWord:', err);
    return false;
  }
}
