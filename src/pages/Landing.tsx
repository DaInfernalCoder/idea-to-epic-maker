
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Apple, ChevronRight, Play, Zap, Clock, Target, Shield, Code, Smartphone, Monitor, Video, Users, CheckCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleGetStarted = () => {
    if (user) {
      navigate('/');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-background-light font-inter">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/70 backdrop-blur-md border-b border-border-color' : 'bg-transparent'
      }`}>
        <div className="max-w-[1240px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
              <span className="text-sm font-bold text-white">PF</span>
            </div>
            <span className="text-xl font-semibold text-text-primary">PromptFlow</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-text-muted hover:text-text-primary transition-colors hover:underline">Features</a>
            <a href="#workflows" className="text-text-muted hover:text-text-primary transition-colors hover:underline">Workflows</a>
            <a href="#pricing" className="text-text-muted hover:text-text-primary transition-colors hover:underline">Pricing</a>
            <a href="#docs" className="text-text-muted hover:text-text-primary transition-colors hover:underline">Docs</a>
            <a href="#blog" className="text-text-muted hover:text-text-primary transition-colors hover:underline">Blog</a>
          </div>

          <div className="flex items-center space-x-4">
            <a href="#login" className="text-text-muted hover:text-text-primary transition-colors">Login</a>
            <Button 
              onClick={handleGetStarted}
              className="bg-text-primary text-white hover:bg-[#1F2937]"
            >
              Get PromptFlow
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-24 px-6">
        <div className="max-w-[1240px] mx-auto">
          <div className="rounded-3xl overflow-hidden bg-gradient-to-br from-primary-soft/80 to-transparent backdrop-blur-sm py-32">
            <div className="text-center max-w-4xl mx-auto px-6">
              <h1 className="text-6xl font-extrabold text-text-primary mb-6 leading-tight">
                Perfect Prompts.<br />Automatically.
              </h1>
              <p className="text-xl text-text-muted mb-8 leading-relaxed max-w-2xl mx-auto">
                PromptFlow designs, tests, and refines your AI prompts before you even open your IDE.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Button 
                  onClick={handleGetStarted}
                  size="lg" 
                  className="bg-text-primary text-white hover:bg-[#1F2937] px-8 py-4 text-lg"
                >
                  <Apple className="w-5 h-5 mr-2" />
                  Sign In to use now
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-primary text-primary hover:bg-primary hover:text-white px-8 py-4 text-lg"
                >
                  Join the Wait-list
                </Button>
              </div>

              <p className="text-text-muted text-lg font-medium">
                Stop guessing what your prompt will do.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-24 px-6">
        <div className="max-w-[1240px] mx-auto text-center">
          <h2 className="text-4xl font-semibold text-text-primary mb-8">
            Everything You Need.<br />Before You Ask.
          </h2>
          <div className="relative max-w-4xl mx-auto">
            <img 
              src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=500&fit=crop"
              alt="Code editor with prompts"
              className="rounded-xl shadow-glow w-full hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 px-6 bg-gray-50">
        <div className="max-w-[1240px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {/* Feature 1 */}
            <div className="flex">
              <div className="w-1 h-full bg-primary mr-6"></div>
              <div>
                <h3 className="text-2xl font-semibold text-text-primary mb-4">AI-Powered Analysis</h3>
                <p className="text-text-muted leading-relaxed mb-6">
                  Automatically analyze your requirements and generate optimized prompts for Lovable, Cursor, and Bolt.
                </p>
                <img 
                  src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=250&fit=crop"
                  alt="AI analysis dashboard"
                  className="rounded-lg shadow-lg w-full"
                />
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex">
              <div className="w-1 h-full bg-primary mr-6"></div>
              <div>
                <h3 className="text-2xl font-semibold text-text-primary mb-4">Smart Iterations</h3>
                <p className="text-text-muted leading-relaxed mb-6">
                  Test and refine prompts automatically before you commit to development time.
                </p>
                <img 
                  src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=250&fit=crop"
                  alt="Iteration process"
                  className="rounded-lg shadow-lg w-full"
                />
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex">
              <div className="w-1 h-full bg-primary mr-6"></div>
              <div>
                <h3 className="text-2xl font-semibold text-text-primary mb-4">Development Ready</h3>
                <p className="text-text-muted leading-relaxed mb-6">
                  Get complete specifications and epics ready for immediate development.
                </p>
                <img 
                  src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=250&fit=crop"
                  alt="Development ready specs"
                  className="rounded-lg shadow-lg w-full"
                />
              </div>
            </div>

            {/* Feature 4 */}
            <div className="flex">
              <div className="w-1 h-full bg-primary mr-6"></div>
              <div>
                <h3 className="text-2xl font-semibold text-text-primary mb-4">90% Time Saved</h3>
                <p className="text-text-muted leading-relaxed mb-6">
                  Transform weeks of planning into hours of execution with AI-powered workflows.
                </p>
                <img 
                  src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=250&fit=crop"
                  alt="Time savings visualization"
                  className="rounded-lg shadow-lg w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-24 px-6">
        <div className="max-w-[1240px] mx-auto text-center">
          <blockquote className="text-4xl font-light italic text-text-primary mb-6">
            "This feels like cheating."
          </blockquote>
          <Badge variant="secondary" className="bg-text-primary text-white">
            We mean it
          </Badge>
        </div>
      </section>

      {/* Dark Section - Undetectable by design */}
      <section className="py-32 px-6 bg-background-dark">
        <div className="max-w-[1240px] mx-auto text-center">
          <h2 className="text-4xl font-semibold text-white mb-12">
            Undetectable by design.
          </h2>
          <p className="text-gray-300 text-lg mb-16 max-w-2xl mx-auto">
            Seamlessly integrates with your existing workflow and tools.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-[#1E293B] rounded-lg flex items-center justify-center mb-4">
                <Video className="w-8 h-8 text-white" />
              </div>
              <span className="text-white">Zoom</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-[#1E293B] rounded-lg flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <span className="text-white">Google Meet</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-[#1E293B] rounded-lg flex items-center justify-center mb-4">
                <Monitor className="w-8 h-8 text-white" />
              </div>
              <span className="text-white">Teams</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-[#1E293B] rounded-lg flex items-center justify-center mb-4">
                <Code className="w-8 h-8 text-white" />
              </div>
              <span className="text-white">VS Code</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-[#1E293B] rounded-lg flex items-center justify-center mb-4">
                <Target className="w-8 h-8 text-white" />
              </div>
              <span className="text-white">JetBrains</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-[#1E293B] rounded-lg flex items-center justify-center mb-4">
                <Smartphone className="w-8 h-8 text-white" />
              </div>
              <span className="text-white">Terminal</span>
            </div>
          </div>
        </div>
      </section>

      {/* Alternating Split Sections */}
      <section className="py-24 px-6">
        <div className="max-w-[1240px] mx-auto">
          {/* First Split - Text Left, Image Right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
            <div>
              <h3 className="text-3xl font-semibold text-text-primary mb-6">
                Cuely helps with anything it sees or hears.
              </h3>
              <p className="text-text-muted leading-relaxed text-lg mb-8">
                Our AI analyzes your project requirements and automatically generates comprehensive prompts that work perfectly with modern AI development tools.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-primary mr-3" />
                  <span className="text-text-primary">Smart requirement analysis</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-primary mr-3" />
                  <span className="text-text-primary">Automated testing workflows</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-primary mr-3" />
                  <span className="text-text-primary">Development-ready outputs</span>
                </div>
              </div>
            </div>
            <div>
              <img 
                src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=600&h=400&fit=crop"
                alt="AI assistance interface"
                className="rounded-xl shadow-glow w-full hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>

          {/* Second Split - Image Left, Text Right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
            <div className="order-2 lg:order-1">
              <img 
                src="https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=600&h=400&fit=crop"
                alt="Development workflow"
                className="rounded-xl shadow-glow w-full hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="order-1 lg:order-2">
              <h3 className="text-3xl font-semibold text-text-primary mb-6">
                Three ways PromptFlow changes how you think.
              </h3>
              <p className="text-text-muted leading-relaxed text-lg mb-8">
                Stop wasting time on trial and error. Get precise, tested prompts that deliver exactly what you need, every time.
              </p>
              <Button className="bg-primary text-white hover:bg-primary/90">
                Learn More <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-[1240px] mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <img 
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face"
              alt="Customer testimonial"
              className="w-16 h-16 rounded-full mx-auto mb-6"
            />
            <blockquote className="text-2xl text-text-primary mb-6 font-light">
              "PromptFlow completely transformed our development workflow. What used to take weeks of back-and-forth now happens in hours. It's like having a senior developer who never sleeps."
            </blockquote>
            <div>
              <div className="font-semibold text-text-primary">Sarah Chen</div>
              <div className="text-text-muted">CTO, TechFlow Inc.</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-24 px-6 bg-background-dark">
        <div className="max-w-[1240px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                  <span className="text-sm font-bold text-white">PF</span>
                </div>
                <span className="text-xl font-semibold text-white">PromptFlow</span>
              </div>
              <p className="text-gray-400">
                Perfect prompts, automatically.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <div className="space-y-2">
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Features</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Workflows</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Pricing</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">API</a>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <div className="space-y-2">
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Documentation</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Blog</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Community</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Support</a>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <div className="space-y-2">
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">About</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Privacy</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Terms</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Contact</a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 PromptFlow. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
