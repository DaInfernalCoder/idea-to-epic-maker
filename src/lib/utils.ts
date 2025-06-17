
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateProjectId(): string {
  // Generate a proper UUID using the Web Crypto API
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  
  // Fallback for environments that don't support crypto.randomUUID
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Check if a string is a valid UUID
 */
export function isValidUUID(str: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

/**
 * Clear malformed project data from localStorage
 */
export function clearMalformedProjectData(): void {
  const projectId = localStorage.getItem("promptflow_project_id");
  
  if (projectId && !isValidUUID(projectId)) {
    console.log("Clearing malformed project ID from localStorage:", projectId);
    localStorage.removeItem("promptflow_project_id");
    localStorage.removeItem(`promptflow_data_${projectId}`);
  }
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
