import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const CreateAdminUser: React.FC = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [isCreated, setIsCreated] = useState(false);
  const { toast } = useToast();

  const createAdminUser = async () => {
    setIsCreating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('create-admin-user');
      
      if (error) {
        throw error;
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setIsCreated(true);
      toast({
        title: "Admin User Created",
        description: "Admin user 'sofigoats' has been created successfully with the new password.",
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

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
      <div className="container mx-auto px-6 py-8 max-w-md">
        <Card className="shadow-elegant border-0 bg-background/80">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
              {isCreated ? (
                <CheckCircle className="w-8 h-8 text-primary-foreground" />
              ) : (
                <Shield className="w-8 h-8 text-primary-foreground" />
              )}
            </div>
            <CardTitle className="text-2xl font-bold text-gradient">
              {isCreated ? "Admin User Created" : "Create Admin User"}
            </CardTitle>
            <CardDescription>
              {isCreated 
                ? "Admin user has been successfully created. You can now log in with the new credentials."
                : "This will create an admin user with username 'sofigoats' and the new password."
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isCreated ? (
              <div className="space-y-4">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Admin Credentials</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <div>Username: sofigoats</div>
                    <div>Password: financeislove</div>
                  </div>
                </div>
                
                <Button
                  onClick={createAdminUser}
                  disabled={isCreating}
                  className="w-full bg-gradient-primary hover:shadow-glow transition-smooth"
                >
                  {isCreating ? 'Creating Admin User...' : 'Create Admin User'}
                </Button>
              </div>
            ) : (
              <div className="text-center">
                <div className="text-sm text-muted-foreground mb-4">
                  You can now use the admin login with the new credentials.
                </div>
                <Button
                  onClick={() => window.location.reload()}
                  className="w-full bg-gradient-primary hover:shadow-glow transition-smooth"
                >
                  Continue to Login
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};