
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";

interface ProfileStepProps {
  onNext: () => void;
  onBack: () => void;
}

export function ProfileStep({ onNext, onBack }: ProfileStepProps) {
  const { profile, updateProfile } = useProfile();
  const [howHeardAboutUs, setHowHeardAboutUs] = useState(profile?.how_heard_about_us || "");
  const [preferredContactMethod, setPreferredContactMethod] = useState<'phone' | 'twitter' | 'email' | ''>(
    profile?.preferred_contact_method || ""
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNext = async () => {
    setIsSubmitting(true);
    try {
      await updateProfile({
        how_heard_about_us: howHeardAboutUs || null,
        preferred_contact_method: preferredContactMethod || null,
      });
      onNext();
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white text-2xl text-center">
            Tell us about yourself
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="how-heard" className="text-white text-sm font-medium">
              How did you hear about us? (Optional)
            </Label>
            <Textarea
              id="how-heard"
              placeholder="e.g., Twitter, friend recommendation, search engine, etc."
              value={howHeardAboutUs}
              onChange={(e) => setHowHeardAboutUs(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 min-h-[100px]"
            />
          </div>

          <div className="space-y-4">
            <Label className="text-white text-sm font-medium">
              What's a good way we can reach out for feedback? (Optional)
            </Label>
            <RadioGroup
              value={preferredContactMethod}
              onValueChange={(value) => setPreferredContactMethod(value as 'phone' | 'twitter' | 'email')}
              className="space-y-3"
            >
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-700/50 hover:bg-gray-700 transition-colors">
                <RadioGroupItem value="email" id="email" className="border-gray-500" />
                <Label htmlFor="email" className="text-gray-300 cursor-pointer flex-1">
                  Email - We'll send occasional updates and feature announcements
                </Label>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-700/50 hover:bg-gray-700 transition-colors">
                <RadioGroupItem value="twitter" id="twitter" className="border-gray-500" />
                <Label htmlFor="twitter" className="text-gray-300 cursor-pointer flex-1">
                  Twitter - Follow us for quick updates and community discussions
                </Label>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-700/50 hover:bg-gray-700 transition-colors">
                <RadioGroupItem value="phone" id="phone" className="border-gray-500" />
                <Label htmlFor="phone" className="text-gray-300 cursor-pointer flex-1">
                  Phone - For important product updates only
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={onBack}
              className="border-gray-600 text-gray-400 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            <Button
              onClick={handleNext}
              disabled={isSubmitting}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              {isSubmitting ? "Saving..." : "Continue"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
