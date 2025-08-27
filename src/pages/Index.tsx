import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Users, TrendingUp, Award, FileSpreadsheet, Sparkles, Target, BookOpen, Trophy } from "lucide-react";
import { InductionForm } from "@/components/InductionForm";
import { AdminPanel } from "@/components/AdminPanel";
import { BackgroundPaths } from "@/components/ui/background-paths";

const Index = () => {
  const [showForm, setShowForm] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

  if (showAdmin) {
    return <AdminPanel onBack={() => setShowAdmin(false)} />;
  }

  if (showForm) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        <div className="container mx-auto py-8">
          <div className="mb-8 text-center">
            <Button
              variant="outline"
              onClick={() => setShowForm(false)}
              className="mb-4"
            >
              ← Back to Home
            </Button>
          </div>
          <InductionForm />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <BackgroundPaths className="fixed inset-0 z-0" pathColor="hsl(var(--primary))" pathOpacity={0.08} />
      
      {/* Header */}
      <header className="border-b bg-background/90 backdrop-blur-md sticky top-0 z-50 animate-slide-up">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-20 h-20 flex items-center justify-center animate-float">
                <img 
                  src="https://res.cloudinary.com/dd2syj8aq/image/upload/v1739466097/logo_ri6b03.png" 
                  alt="SoFI Logo"
                  className="hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gradient">Society of Finance & Investing</h2>
                <p className="text-sm text-muted-foreground">BITS Pilani</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 lg:py-32 relative z-10">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="animate-fade-in-up mb-6">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-8">
                <Sparkles className="w-4 h-4" />
                Induction 2025 Now Open
              </div>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold mb-8 leading-tight animate-slide-up">
              Welcome to{' '}
              <span className="text-gradient animate-bounce-gentle inline-block">SoFI</span>
              <br />
              <span className="text-3xl lg:text-5xl text-muted-foreground font-normal">
                Induction Portal
              </span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed animate-slide-up-delayed">
              Join the Society of Finance and Investing. Test your financial knowledge, 
              showcase your creativity, and become part of our growing community.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16 animate-scale-in">
              <Button
                size="xl"
                variant="premium"
                onClick={() => setShowForm(true)}
                className="group hover-lift relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary-glow/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                Start Your Application
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            {/* Feature highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mt-16">
              {[
                {
                  icon: Target,
                  title: "Skill Assessment",
                  description: "Test your financial knowledge with our comprehensive questions"
                },
                {
                  icon: BookOpen,
                  title: "Creative Challenges",
                  description: "Apply concepts through fun and engaging case studies"
                },
                {
                  icon: Trophy,
                  title: "Join the Community",
                  description: "Become part of BITS Pilani's premier finance society"
                }
              ].map((feature, index) => (
                <div key={index} className="stagger-animation group">
                  <div className="flex flex-col items-center text-center p-6 rounded-xl bg-background/40 backdrop-blur-sm border border-border/50 hover-lift">
                    <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <feature.icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Application Process */}
      <section className="py-20 bg-background/60 backdrop-blur-sm relative z-10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <FileSpreadsheet className="w-4 h-4" />
              Simple 4-Step Process
            </div>
            <h2 className="text-4xl font-bold mb-4 text-gradient">Application Journey</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Our induction process is designed to test your financial knowledge and creativity
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              {
                step: "01",
                title: "Personal Information",
                description: "Share your basic details and contact information",
                icon: Users,
                color: "from-blue-500/20 to-blue-600/20"
              },
              {
                step: "02", 
                title: "Basic Questions",
                description: "Test your fundamental finance knowledge",
                icon: BookOpen,
                color: "from-green-500/20 to-green-600/20"
              },
              {
                step: "03",
                title: "Case Studies", 
                description: "Apply your knowledge to creative scenarios",
                icon: Target,
                color: "from-purple-500/20 to-purple-600/20"
              },
              {
                step: "04",
                title: "About SoFI",
                description: "Show your awareness of our society",
                icon: Award,
                color: "from-orange-500/20 to-orange-600/20"
              }
            ].map((item, index) => (
              <Card key={index} className="border-0 bg-background/80 shadow-elegant hover-lift stagger-animation group relative overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <CardContent className="p-8 text-center relative z-10">
                  <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6 text-primary-foreground font-bold text-lg group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    {item.step}
                  </div>
                  <div className="mb-4">
                    <item.icon className="w-8 h-8 mx-auto text-primary/60 group-hover:text-primary transition-colors duration-300" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors duration-300">{item.title}</h3>
                  <p className="text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300">{item.description}</p>
                  
                  {/* Progress connector */}
                  {index < 3 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-primary/30 to-transparent" />
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Call to action */}
          <div className="text-center mt-16 animate-fade-in-up">
            <Button
              size="lg"
              variant="outline"
              onClick={() => setShowForm(true)}
              className="group hover-lift bg-background/80 backdrop-blur-sm"
            >
              Ready to Begin?
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background/80 backdrop-blur-md relative z-10">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-28 h-28 flex items-center justify-center animate-float-delayed">
                <img 
                  src="https://res.cloudinary.com/dd2syj8aq/image/upload/v1739466097/logo_ri6b03.png" 
                  alt="SoFI Logo"
                  className="hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
            <p className="text-muted-foreground mb-2">
              Society of Finance and Investing • BITS Pilani
            </p>
            <p className="text-sm text-muted-foreground/60">
              Empowering the next generation of financial leaders
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;