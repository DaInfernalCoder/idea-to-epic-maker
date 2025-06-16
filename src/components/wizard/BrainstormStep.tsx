import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  ArrowLeft,
  Database,
  Smartphone,
  Shield,
  Cloud,
  Palette,
  Zap,
} from "lucide-react";

interface BrainstormData {
  features: string[];
  technologies: string[];
  timestamp: string;
}

interface BrainstormStepProps {
  value: BrainstormData;
  onChange: (value: BrainstormData) => void;
  onNext: () => void;
  onBack: () => void;
}

export function BrainstormStep({
  value,
  onChange,
  onNext,
  onBack,
}: BrainstormStepProps) {
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(
    value?.features || []
  );
  const [selectedTech, setSelectedTech] = useState<string[]>(
    value?.technologies || []
  );

  const featureCategories = [
    {
      title: "Core Features",
      icon: Zap,
      items: [
        "User Authentication",
        "Real-time Updates",
        "File Upload",
        "Search & Filter",
        "Notifications",
        "Comments & Reviews",
      ],
    },
    {
      title: "Data & Storage",
      icon: Database,
      items: [
        "Database Integration",
        "Data Analytics",
        "Backup & Recovery",
        "Data Export",
        "API Integration",
        "Caching",
      ],
    },
    {
      title: "User Experience",
      icon: Palette,
      items: [
        "Responsive Design",
        "Dark/Light Mode",
        "Drag & Drop",
        "Offline Support",
        "Multi-language",
        "Accessibility",
      ],
    },
    {
      title: "Security & Auth",
      icon: Shield,
      items: [
        "OAuth Integration",
        "Two-Factor Auth",
        "Role-based Access",
        "Data Encryption",
        "Audit Logs",
        "GDPR Compliance",
      ],
    },
    {
      title: "Mobile & Platform",
      icon: Smartphone,
      items: [
        "Progressive Web App",
        "Mobile App",
        "Desktop App",
        "Browser Extension",
        "API First",
        "Cross-platform",
      ],
    },
    {
      title: "Deployment & Scale",
      icon: Cloud,
      items: [
        "Cloud Hosting",
        "CDN Integration",
        "Auto-scaling",
        "Load Balancing",
        "Monitoring",
        "CI/CD Pipeline",
      ],
    },
  ];

  const technologies = [
    "React",
    "Vue.js",
    "Angular",
    "Next.js",
    "Node.js",
    "Python",
    "Django",
    "FastAPI",
    "PostgreSQL",
    "MongoDB",
    "Redis",
    "AWS",
    "Vercel",
    "Docker",
    "Kubernetes",
    "TypeScript",
  ];

  const toggleFeature = (feature: string) => {
    const updated = selectedFeatures.includes(feature)
      ? selectedFeatures.filter((f: string) => f !== feature)
      : [...selectedFeatures, feature];
    setSelectedFeatures(updated);
  };

  const toggleTech = (tech: string) => {
    const updated = selectedTech.includes(tech)
      ? selectedTech.filter((t: string) => t !== tech)
      : [...selectedTech, tech];
    setSelectedTech(updated);
  };

  const handleNext = () => {
    onChange({
      features: selectedFeatures,
      technologies: selectedTech,
      timestamp: new Date().toISOString(),
    });
    onNext();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
          Shape Your Vision
        </h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Select the features and technologies that align with your project
          goals. This will guide our research and planning.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {featureCategories.map((category, index) => (
          <Card key={index} className="bg-gray-900 border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-white">
                <category.icon className="w-5 h-5 text-orange-500" />
                {category.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {category.items.map((item) => (
                  <Badge
                    key={item}
                    variant={
                      selectedFeatures.includes(item) ? "default" : "outline"
                    }
                    className={`cursor-pointer transition-all duration-200 ${
                      selectedFeatures.includes(item)
                        ? "bg-orange-600 hover:bg-orange-700 text-white border-orange-600"
                        : "border-gray-600 text-gray-400 hover:border-orange-500 hover:text-orange-400"
                    }`}
                    onClick={() => toggleFeature(item)}
                  >
                    {item}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Technology Preferences</CardTitle>
          <CardDescription className="text-gray-400">
            Select technologies you'd like to use or explore (optional)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {technologies.map((tech) => (
              <Badge
                key={tech}
                variant={selectedTech.includes(tech) ? "default" : "outline"}
                className={`cursor-pointer transition-all duration-200 ${
                  selectedTech.includes(tech)
                    ? "bg-orange-600 hover:bg-orange-700 text-white border-orange-600"
                    : "border-gray-600 text-gray-400 hover:border-orange-500 hover:text-orange-400"
                }`}
                onClick={() => toggleTech(tech)}
              >
                {tech}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {(selectedFeatures.length > 0 || selectedTech.length > 0) && (
        <Card className="bg-orange-900/20 border-orange-700">
          <CardHeader>
            <CardTitle className="text-orange-400">
              Your Selection Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {selectedFeatures.length > 0 && (
                <div>
                  <span className="text-sm font-medium text-gray-300">
                    Features:{" "}
                  </span>
                  <span className="text-sm text-gray-400">
                    {selectedFeatures.length} selected
                  </span>
                </div>
              )}
              {selectedTech.length > 0 && (
                <div>
                  <span className="text-sm font-medium text-gray-300">
                    Technologies:{" "}
                  </span>
                  <span className="text-sm text-gray-400">
                    {selectedTech.join(", ")}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={onBack}
          className="border-gray-600 text-gray-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Requirements
        </Button>
        <Button
          onClick={handleNext}
          className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-2"
        >
          Continue to Research
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
