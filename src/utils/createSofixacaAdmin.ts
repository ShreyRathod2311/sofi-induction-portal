import { supabase } from "@/integrations/supabase/client";

export const createSofixacaAdmin = async () => {
  try {
    const { data, error } = await supabase.functions.invoke('create-custom-admin', {
      body: { 
        username: 'sofixaca', 
        password: 'welcometosofi' 
      }
    });
    
    if (error) {
      throw error;
    }

    if (data.error) {
      throw new Error(data.error);
    }

    console.log('Admin user "sofixaca" created successfully:', data);
    return data;
  } catch (error: any) {
    console.error('Error creating sofixaca admin:', error);
    throw error;
  }
};