import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ArrowLeft, LogOut, Users, FileText, Calendar, Eye, Download, RefreshCw, Check, X, Clock, Filter, Search, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  status: 'pending' | 'approved' | 'rejected';
  reviewed_at: string | null;
  reviewed_by: string | null;
  created_at: string;
  updated_at: string;
}

interface AdminPanelProps {
  onBack: () => void;
  onLogout: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onBack, onLogout }) => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);
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

      setApplications((data as Application[]) || []);
      setFilteredApplications((data as Application[]) || []);
      toast({
        title: "Data refreshed",
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

  const updateApplicationStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      setProcessingId(id);
      const { error } = await supabase
        .from('applications')
        .update({
          status,
          reviewed_at: new Date().toISOString(),
          reviewed_by: 'Admin' // You can enhance this to use actual admin name
        })
        .eq('id', id);

      if (error) throw error;

      // Update local state
      const updatedApplications = applications.map(app =>
        app.id === id 
          ? { ...app, status, reviewed_at: new Date().toISOString(), reviewed_by: 'Admin' }
          : app
      );
      setApplications(updatedApplications);
      applyFilters(updatedApplications, statusFilter, searchQuery);

      toast({
        title: `Application ${status}`,
        description: `The application has been ${status} successfully.`,
      });
    } catch (error) {
      console.error('Error updating application:', error);
      toast({
        title: "Error",
        description: `Failed to ${status} application. Please try again.`,
        variant: "destructive"
      });
    } finally {
      setProcessingId(null);
    }
  };

  const applyFilters = (apps: Application[], statusFilter: string, searchQuery: string) => {
    let filtered = apps;

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.status === statusFilter);
    }

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(app =>
        app.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.bits_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredApplications(filtered);
  };

  useEffect(() => {
    applyFilters(applications, statusFilter, searchQuery);
  }, [applications, statusFilter, searchQuery]);

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
    if (filteredApplications.length === 0) {
      toast({
        title: "No Data",
        description: "No applications to export",
        variant: "destructive"
      });
      return;
    }

    const headers = [
      'Name', 'BITS ID', 'Email', 'Mobile', 'WhatsApp', 'Status', 'Submitted At', 'Reviewed At', 'Reviewed By',
      'Assets & Equity', 'Financial Statements', 'Net Worth', 'Balance vs Income',
      'P/E & P/B Ratio', 'Loan Transaction', 'Life Annual Report', 'Tinder Portfolio',
      'Stock Market Explanation', 'SoFI Platforms', 'SoFI Purpose'
    ];

    const csvContent = [
      headers.join(','),
      ...filteredApplications.map(app => [
        `"${app.full_name}"`,
        `"${app.bits_id}"`,
        `"${app.email}"`,
        `"${app.mobile_number}"`,
        `"${app.whatsapp_number || 'N/A'}"`,
        `"${app.status}"`,
        `"${formatDate(app.created_at)}"`,
        `"${app.reviewed_at ? formatDate(app.reviewed_at) : 'N/A'}"`,
        `"${app.reviewed_by || 'N/A'}"`,
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
    link.setAttribute('download', `sofi_applications_${statusFilter}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export Successful",
      description: `Exported ${filteredApplications.length} applications to CSV`,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-300">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100 border-red-300">Rejected</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-300">Pending</Badge>;
    }
  };

  const getStatusStats = () => {
    const pending = applications.filter(app => app.status === 'pending').length;
    const approved = applications.filter(app => app.status === 'approved').length;
    const rejected = applications.filter(app => app.status === 'rejected').length;
    return { pending, approved, rejected };
  };

  const statusStats = getStatusStats();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-6">
        {/* Header */}
        <div className="bg-card rounded-lg border shadow-sm p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={onBack} className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Application Management</h1>
                <p className="text-muted-foreground text-sm">Review and manage SoFI induction applications</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={fetchApplications} disabled={loading} size="sm" className="flex items-center gap-2">
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button variant="outline" onClick={exportToCSV} size="sm" className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export
              </Button>
              <Button variant="outline" onClick={onLogout} size="sm" className="flex items-center gap-2 text-red-600 hover:text-red-700">
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center gap-2 flex-1">
              <Search className="w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, BITS ID, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Applications</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total</CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{applications.length}</div>
              <p className="text-xs text-muted-foreground">Total applications</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-yellow-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statusStats.pending}</div>
              <p className="text-xs text-muted-foreground">Awaiting review</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Approved</CardTitle>
              <Check className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statusStats.approved}</div>
              <p className="text-xs text-muted-foreground">Successfully approved</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Rejected</CardTitle>
              <X className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statusStats.rejected}</div>
              <p className="text-xs text-muted-foreground">Not accepted</p>
            </CardContent>
          </Card>
        </div>

        {/* Applications Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Applications
                <Badge variant="secondary" className="ml-2">
                  {filteredApplications.length} {statusFilter !== 'all' ? `of ${applications.length}` : ''}
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <RefreshCw className="w-6 h-6 animate-spin text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">Loading applications...</span>
              </div>
            ) : filteredApplications.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  {searchQuery || statusFilter !== 'all' ? 'No matching applications' : 'No applications yet'}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {searchQuery || statusFilter !== 'all' 
                    ? 'Try adjusting your search or filter criteria.' 
                    : 'Applications will appear here once students start submitting them.'}
                </p>
              </div>
            ) : (
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30">
                      <TableHead className="font-semibold">Name</TableHead>
                      <TableHead className="font-semibold">BITS ID</TableHead>
                      <TableHead className="font-semibold">Email</TableHead>
                      <TableHead className="font-semibold">Mobile</TableHead>
                      <TableHead className="font-semibold">Submitted</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="font-semibold text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredApplications.map((application) => (
                      <TableRow key={application.id} className="hover:bg-muted/30 transition-colors">
                        <TableCell className="font-medium">{application.full_name}</TableCell>
                        <TableCell className="font-mono text-sm">{application.bits_id}</TableCell>
                        <TableCell className="text-sm">{application.email}</TableCell>
                        <TableCell className="text-sm">{application.mobile_number}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDate(application.created_at)}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(application.status)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => setSelectedApplication(application)}
                                  className="flex items-center gap-1 h-8"
                                >
                                  <Eye className="w-3 h-3" />
                                  View
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <DialogTitle className="text-xl">
                                        {application.full_name} - {application.bits_id}
                                      </DialogTitle>
                                      <DialogDescription>
                                        Submitted on {formatDate(application.created_at)}
                                        {application.reviewed_at && (
                                          <span className="ml-4">
                                            • Reviewed on {formatDate(application.reviewed_at)} by {application.reviewed_by}
                                          </span>
                                        )}
                                      </DialogDescription>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      {getStatusBadge(application.status)}
                                    </div>
                                  </div>
                                </DialogHeader>
                                
                                <Tabs defaultValue="personal" className="w-full">
                                  <TabsList className="grid w-full grid-cols-4">
                                    <TabsTrigger value="personal">Personal Info</TabsTrigger>
                                    <TabsTrigger value="basic">Basic Questions</TabsTrigger>
                                    <TabsTrigger value="case">Case Studies</TabsTrigger>
                                    <TabsTrigger value="sofi">About SoFI</TabsTrigger>
                                  </TabsList>
                                
                                  <TabsContent value="personal" className="space-y-4">
                                    <div className="grid grid-cols-2 gap-6">
                                      <div className="space-y-2">
                                        <label className="text-sm font-semibold text-foreground">Full Name</label>
                                        <p className="text-sm bg-muted/50 p-3 rounded-md">{application.full_name}</p>
                                      </div>
                                      <div className="space-y-2">
                                        <label className="text-sm font-semibold text-foreground">BITS ID</label>
                                        <p className="text-sm bg-muted/50 p-3 rounded-md font-mono">{application.bits_id}</p>
                                      </div>
                                      <div className="space-y-2">
                                        <label className="text-sm font-semibold text-foreground">Email Address</label>
                                        <p className="text-sm bg-muted/50 p-3 rounded-md">{application.email}</p>
                                      </div>
                                      <div className="space-y-2">
                                        <label className="text-sm font-semibold text-foreground">Mobile Number</label>
                                        <p className="text-sm bg-muted/50 p-3 rounded-md font-mono">{application.mobile_number}</p>
                                      </div>
                                      <div className="space-y-2">
                                        <label className="text-sm font-semibold text-foreground">WhatsApp Number</label>
                                        <p className="text-sm bg-muted/50 p-3 rounded-md font-mono">
                                          {application.whatsapp_number || 'Not provided'}
                                        </p>
                                      </div>
                                    </div>
                                  </TabsContent>
                                
                                  <TabsContent value="basic" className="space-y-6">
                                    <div className="space-y-6">
                                      <div>
                                        <label className="text-sm font-semibold text-foreground">Assets & Equity Question</label>
                                        <div className="text-sm mt-2 p-4 bg-muted/50 rounded-md border-l-4 border-l-blue-500">
                                          {application.assets_equity_answer}
                                        </div>
                                      </div>
                                      <div>
                                        <label className="text-sm font-semibold text-foreground">Financial Statements</label>
                                        <div className="text-sm mt-2 p-4 bg-muted/50 rounded-md border-l-4 border-l-blue-500">
                                          {application.financial_statements_answer}
                                        </div>
                                      </div>
                                      <div>
                                        <label className="text-sm font-semibold text-foreground">Net Worth</label>
                                        <div className="text-sm mt-2 p-4 bg-muted/50 rounded-md border-l-4 border-l-blue-500">
                                          {application.net_worth_answer}
                                        </div>
                                      </div>
                                      <div>
                                        <label className="text-sm font-semibold text-foreground">Balance Sheet vs Income Statement</label>
                                        <div className="text-sm mt-2 p-4 bg-muted/50 rounded-md border-l-4 border-l-blue-500">
                                          {application.balance_income_difference}
                                        </div>
                                      </div>
                                      <div>
                                        <label className="text-sm font-semibold text-foreground">P/E & P/B Ratio</label>
                                        <div className="text-sm mt-2 p-4 bg-muted/50 rounded-md border-l-4 border-l-blue-500">
                                          {application.pe_pb_ratio_answer}
                                        </div>
                                      </div>
                                    </div>
                                  </TabsContent>
                                
                                  <TabsContent value="case" className="space-y-6">
                                    <div className="space-y-6">
                                      <div>
                                        <label className="text-sm font-semibold text-foreground">Loan Transaction Analysis</label>
                                        <div className="text-sm mt-2 p-4 bg-muted/50 rounded-md border-l-4 border-l-green-500">
                                          {application.loan_transaction_answer}
                                        </div>
                                      </div>
                                      <div>
                                        <label className="text-sm font-semibold text-foreground">Life Annual Report</label>
                                        <div className="text-sm mt-2 p-4 bg-muted/50 rounded-md border-l-4 border-l-green-500">
                                          {application.life_annual_report_answer}
                                        </div>
                                      </div>
                                      <div>
                                        <label className="text-sm font-semibold text-foreground">Tinder Portfolio Creation</label>
                                        <div className="text-sm mt-2 p-4 bg-muted/50 rounded-md border-l-4 border-l-green-500">
                                          {application.tinder_portfolio_answer}
                                        </div>
                                      </div>
                                      <div>
                                        <label className="text-sm font-semibold text-foreground">Stock Market Explanation</label>
                                        <div className="text-sm mt-2 p-4 bg-muted/50 rounded-md border-l-4 border-l-green-500">
                                          {application.stock_market_explanation}
                                        </div>
                                      </div>
                                    </div>
                                  </TabsContent>
                                
                                  <TabsContent value="sofi" className="space-y-6">
                                    <div className="space-y-6">
                                      <div>
                                        <label className="text-sm font-semibold text-foreground">SoFI Platforms Knowledge</label>
                                        <div className="text-sm mt-2 p-4 bg-muted/50 rounded-md border-l-4 border-l-orange-500">
                                          {application.sofi_platforms_answer}
                                        </div>
                                      </div>
                                      <div>
                                        <label className="text-sm font-semibold text-foreground">Understanding of SoFI Purpose</label>
                                        <div className="text-sm mt-2 p-4 bg-muted/50 rounded-md border-l-4 border-l-orange-500">
                                          {application.sofi_purpose_answer}
                                        </div>
                                      </div>
                                    </div>
                                  </TabsContent>
                                  
                                  {/* Action Buttons */}
                                  {application.status === 'pending' && (
                                    <div className="flex justify-center gap-4 pt-6 border-t">
                                      <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                          <Button className="bg-green-600 hover:bg-green-700 text-white" disabled={processingId === application.id}>
                                            <Check className="w-4 h-4 mr-2" />
                                            Approve Application
                                          </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                          <AlertDialogHeader>
                                            <AlertDialogTitle>Approve Application</AlertDialogTitle>
                                            <AlertDialogDescription>
                                              Are you sure you want to approve {application.full_name}'s application? This action cannot be undone easily.
                                            </AlertDialogDescription>
                                          </AlertDialogHeader>
                                          <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction 
                                              onClick={() => updateApplicationStatus(application.id, 'approved')}
                                              className="bg-green-600 hover:bg-green-700"
                                            >
                                              Approve
                                            </AlertDialogAction>
                                          </AlertDialogFooter>
                                        </AlertDialogContent>
                                      </AlertDialog>

                                      <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                          <Button variant="destructive" disabled={processingId === application.id}>
                                            <X className="w-4 h-4 mr-2" />
                                            Reject Application
                                          </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                          <AlertDialogHeader>
                                            <AlertDialogTitle>Reject Application</AlertDialogTitle>
                                            <AlertDialogDescription>
                                              Are you sure you want to reject {application.full_name}'s application? This action cannot be undone easily.
                                            </AlertDialogDescription>
                                          </AlertDialogHeader>
                                          <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction 
                                              onClick={() => updateApplicationStatus(application.id, 'rejected')}
                                              className="bg-red-600 hover:bg-red-700"
                                            >
                                              Reject
                                            </AlertDialogAction>
                                          </AlertDialogFooter>
                                        </AlertDialogContent>
                                      </AlertDialog>
                                    </div>
                                  )}
                                </Tabs>
                              </DialogContent>
                            </Dialog>

                            {/* Quick Action Buttons */}
                            {application.status === 'pending' && (
                              <div className="flex gap-1">
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button 
                                      size="sm"
                                      className="bg-green-600 hover:bg-green-700 text-white h-8 px-2"
                                      disabled={processingId === application.id}
                                    >
                                      {processingId === application.id ? (
                                        <RefreshCw className="w-3 h-3 animate-spin" />
                                      ) : (
                                        <Check className="w-3 h-3" />
                                      )}
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Approve Application</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Approve {application.full_name}'s application?
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction 
                                        onClick={() => updateApplicationStatus(application.id, 'approved')}
                                        className="bg-green-600 hover:bg-green-700"
                                      >
                                        Approve
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>

                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button 
                                      size="sm"
                                      variant="destructive"
                                      className="h-8 px-2"
                                      disabled={processingId === application.id}
                                    >
                                      {processingId === application.id ? (
                                        <RefreshCw className="w-3 h-3 animate-spin" />
                                      ) : (
                                        <X className="w-3 h-3" />
                                      )}
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Reject Application</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Reject {application.full_name}'s application?
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction 
                                        onClick={() => updateApplicationStatus(application.id, 'rejected')}
                                        className="bg-red-600 hover:bg-red-700"
                                      >
                                        Reject
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
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

export default AdminPanel;