import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const CreateCustomAdmin: React.FC = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [isCreated, setIsCreated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { toast } = useToast();

  const createAdminUser = async () => {
    if (!username || !password) {
      toast({
        title: "Missing Information",
        description: "Please provide both username and password.",
        variant: "destructive"
      });
      return;
    }

    setIsCreating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('create-custom-admin', {
        body: { username, password }
      });
      
      if (error) {
        throw error;
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setIsCreated(true);
      toast({
        title: "Admin User Created",
        description: `Admin user '${username}' has been created successfully.`,
      });
    } catch (error: any) {
      console.error('Error creating admin user:', error);
      toast({
        title: "Creation Failed",
        description: error.message || "Failed to create admin user. Please try again.",
        variant: "destructive"
      });
    }
    
    setIsCreating(false);
  };

  if (isCreated) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="container mx-auto px-6 py-8 max-w-md">
          <Card className="shadow-elegant border-0 bg-background/80">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-primary-foreground" />
              </div>
              <CardTitle className="text-2xl font-bold text-gradient">
                Admin User Created
              </CardTitle>
              <CardDescription>
                Admin user '{username}' has been successfully created.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => window.location.reload()}
                className="w-full bg-gradient-primary hover:shadow-glow transition-smooth"
              >
                Continue
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
      <div className="container mx-auto px-6 py-8 max-w-md">
        <Card className="shadow-elegant border-0 bg-background/80">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl font-bold text-gradient">
              Create Admin User
            </CardTitle>
            <CardDescription>
              Create a new admin user with custom credentials.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                />
              </div>
              
              <Button
                onClick={createAdminUser}
                disabled={isCreating || !username || !password}
                className="w-full bg-gradient-primary hover:shadow-glow transition-smooth"
              >
                {isCreating ? 'Creating Admin User...' : 'Create Admin User'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};