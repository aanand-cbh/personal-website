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

// Helper function to escape regex special characters
export function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Checks if a text contains a specific word as an exact match using word boundaries
 * 
 * @param text The text to search in
 * @param word The word to search for
 * @returns Boolean indicating if the exact word was found
 */
export function containsExactWord(text: string, word: string): boolean {
  try {
    if (!text || !word) return false;
    const escapedWord = escapeRegExp(word.toLowerCase());
    const regex = new RegExp(`\\b${escapedWord}\\b`, 'i');
    return regex.test(text.toLowerCase());
  } catch (err) {
    console.error('Error in containsExactWord:', err);
    return false;
  }
}

/**
 * Intelligently checks if a text contains a partial word or word stem
 * Handles various cases like prefix matching, significant substring matching, etc.
 * 
 * @param text The text to search in
 * @param partial The partial word or stem to search for
 * @param minLength Minimum length requirement for the partial (default: 4)
 * @returns Boolean indicating if a suitable match was found
 */
export function containsPartialWord(text: string, partial: string, minLength = 4): boolean {
  try {
    if (!text || !partial || partial.length < minLength) return false;
    const partialLower = partial.toLowerCase();
    const textLower = text.toLowerCase();
    
    // Split text into words
    const words = textLower.split(/\s+/);
    
    // Check if any word contains the partial
    return words.some(word => {
      // For very short words, require a higher percentage match
      if (word.length < 5) {
        return word.includes(partialLower);
      }
      
      // For longer words, check if the partial is a significant substring
      // (at least 60% of the word length or 5 characters)
      const minSubstringLength = Math.max(Math.floor(word.length * 0.6), 5);
      if (partialLower.length >= minSubstringLength) {
        return word.includes(partialLower);
      }
      
      // For shorter partials matching longer words, check start of word
      // (common for searches like "doc" for "documentation")
      if (word.startsWith(partialLower) && word.length >= partialLower.length + 2) {
        return true;
      }
      
      // For middle-word partials, require at least 4 characters
      if (partialLower.length >= 4 && word.includes(partialLower)) {
        return true;
      }
      
      return false;
    });
  } catch (err) {
    console.error('Error in containsPartialWord:', err);
    return false;
  }
}
