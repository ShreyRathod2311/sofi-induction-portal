import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Users, TrendingUp, Award, FileSpreadsheet } from "lucide-react";
import { InductionForm } from "@/components/InductionForm";
import { AdminPanel } from "@/components/AdminPanel";

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
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gradient">SoFI</h1>
                <p className="text-xs text-muted-foreground">Society of Finance & Investing</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdmin(true)}
              className="flex items-center gap-2"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Admin
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl lg:text-7xl font-bold mb-8 leading-tight">
              Welcome to{' '}
              <span className="text-gradient">SoFI</span>
              <br />
              <span className="text-3xl lg:text-5xl text-muted-foreground font-normal">
                Induction Portal
              </span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
              Join the Society of Finance and Investing. Test your financial knowledge, 
              showcase your creativity, and become part of our growing community.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <Button
                size="xl"
                variant="premium"
                onClick={() => setShowForm(true)}
                className="group"
              >
                Start Your Application
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button
                size="xl"
                variant="outline"
                className="border-primary/20 hover:border-primary transition-smooth"
              >
                Learn More About SoFI
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
              <Card className="border-0 bg-background/60 backdrop-blur-sm shadow-elegant">
                <CardContent className="p-6 text-center">
                  <Users className="w-8 h-8 mx-auto mb-3 text-primary" />
                  <h3 className="text-2xl font-bold mb-1">500+</h3>
                  <p className="text-muted-foreground">Active Members</p>
                </CardContent>
              </Card>
              
              <Card className="border-0 bg-background/60 backdrop-blur-sm shadow-elegant">
                <CardContent className="p-6 text-center">
                  <TrendingUp className="w-8 h-8 mx-auto mb-3 text-primary" />
                  <h3 className="text-2xl font-bold mb-1">₹50L+</h3>
                  <p className="text-muted-foreground">Portfolio Value</p>
                </CardContent>
              </Card>
              
              <Card className="border-0 bg-background/60 backdrop-blur-sm shadow-elegant">
                <CardContent className="p-6 text-center">
                  <Award className="w-8 h-8 mx-auto mb-3 text-primary" />
                  <h3 className="text-2xl font-bold mb-1">50+</h3>
                  <p className="text-muted-foreground">Events Organized</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Application Process */}
      <section className="py-20 bg-background/40">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Application Process</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our induction process is designed to test your financial knowledge and creativity
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              {
                step: "01",
                title: "Personal Information",
                description: "Share your basic details and contact information"
              },
              {
                step: "02", 
                title: "Basic Questions",
                description: "Test your fundamental finance knowledge"
              },
              {
                step: "03",
                title: "Case Studies", 
                description: "Apply your knowledge to creative scenarios"
              },
              {
                step: "04",
                title: "About SoFI",
                description: "Show your awareness of our society"
              }
            ].map((item, index) => (
              <Card key={index} className="border-0 bg-background/80 shadow-elegant hover:shadow-glow transition-smooth">
                <CardContent className="p-8 text-center">
                  <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 text-primary-foreground font-bold text-lg">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold mb-6">Ready to Join SoFI?</h2>
            <p className="text-xl text-muted-foreground mb-10">
              Take the first step towards your finance journey. Complete our induction form and become part of our community.
            </p>
            
            <Button
              size="xl"
              variant="premium"
              onClick={() => setShowForm(true)}
              className="group"
            >
              Start Application Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background/60 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold text-gradient">SoFI</span>
            </div>
            <p className="text-muted-foreground">
              Society of Finance and Investing • BITS Pilani
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;