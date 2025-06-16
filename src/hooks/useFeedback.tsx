import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

interface FeedbackData {
  message: string;
  user_email?: string;
}

export function useFeedback() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, isGuest } = useAuth();

  const submitFeedback = async (data: FeedbackData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const feedbackData = {
        message: data.message,
        user_id: isGuest ? null : user?.id || null,
        user_email: data.user_email || user?.email || null,
        user_agent: navigator.userAgent,
      };

      const { error: submitError } = await supabase
        .from("feedback")
        .insert([feedbackData]);

      if (submitError) {
        throw submitError;
      }

      return { success: true };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to submit feedback";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitFeedback,
    isSubmitting,
    error,
  };
}
