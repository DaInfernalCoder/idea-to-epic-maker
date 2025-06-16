// Type definitions for Supabase Edge Functions
/// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />

export interface CorsHeaders {
  'Access-Control-Allow-Origin': string;
  'Access-Control-Allow-Headers': string;
}

export interface RequestBody {
  prd?: string;
  research?: string;
  brainstorm?: any;
  projectId?: string;
}

export interface ApiResponse {
  epics?: string;
  prd?: string;
  research?: string;
  error?: string;
} 