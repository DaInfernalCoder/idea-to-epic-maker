import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateProjectId(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

/**
 * Get the correct site URL for the current environment
 * This handles localhost, hosted domains, and production environments
 */
export function getSiteUrl(): string {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    return 'http://localhost:8080'
  }

  // For development/localhost
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return `${window.location.protocol}//${window.location.host}`
  }

  // For hosted environments (Vercel, Netlify, etc.)
  // Use the current origin which should be the correct hosted URL
  return window.location.origin
}
