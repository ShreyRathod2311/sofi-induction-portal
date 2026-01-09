import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Users, Award, Sparkles, Target, BookOpen, Shield } from "lucide-react";
import { InductionForm } from "@/components/InductionForm";
import { AdminLogin } from "@/components/AdminLogin";
import { AdminPanel } from "@/components/AdminPanel";
import { BackgroundPaths } from "@/components/ui/background-paths";

const Index = () => {
  const [showForm, setShowForm] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);


  if (showAdminLogin && !isAdminAuthenticated) {
    return (
      <AdminLogin 
        onLogin={() => {
          setIsAdminAuthenticated(true);
          setShowAdminLogin(false);
        }}
        onBack={() => setShowAdminLogin(false)}
      />
    );
  }

  if (isAdminAuthenticated) {
    return (
      <AdminPanel 
        onBack={() => {
          setIsAdminAuthenticated(false);
          setShowAdminLogin(false);
        }}
        onLogout={() => {
          setIsAdminAuthenticated(false);
          setShowAdminLogin(false);
        }}
      />
    );
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
      <BackgroundPaths className="fixed inset-0 z-0" pathColor="hsl(var(--primary))" pathOpacity={0.25} />
      
      {/* Header */}
      <header className="bg-background/70 backdrop-blur-xl sticky top-0 z-50 animate-slide-up border-b border-border/40">
        <div className="container mx-auto px-6 py-5">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 flex items-center justify-center animate-float">
                <img 
                  src="https://res.cloudinary.com/dd2syj8aq/image/upload/v1739466097/logo_ri6b03.png" 
                  alt="SoFI Logo"
                  className="hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div>
                <h2 className="text-lg font-semibold tracking-tight">Society of Finance & Investing</h2>
                <p className="text-xs text-muted-foreground/70">BITS Goa</p>
              </div>
            </div>
            <Button
              variant="ghost"
              onClick={() => setShowAdminLogin(true)}
              className="flex items-center gap-2 hover:bg-primary/5 transition-colors"
            >
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">Admin</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-24 lg:py-40 relative z-10">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto text-center">
            <div className="animate-fade-in-up mb-8">
              <div className="inline-flex items-center gap-2 bg-primary/8 text-primary px-4 py-1.5 rounded-full text-sm font-medium border border-primary/10">
                <Sparkles className="w-3.5 h-3.5" />
                Winter Inductions 2026
              </div>
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-8xl font-light mb-6 leading-[1.1] animate-slide-up tracking-tight">
              Welcome to{' '}
              <span className="font-bold text-gradient block mt-2">SoFI</span>
            </h1>
            
            <p className="text-lg lg:text-xl text-muted-foreground/80 mb-14 max-w-2xl mx-auto leading-relaxed animate-slide-up-delayed font-light">
              Join the Society of Finance and Investing. Test your financial knowledge, 
              showcase your creativity, and become part of our community.
            </p>

            <div className="animate-scale-in">
              <Button
                size="lg"
                onClick={() => setShowForm(true)}
                className="group h-14 px-10 text-base font-medium rounded-full hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
              >
                Start Your Application
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

          </div>
        </div>
      </section>

      {/* Application Process */}
      <section className="py-24 relative z-10">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20 animate-fade-in-up">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light mb-4 tracking-tight">
                Application <span className="font-semibold text-gradient">Process</span>
              </h2>
              <p className="text-muted-foreground/70 max-w-xl mx-auto text-sm lg:text-base font-light">
                A streamlined journey in four simple steps
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {[
                {
                  step: "01",
                  title: "Personal Info",
                  description: "Basic details",
                  icon: Users
                },
                {
                  step: "02", 
                  title: "Finance Quiz",
                  description: "Test knowledge",
                  icon: BookOpen
                },
                {
                  step: "03",
                  title: "Case Study", 
                  description: "Apply concepts",
                  icon: Target
                },
                {
                  step: "04",
                  title: "About SoFI",
                  description: "Society awareness",
                  icon: Award
                }
              ].map((item, index) => (
                <Card key={index} className="border border-border/40 bg-background/60 backdrop-blur-sm hover:bg-background/80 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl group">
                  <CardContent className="p-8 text-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/15 transition-colors duration-300">
                      <item.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="text-sm font-medium text-primary/40 mb-2">{item.step}</div>
                    <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground/60 font-light">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="text-center mt-16 animate-fade-in-up">
              <Button
                variant="outline"
                onClick={() => setShowForm(true)}
                className="group h-12 px-8 rounded-full hover:bg-primary/5 border-border/60 transition-all duration-300"
              >
                Ready to Begin
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-background/40 backdrop-blur-sm relative z-10 mt-20">
        <div className="container mx-auto px-6 py-12">
          <div className="text-center max-w-md mx-auto">
            <div className="w-16 h-16 flex items-center justify-center mx-auto mb-6 opacity-60 hover:opacity-100 transition-opacity duration-300">
              <img 
                src="https://res.cloudinary.com/dd2syj8aq/image/upload/v1739466097/logo_ri6b03.png" 
                alt="SoFI Logo"
              />
            </div>
            <p className="text-sm text-muted-foreground/60 font-light">
              Society of Finance and Investing
            </p>
            <p className="text-xs text-muted-foreground/40 mt-1">
              BITS Goa
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
