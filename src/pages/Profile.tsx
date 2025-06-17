import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, Save, User, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { AuthPage } from "@/components/auth/AuthPage";

const Profile = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const { profile, loading: profileLoading, updateProfile } = useProfile();
  const [howHeardAboutUs, setHowHeardAboutUs] = useState(profile?.how_heard_about_us || "");
  const [preferredContactMethod, setPreferredContactMethod] = useState<'phone' | 'twitter' | 'email' | ''>(
    profile?.preferred_contact_method || ""
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  // Update form when profile loads
  React.useEffect(() => {
    if (profile) {
      setHowHeardAboutUs(profile.how_heard_about_us || "");
      setPreferredContactMethod(profile.preferred_contact_method || "");
    }
  }, [profile]);

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-orange-500">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  const handleSave = async () => {
    setIsSubmitting(true);
    setSaveMessage("");
    
    try {
      const success = await updateProfile({
        how_heard_about_us: howHeardAboutUs || null,
        preferred_contact_method: preferredContactMethod || null,
      });
      
      if (success) {
        setSaveMessage("Profile updated successfully!");
        setTimeout(() => setSaveMessage(""), 3000);
      } else {
        setSaveMessage("Error updating profile. Please try again.");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      setSaveMessage("Error updating profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-950/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-orange-600 rounded-md flex items-center justify-center">
                <span className="text-sm font-bold text-white">PF</span>
              </div>
              <h1 className="text-xl font-semibold text-white">PromptFlow</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-orange-600 border-orange-600 text-white hover:bg-orange-700 hover:border-orange-700"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to App
                </Button>
              </Link>
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <User className="w-4 h-4" />
                <span>{user.email}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={signOut}
                className="bg-orange-600 border-orange-600 text-white hover:bg-orange-700 hover:border-orange-700"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Your Profile</h2>
          <p className="text-gray-400">Manage your account settings and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Form */}
          <div className="lg:col-span-2">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-xl">
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="email" className="text-white text-sm font-medium">
                    Email Address
                  </Label>
                  <div className="p-3 bg-gray-700 rounded-md text-gray-300">
                    {user.email}
                  </div>
                  <p className="text-xs text-gray-400">
                    Your email address cannot be changed here. Contact support if needed.
                  </p>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="how-heard" className="text-white text-sm font-medium">
                    How did you hear about us?
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
                    Preferred contact method for feedback
                  </Label>
                  <RadioGroup
                    value={preferredContactMethod}
                    onValueChange={(value) => setPreferredContactMethod(value as 'phone' | 'twitter' | 'email')}
                    className="space-y-3"
                  >
                    <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-700/50 hover:bg-gray-700 transition-colors">
                      <RadioGroupItem value="email" id="profile-email" className="border-gray-500" />
                      <Label htmlFor="profile-email" className="text-gray-300 cursor-pointer flex-1">
                        Email - We'll send occasional updates and feature announcements
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-700/50 hover:bg-gray-700 transition-colors">
                      <RadioGroupItem value="twitter" id="profile-twitter" className="border-gray-500" />
                      <Label htmlFor="profile-twitter" className="text-gray-300 cursor-pointer flex-1">
                        Twitter - Follow us for quick updates and community discussions
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-700/50 hover:bg-gray-700 transition-colors">
                      <RadioGroupItem value="phone" id="profile-phone" className="border-gray-500" />
                      <Label htmlFor="profile-phone" className="text-gray-300 cursor-pointer flex-1">
                        Phone - For important product updates only
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-gray-700">
                  <div className="text-sm">
                    {saveMessage && (
                      <span className={saveMessage.includes("Error") ? "text-red-400" : "text-green-400"}>
                        {saveMessage}
                      </span>
                    )}
                  </div>
                  <Button
                    onClick={handleSave}
                    disabled={isSubmitting}
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Account Info Sidebar */}
          <div>
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-lg">Account Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-gray-400 text-xs uppercase tracking-wider">
                    User ID
                  </Label>
                  <p className="text-white text-sm font-mono mt-1">
                    {user.id.slice(0, 8)}...
                  </p>
                </div>
                
                {profile && (
                  <>
                    <div>
                      <Label className="text-gray-400 text-xs uppercase tracking-wider">
                        Member Since
                      </Label>
                      <p className="text-white text-sm mt-1">
                        {new Date(profile.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    
                    <div>
                      <Label className="text-gray-400 text-xs uppercase tracking-wider">
                        Last Updated
                      </Label>
                      <p className="text-white text-sm mt-1">
                        {new Date(profile.updated_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
