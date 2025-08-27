import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Download, Users, Clock, FileSpreadsheet } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Application {
  id: string;
  full_name: string;
  bits_id: string;
  mobile_number: string;
  whatsapp_number: string | null;
  email: string;
  created_at: string;
}

interface AdminPanelProps {
  onBack: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onBack }) => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('id, full_name, bits_id, mobile_number, whatsapp_number, email, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error('Error loading applications:', error);
      toast({
        title: "Error",
        description: "Failed to load applications. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const exportToGoogleSheets = async () => {
    if (!webhookUrl) {
      toast({
        title: "Webhook URL Required",
        description: "Please enter your Google Sheets webhook URL first.",
        variant: "destructive"
      });
      return;
    }

    setExporting(true);
    try {
      // Get all application data including answers
      const { data: fullData, error } = await supabase
        .from('applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Format data for Google Sheets
      const formattedData = fullData?.map(app => ({
        Name: app.full_name,
        'BITS ID': app.bits_id,
        'Mobile Number': app.mobile_number,
        'WhatsApp Number': app.whatsapp_number || '',
        'Email ID': app.email,
        'Assets & Equity Answer': app.assets_equity_answer,
        'Financial Statements Answer': app.financial_statements_answer,
        'Net Worth Answer': app.net_worth_answer,
        'Balance Sheet vs Income Statement': app.balance_income_difference,
        'P/E and P/B Ratio Answer': app.pe_pb_ratio_answer,
        'Loan Transaction Answer': app.loan_transaction_answer,
        'Life Annual Report Answer': app.life_annual_report_answer,
        'Tinder Portfolio Answer': app.tinder_portfolio_answer,
        'Stock Market Explanation': app.stock_market_explanation,
        'SoFI Platforms Answer': app.sofi_platforms_answer,
        'SoFI Purpose Answer': app.sofi_purpose_answer,
        'Submitted At': new Date(app.created_at).toLocaleString()
      }));

      // Send to webhook
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'no-cors',
        body: JSON.stringify({
          data: formattedData,
          timestamp: new Date().toISOString(),
          totalApplications: formattedData?.length || 0
        }),
      });

      toast({
        title: "Export Initiated",
        description: `${formattedData?.length || 0} applications sent to Google Sheets. Check your Zapier history to confirm.`,
      });

    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export Failed",
        description: "Failed to export data. Please check your webhook URL and try again.",
        variant: "destructive"
      });
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto py-8 px-6">
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={onBack}
            className="mb-6 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gradient mb-2">Admin Panel</h1>
              <p className="text-muted-foreground">Manage SoFI induction applications</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users className="w-4 h-4" />
                <span>{applications.length} Applications</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>Last updated: {new Date().toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Export Section */}
        <Card className="mb-8 shadow-elegant border-0 bg-background/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5" />
              Export to Google Sheets
            </CardTitle>
            <CardDescription>
              Set up a Zapier webhook to automatically export application data to Google Sheets
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="webhookUrl" className="text-sm font-medium">
                  Zapier Webhook URL
                </Label>
                <Input
                  id="webhookUrl"
                  type="url"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  placeholder="https://hooks.zapier.com/hooks/catch/..."
                  className="mt-1"
                />
              </div>
              <div className="flex items-end">
                <Button
                  onClick={exportToGoogleSheets}
                  disabled={exporting || !webhookUrl}
                  className="flex items-center gap-2 bg-gradient-primary hover:shadow-glow transition-smooth"
                >
                  {exporting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      Export Data
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Applications Table */}
        <Card className="shadow-elegant border-0 bg-background/80">
          <CardHeader>
            <CardTitle>Recent Applications</CardTitle>
            <CardDescription>
              Overview of submitted induction applications
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : applications.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No Applications Yet</h3>
                <p className="text-muted-foreground">Applications will appear here once submitted.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>BITS ID</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Mobile</TableHead>
                      <TableHead>Submitted</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {applications.map((app) => (
                      <TableRow key={app.id}>
                        <TableCell className="font-medium">{app.full_name}</TableCell>
                        <TableCell>{app.bits_id}</TableCell>
                        <TableCell>{app.email}</TableCell>
                        <TableCell>{app.mobile_number}</TableCell>
                        <TableCell>
                          {new Date(app.created_at).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};