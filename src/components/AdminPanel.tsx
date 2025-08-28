import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowLeft, LogOut, Users, FileText, Calendar, Eye, Download, RefreshCw } from "lucide-react";
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
  created_at: string;
  updated_at: string;
}

interface AdminPanelProps {
  onBack: () => void;
  onLogout: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onBack, onLogout }) => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const { toast } = useToast();

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setApplications(data || []);
      toast({
        title: "Applications Loaded",
        description: `Found ${data?.length || 0} applications`,
      });
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast({
        title: "Error",
        description: "Failed to load applications. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const exportToCSV = () => {
    if (applications.length === 0) {
      toast({
        title: "No Data",
        description: "No applications to export",
        variant: "destructive"
      });
      return;
    }

    const headers = [
      'Name', 'BITS ID', 'Email', 'Mobile', 'WhatsApp', 'Submitted At',
      'Assets & Equity', 'Financial Statements', 'Net Worth', 'Balance vs Income',
      'P/E & P/B Ratio', 'Loan Transaction', 'Life Annual Report', 'Tinder Portfolio',
      'Stock Market Explanation', 'SoFI Platforms', 'SoFI Purpose'
    ];

    const csvContent = [
      headers.join(','),
      ...applications.map(app => [
        `"${app.full_name}"`,
        `"${app.bits_id}"`,
        `"${app.email}"`,
        `"${app.mobile_number}"`,
        `"${app.whatsapp_number || 'N/A'}"`,
        `"${formatDate(app.created_at)}"`,
        `"${app.assets_equity_answer.replace(/"/g, '""')}"`,
        `"${app.financial_statements_answer.replace(/"/g, '""')}"`,
        `"${app.net_worth_answer.replace(/"/g, '""')}"`,
        `"${app.balance_income_difference.replace(/"/g, '""')}"`,
        `"${app.pe_pb_ratio_answer.replace(/"/g, '""')}"`,
        `"${app.loan_transaction_answer.replace(/"/g, '""')}"`,
        `"${app.life_annual_report_answer.replace(/"/g, '""')}"`,
        `"${app.tinder_portfolio_answer.replace(/"/g, '""')}"`,
        `"${app.stock_market_explanation.replace(/"/g, '""')}"`,
        `"${app.sofi_platforms_answer.replace(/"/g, '""')}"`,
        `"${app.sofi_purpose_answer.replace(/"/g, '""')}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `sofi_applications_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export Successful",
      description: "Applications exported to CSV file",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gradient">Admin Panel</h1>
              <p className="text-muted-foreground">Manage SoFI induction applications</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={fetchApplications} disabled={loading} className="flex items-center gap-2">
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button variant="outline" onClick={exportToCSV} className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export CSV
            </Button>
            <Button variant="destructive" onClick={onLogout} className="flex items-center gap-2">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-elegant">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{applications.length}</div>
              <p className="text-xs text-muted-foreground">
                {applications.length > 0 ? `Latest: ${formatDate(applications[0]?.created_at)}` : 'No applications yet'}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-elegant">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Applications</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {applications.filter(app => 
                  new Date(app.created_at).toDateString() === new Date().toDateString()
                ).length}
              </div>
              <p className="text-xs text-muted-foreground">Applications submitted today</p>
            </CardContent>
          </Card>

          <Card className="shadow-elegant">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">100%</div>
              <p className="text-xs text-muted-foreground">All submissions are complete</p>
            </CardContent>
          </Card>
        </div>

        {/* Applications Table */}
        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Applications ({applications.length})
            </CardTitle>
            <CardDescription>
              All submitted induction applications with detailed information
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <RefreshCw className="w-8 h-8 animate-spin text-primary" />
                <span className="ml-2 text-lg">Loading applications...</span>
              </div>
            ) : applications.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Applications Yet</h3>
                <p className="text-muted-foreground">Applications will appear here once students start submitting them.</p>
              </div>
            ) : (
              <ScrollArea className="h-[600px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>BITS ID</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Mobile</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {applications.map((application) => (
                      <TableRow key={application.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">{application.full_name}</TableCell>
                        <TableCell>{application.bits_id}</TableCell>
                        <TableCell>{application.email}</TableCell>
                        <TableCell>{application.mobile_number}</TableCell>
                        <TableCell>{formatDate(application.created_at)}</TableCell>
                        <TableCell>
                          <Badge variant="default" className="bg-green-100 text-green-800">
                            Complete
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => setSelectedApplication(application)}
                                className="flex items-center gap-1"
                              >
                                <Eye className="w-3 h-3" />
                                View
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Application Details - {application.full_name}</DialogTitle>
                                <DialogDescription>
                                  Submitted on {formatDate(application.created_at)}
                                </DialogDescription>
                              </DialogHeader>
                              
                              <Tabs defaultValue="personal" className="w-full">
                                <TabsList className="grid w-full grid-cols-4">
                                  <TabsTrigger value="personal">Personal</TabsTrigger>
                                  <TabsTrigger value="basic">Basic Questions</TabsTrigger>
                                  <TabsTrigger value="case">Case Studies</TabsTrigger>
                                  <TabsTrigger value="sofi">About SoFI</TabsTrigger>
                                </TabsList>
                                
                                <TabsContent value="personal" className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <label className="text-sm font-medium">Full Name</label>
                                      <p className="text-sm text-muted-foreground">{application.full_name}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium">BITS ID</label>
                                      <p className="text-sm text-muted-foreground">{application.bits_id}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium">Email</label>
                                      <p className="text-sm text-muted-foreground">{application.email}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium">Mobile Number</label>
                                      <p className="text-sm text-muted-foreground">{application.mobile_number}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium">WhatsApp Number</label>
                                      <p className="text-sm text-muted-foreground">{application.whatsapp_number || 'Not provided'}</p>
                                    </div>
                                  </div>
                                </TabsContent>
                                
                                <TabsContent value="basic" className="space-y-4">
                                  <div className="space-y-4">
                                    <div>
                                      <label className="text-sm font-medium">Assets & Equity Question</label>
                                      <p className="text-sm text-muted-foreground mt-1 p-3 bg-muted rounded">{application.assets_equity_answer}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium">Financial Statements</label>
                                      <p className="text-sm text-muted-foreground mt-1 p-3 bg-muted rounded">{application.financial_statements_answer}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium">Net Worth</label>
                                      <p className="text-sm text-muted-foreground mt-1 p-3 bg-muted rounded">{application.net_worth_answer}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium">Balance Sheet vs Income Statement</label>
                                      <p className="text-sm text-muted-foreground mt-1 p-3 bg-muted rounded">{application.balance_income_difference}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium">P/E & P/B Ratio</label>
                                      <p className="text-sm text-muted-foreground mt-1 p-3 bg-muted rounded">{application.pe_pb_ratio_answer}</p>
                                    </div>
                                  </div>
                                </TabsContent>
                                
                                <TabsContent value="case" className="space-y-4">
                                  <div className="space-y-4">
                                    <div>
                                      <label className="text-sm font-medium">Loan Transaction</label>
                                      <p className="text-sm text-muted-foreground mt-1 p-3 bg-muted rounded">{application.loan_transaction_answer}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium">Life Annual Report</label>
                                      <p className="text-sm text-muted-foreground mt-1 p-3 bg-muted rounded">{application.life_annual_report_answer}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium">Tinder Portfolio</label>
                                      <p className="text-sm text-muted-foreground mt-1 p-3 bg-muted rounded">{application.tinder_portfolio_answer}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium">Stock Market Explanation</label>
                                      <p className="text-sm text-muted-foreground mt-1 p-3 bg-muted rounded">{application.stock_market_explanation}</p>
                                    </div>
                                  </div>
                                </TabsContent>
                                
                                <TabsContent value="sofi" className="space-y-4">
                                  <div className="space-y-4">
                                    <div>
                                      <label className="text-sm font-medium">SoFI Platforms</label>
                                      <p className="text-sm text-muted-foreground mt-1 p-3 bg-muted rounded">{application.sofi_platforms_answer}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium">SoFI Purpose</label>
                                      <p className="text-sm text-muted-foreground mt-1 p-3 bg-muted rounded">{application.sofi_purpose_answer}</p>
                                    </div>
                                  </div>
                                </TabsContent>
                              </Tabs>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPanel;