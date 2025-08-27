import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Download, Users, Clock, FileSpreadsheet, Eye, Check, X, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Application {
  id: string;
  full_name: string;
  bits_id: string;
  mobile_number: string;
  whatsapp_number: string | null;
  email: string;
  assets_equity_answer: string;
  financial_statements_answer: string;
  net_worth_answer: string;
  balance_income_difference: string;
  pe_pb_ratio_answer: string;
  loan_transaction_answer: string;
  life_annual_report_answer: string;
  tinder_portfolio_answer: string;
  stock_market_explanation: string;
  sofi_platforms_answer: string;
  sofi_purpose_answer: string;
  status?: 'pending' | 'accepted' | 'rejected';
  created_at: string;
}

interface AdminPanelProps {
  onBack: () => void;
  onLogout: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onBack, onLogout }) => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadApplications();
  }, []);

  useEffect(() => {
    // Filter applications based on search term
    const filtered = applications.filter(app => 
      app.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.bits_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredApplications(filtered);
  }, [applications, searchTerm]);

  const loadApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Add status field (since it's not in the database yet, we'll simulate it)
      const applicationsWithStatus = data?.map(app => ({
        ...app,
        status: 'pending' as const
      })) || [];
      
      setApplications(applicationsWithStatus);
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

  const handleStatusChange = async (applicationId: string, newStatus: 'accepted' | 'rejected') => {
    try {
      // Update local state immediately for better UX
      setApplications(prev => 
        prev.map(app => 
          app.id === applicationId ? { ...app, status: newStatus } : app
        )
      );

      toast({
        title: "Status Updated",
        description: `Application ${newStatus} successfully.`,
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update application status.",
        variant: "destructive"
      });
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
      // Format data for Google Sheets
      const formattedData = applications.map(app => ({
        Name: app.full_name,
        'BITS ID': app.bits_id,
        'Mobile Number': app.mobile_number,
        'WhatsApp Number': app.whatsapp_number || '',
        'Email ID': app.email,
        'Status': app.status || 'pending',
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
      await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'no-cors',
        body: JSON.stringify({
          data: formattedData,
          timestamp: new Date().toISOString(),
          totalApplications: formattedData.length
        }),
      });

      toast({
        title: "Export Initiated",
        description: `${formattedData.length} applications sent to Google Sheets. Check your Zapier history to confirm.`,
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'accepted':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Accepted</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Rejected</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto py-8 px-6">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <Button
              variant="outline"
              onClick={onBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
            <Button
              variant="outline"
              onClick={onLogout}
              className="text-red-600 hover:text-red-700"
            >
              Logout
            </Button>
          </div>

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
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle>Applications Review</CardTitle>
                <CardDescription>
                  Review and manage submitted induction applications
                </CardDescription>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, BITS ID, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full md:w-80"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : filteredApplications.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">
                  {searchTerm ? 'No matching applications' : 'No Applications Yet'}
                </h3>
                <p className="text-muted-foreground">
                  {searchTerm ? 'Try adjusting your search terms.' : 'Applications will appear here once submitted.'}
                </p>
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
                      <TableHead>Status</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredApplications.map((app) => (
                      <TableRow key={app.id}>
                        <TableCell className="font-medium">{app.full_name}</TableCell>
                        <TableCell>{app.bits_id}</TableCell>
                        <TableCell>{app.email}</TableCell>
                        <TableCell>{app.mobile_number}</TableCell>
                        <TableCell>{getStatusBadge(app.status || 'pending')}</TableCell>
                        <TableCell>
                          {new Date(app.created_at).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setSelectedApplication(app)}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>Application Details - {app.full_name}</DialogTitle>
                                  <DialogDescription>
                                    Review the complete application submission
                                  </DialogDescription>
                                </DialogHeader>
                                {selectedApplication && (
                                  <div className="space-y-6">
                                    {/* Personal Information */}
                                    <div>
                                      <h3 className="text-lg font-semibold mb-3">Personal Information</h3>
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <Label className="text-sm font-medium">Full Name</Label>
                                          <p className="text-sm text-muted-foreground">{selectedApplication.full_name}</p>
                                        </div>
                                        <div>
                                          <Label className="text-sm font-medium">BITS ID</Label>
                                          <p className="text-sm text-muted-foreground">{selectedApplication.bits_id}</p>
                                        </div>
                                        <div>
                                          <Label className="text-sm font-medium">Email</Label>
                                          <p className="text-sm text-muted-foreground">{selectedApplication.email}</p>
                                        </div>
                                        <div>
                                          <Label className="text-sm font-medium">Mobile</Label>
                                          <p className="text-sm text-muted-foreground">{selectedApplication.mobile_number}</p>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Basic Questions */}
                                    <div>
                                      <h3 className="text-lg font-semibold mb-3">Basic Questions</h3>
                                      <div className="space-y-4">
                                        <div>
                                          <Label className="text-sm font-medium">Assets & Equity</Label>
                                          <Textarea value={selectedApplication.assets_equity_answer} readOnly className="mt-1" />
                                        </div>
                                        <div>
                                          <Label className="text-sm font-medium">Financial Statements</Label>
                                          <Textarea value={selectedApplication.financial_statements_answer} readOnly className="mt-1" />
                                        </div>
                                        <div>
                                          <Label className="text-sm font-medium">Net Worth</Label>
                                          <Textarea value={selectedApplication.net_worth_answer} readOnly className="mt-1" />
                                        </div>
                                        <div>
                                          <Label className="text-sm font-medium">Balance Sheet vs Income Statement</Label>
                                          <Textarea value={selectedApplication.balance_income_difference} readOnly className="mt-1" />
                                        </div>
                                        <div>
                                          <Label className="text-sm font-medium">P/E and P/B Ratio</Label>
                                          <Textarea value={selectedApplication.pe_pb_ratio_answer} readOnly className="mt-1" />
                                        </div>
                                      </div>
                                    </div>

                                    {/* Case Studies */}
                                    <div>
                                      <h3 className="text-lg font-semibold mb-3">Case Studies</h3>
                                      <div className="space-y-4">
                                        <div>
                                          <Label className="text-sm font-medium">Loan Transaction</Label>
                                          <Textarea value={selectedApplication.loan_transaction_answer} readOnly className="mt-1" />
                                        </div>
                                        <div>
                                          <Label className="text-sm font-medium">Life Annual Report</Label>
                                          <Textarea value={selectedApplication.life_annual_report_answer} readOnly className="mt-1" />
                                        </div>
                                        <div>
                                          <Label className="text-sm font-medium">Tinder Portfolio</Label>
                                          <Textarea value={selectedApplication.tinder_portfolio_answer} readOnly className="mt-1" />
                                        </div>
                                        <div>
                                          <Label className="text-sm font-medium">Stock Market Explanation</Label>
                                          <Textarea value={selectedApplication.stock_market_explanation} readOnly className="mt-1" />
                                        </div>
                                      </div>
                                    </div>

                                    {/* About SoFI */}
                                    <div>
                                      <h3 className="text-lg font-semibold mb-3">About SoFI</h3>
                                      <div className="space-y-4">
                                        <div>
                                          <Label className="text-sm font-medium">SoFI Platforms</Label>
                                          <Textarea value={selectedApplication.sofi_platforms_answer} readOnly className="mt-1" />
                                        </div>
                                        <div>
                                          <Label className="text-sm font-medium">SoFI Purpose</Label>
                                          <Textarea value={selectedApplication.sofi_purpose_answer} readOnly className="mt-1" />
                                        </div>
                                      </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex justify-end gap-2 pt-4 border-t">
                                      <Button
                                        variant="outline"
                                        onClick={() => handleStatusChange(selectedApplication.id, 'rejected')}
                                        className="text-red-600 hover:text-red-700"
                                      >
                                        <X className="w-4 h-4 mr-2" />
                                        Reject
                                      </Button>
                                      <Button
                                        onClick={() => handleStatusChange(selectedApplication.id, 'accepted')}
                                        className="bg-green-600 hover:bg-green-700 text-white"
                                      >
                                        <Check className="w-4 h-4 mr-2" />
                                        Accept
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                            
                            {app.status === 'pending' && (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleStatusChange(app.id, 'accepted')}
                                  className="text-green-600 hover:text-green-700"
                                >
                                  <Check className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleStatusChange(app.id, 'rejected')}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </>
                            )}
                          </div>
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