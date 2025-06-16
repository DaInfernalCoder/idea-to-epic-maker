import { useState } from "react";
import { MessageSquare, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useFeedback } from "@/hooks/useFeedback";
import { useAuth } from "@/hooks/useAuth";

export function FeedbackButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const { submitFeedback, isSubmitting, error } = useFeedback();
  const { user, isGuest } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) return;

    const result = await submitFeedback({
      message: message.trim(),
      user_email: user?.email,
    });

    if (result.success) {
      setIsSuccess(true);
      setMessage("");
      setTimeout(() => {
        setIsOpen(false);
        setIsSuccess(false);
      }, 2000);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setMessage("");
      setIsSuccess(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button
            size="lg"
            className="rounded-full shadow-lg hover:shadow-xl transition-all duration-200 h-14 w-14 p-0"
            aria-label="Send feedback"
          >
            <MessageSquare className="h-6 w-6" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Send us feedback</DialogTitle>
            <DialogDescription>
              Help us improve by sharing your thoughts, suggestions, or
              reporting issues.
              {isGuest && " Your feedback will be submitted anonymously."}
            </DialogDescription>
          </DialogHeader>

          {isSuccess ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="rounded-full bg-green-100 p-3 mb-4">
                <Send className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-green-800 mb-2">
                Thank you!
              </h3>
              <p className="text-sm text-green-600">
                Your feedback has been submitted successfully.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Textarea
                  id="feedback"
                  placeholder="How can we improve? Share your thoughts..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-[120px] resize-none"
                  disabled={isSubmitting}
                />
                {error && <p className="text-sm text-red-600">{error}</p>}
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || !message.trim()}
                  className="min-w-[100px]"
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Sending...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Send className="h-4 w-4" />
                      <span>Send feedback</span>
                    </div>
                  )}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
