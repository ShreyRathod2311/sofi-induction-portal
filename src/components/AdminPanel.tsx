import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Users, 
  CheckCircle2, 
  XCircle, 
  Clock,
  ArrowLeft, 
  LogOut, 
  Search, 
  Filter,
  Eye,
  Calendar,
  Mail,
  Phone,
  User,
  FileText,
  AlertCircle
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

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
  status: 'pending' | 'approved' | 'rejected' | 'waitlisted' | 'selected';
  created_at: string;
  updated_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
  admin_review: string | null;
}

interface AdminPanelProps {
  onBack: () => void;
  onLogout: () => void;
}

interface StatusChangeData {
  applicationId: string;
  newStatus: 'approved' | 'rejected' | 'waitlisted' | 'pending' | 'selected';
  adminName: string;
  adminReview: string;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onBack, onLogout }) => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [selectedApplicationIds, setSelectedApplicationIds] = useState<Set<string>>(new Set());
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [statusChangeData, setStatusChangeData] = useState<StatusChangeData>({
    applicationId: '',
    newStatus: 'approved',
    adminName: '',
    adminReview: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications((data || []).map(app => ({
        ...app,
        status: app.status as 'pending' | 'approved' | 'rejected' | 'waitlisted' | 'selected'
      })));
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast({
        title: "Error",
        description: "Failed to fetch applications",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (applicationId: string, newStatus: 'approved' | 'rejected' | 'waitlisted' | 'pending' | 'selected') => {
    setStatusChangeData({
      applicationId,
      newStatus: newStatus === 'pending' ? 'approved' : newStatus,
      adminName: '',
      adminReview: ''
    });
    setShowStatusDialog(true);
  };

  const toggleApplicationSelection = async (applicationId: string) => {
    const application = applications.find(app => app.id === applicationId);
    
    // If application is approved, change status to selected
    if (application && application.status === 'approved') {
      try {
        // Optimistically update local state first
        setApplications(prev => prev.map(app => 
          app.id === applicationId 
            ? { ...app, status: 'selected' as const, updated_at: new Date().toISOString() }
            : app
        ));

        const { error } = await supabase
          .from('applications')
          .update({ 
            status: 'selected',
            reviewed_by: application.reviewed_by || 'Admin',
            reviewed_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', applicationId);

        if (error) {
          console.error('Error updating application status:', error);
          // Revert optimistic update on error
          setApplications(prev => prev.map(app => 
            app.id === applicationId 
              ? { ...app, status: 'approved' as const }
              : app
          ));
          throw error;
        }

        toast({
          title: "Application Selected",
          description: `${application.full_name} has been moved to selected status`,
          variant: "default"
        });
      } catch (error) {
        console.error('Error updating application status:', error);
        toast({
          title: "Error",
          description: `Failed to update application status: ${error.message || 'Unknown error'}`,
          variant: "destructive"
        });
      }
    } else if (application && application.status === 'selected') {
      // If already selected, show a message
      toast({
        title: "Already Selected",
        description: `${application.full_name} is already in selected status`,
        variant: "default"
      });
    } else {
      // Regular selection toggle for non-approved applications
      const newSelected = new Set(selectedApplicationIds);
      if (newSelected.has(applicationId)) {
        newSelected.delete(applicationId);
      } else {
        newSelected.add(applicationId);
      }
      setSelectedApplicationIds(newSelected);
    }
  };

  const confirmStatusChange = async () => {
    if (!statusChangeData.adminName.trim()) {
      toast({
        title: "Admin Name Required",
        description: "Please enter your name before proceeding",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('applications')
        .update({
          status: statusChangeData.newStatus,
          reviewed_at: new Date().toISOString(),
          reviewed_by: statusChangeData.adminName.trim(),
          admin_review: statusChangeData.adminReview.trim() || null
        })
        .eq('id', statusChangeData.applicationId);

      if (error) throw error;

      toast({
        title: "Status Updated",
        description: `Application has been ${statusChangeData.newStatus}`,
      });

      setShowStatusDialog(false);
      setStatusChangeData({
        applicationId: '',
        newStatus: 'approved',
        adminName: '',
        adminReview: ''
      });
      fetchApplications();
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update application status",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Approved</Badge>;
      case 'selected':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Selected</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Rejected</Badge>;
      case 'waitlisted':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Waitlisted</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.bits_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: applications.length,
    pending: applications.filter(app => app.status === 'pending').length,
    approved: applications.filter(app => app.status === 'approved').length,
    selected: applications.filter(app => app.status === 'selected').length,
    rejected: applications.filter(app => app.status === 'rejected').length,
    waitlisted: applications.filter(app => app.status === 'waitlisted').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gradient mb-2">Admin Panel</h1>
            <p className="text-muted-foreground">Manage SoFI induction applications</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
            <Button variant="outline" onClick={onLogout} className="flex items-center gap-2">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8">
          <Card className="shadow-elegant border-0 bg-background/80">
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-sm text-muted-foreground">Total Applications</div>
            </CardContent>
          </Card>
          
          <Card className="shadow-elegant border-0 bg-background/80">
            <CardContent className="p-6 text-center">
              <Clock className="w-8 h-8 mx-auto mb-2 text-blue-500" />
              <div className="text-2xl font-bold">{stats.pending}</div>
              <div className="text-sm text-muted-foreground">Pending</div>
            </CardContent>
          </Card>

          <Card className="shadow-elegant border-0 bg-background/80">
            <CardContent className="p-6 text-center">
              <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-green-500" />
              <div className="text-2xl font-bold">{stats.approved}</div>
              <div className="text-sm text-muted-foreground">Approved</div>
            </CardContent>
          </Card>

          <Card className="shadow-elegant border-0 bg-background/80">
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold">{stats.selected}</div>
              <div className="text-sm text-muted-foreground">Selected</div>
            </CardContent>
          </Card>

          <Card className="shadow-elegant border-0 bg-background/80">
            <CardContent className="p-6 text-center">
              <AlertCircle className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
              <div className="text-2xl font-bold">{stats.waitlisted}</div>
              <div className="text-sm text-muted-foreground">Waitlisted</div>
            </CardContent>
          </Card>

          <Card className="shadow-elegant border-0 bg-background/80">
            <CardContent className="p-6 text-center">
              <XCircle className="w-8 h-8 mx-auto mb-2 text-red-500" />
              <div className="text-2xl font-bold">{stats.rejected}</div>
              <div className="text-sm text-muted-foreground">Rejected</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="shadow-elegant border-0 bg-background/80 mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="search" className="text-sm font-medium mb-2 block">
                  Search Applications
                </Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search by name, BITS ID, or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="md:w-48">
                <Label htmlFor="status-filter" className="text-sm font-medium mb-2 block">
                  Filter by Status
                </Label>
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <select
                    id="status-filter"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="selected">Selected</option>
                    <option value="waitlisted">Waitlisted</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Applications Table */}
        <Card className="shadow-elegant border-0 bg-background/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Applications ({filteredApplications.length})
            </CardTitle>
            <CardDescription>
              Review and manage induction applications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Applicant</TableHead>
                    <TableHead>BITS ID</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Reviewed By</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApplications.map((application) => (
                    <TableRow 
                      key={application.id} 
                      className={`hover:bg-muted/50 cursor-pointer ${
                        application.status === 'approved' 
                          ? 'hover:bg-blue-50 border border-blue-200' 
                          : application.status === 'selected'
                          ? 'bg-blue-50 border-l-4 border-l-blue-500'
                          : selectedApplicationIds.has(application.id) 
                          ? 'bg-gray-50 border-l-4 border-l-gray-500' 
                          : ''
                      }`}
                      onClick={() => toggleApplicationSelection(application.id)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold">
                            {application.full_name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium">{application.full_name}</div>
                            <div className="text-sm text-muted-foreground">{application.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <code className="bg-muted px-2 py-1 rounded text-sm">
                          {application.bits_id}
                        </code>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="flex items-center gap-1 mb-1">
                            <Phone className="w-3 h-3" />
                            {application.mobile_number}
                          </div>
                          {application.whatsapp_number && (
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Mail className="w-3 h-3" />
                              {application.whatsapp_number}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(application.status)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="w-3 h-3" />
                          {format(new Date(application.created_at), 'MMM dd, yyyy')}
                        </div>
                      </TableCell>
                      <TableCell>
                        {application.reviewed_by ? (
                          <div className="text-sm">
                            <div className="font-medium">{application.reviewed_by}</div>
                            {application.reviewed_at && (
                              <div className="text-muted-foreground">
                                {format(new Date(application.reviewed_at), 'MMM dd, yyyy')}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">Not reviewed</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedApplication(application);
                            }}
                            className="flex items-center gap-1"
                          >
                            <Eye className="w-3 h-3" />
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                             handleStatusChange(application.id, 'selected');
                            }}
                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                           disabled={application.status === 'selected'}
                          >
                            <CheckCircle2 className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStatusChange(application.id, 'waitlisted');
                            }}
                            className="text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
                            disabled={application.status === 'waitlisted'}
                          >
                            <AlertCircle className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStatusChange(application.id, 'rejected');
                            }}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            disabled={application.status === 'rejected'}
                          >
                            <XCircle className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStatusChange(application.id, 'pending');
                            }}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            disabled={application.status === 'pending'}
                          >
                            <Clock className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Application Details Dialog */}
      <Dialog open={!!selectedApplication} onOpenChange={() => setSelectedApplication(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              {selectedApplication?.full_name}
            </DialogTitle>
            <DialogDescription>
              Application submitted on {selectedApplication && format(new Date(selectedApplication.created_at), 'MMMM dd, yyyy')}
            </DialogDescription>
          </DialogHeader>
          
          {selectedApplication && (
            <ScrollArea className="max-h-[70vh] pr-4">
              <Tabs defaultValue="personal" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="personal">Personal Info</TabsTrigger>
                  <TabsTrigger value="basic">Basic Questions</TabsTrigger>
                  <TabsTrigger value="case">Case Studies</TabsTrigger>
                  <TabsTrigger value="sofi">About SoFI</TabsTrigger>
                </TabsList>

                <TabsContent value="personal" className="space-y-4 mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Full Name</Label>
                      <p className="text-base">{selectedApplication.full_name}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">BITS ID</Label>
                      <p className="text-base font-mono">{selectedApplication.bits_id}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Mobile Number</Label>
                      <p className="text-base">{selectedApplication.mobile_number}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">WhatsApp Number</Label>
                      <p className="text-base">{selectedApplication.whatsapp_number || 'Same as mobile'}</p>
                    </div>
                    <div className="md:col-span-2">
                      <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                      <p className="text-base">{selectedApplication.email}</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="basic" className="space-y-6 mt-6">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Assets & Equity Question</Label>
                    <p className="text-base mt-1 p-3 bg-muted/50 rounded-md">{selectedApplication.assets_equity_answer}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Financial Statements</Label>
                    <p className="text-base mt-1 p-3 bg-muted/50 rounded-md">{selectedApplication.financial_statements_answer}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Net Worth</Label>
                    <p className="text-base mt-1 p-3 bg-muted/50 rounded-md">{selectedApplication.net_worth_answer}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Balance Sheet vs Income Statement</Label>
                    <p className="text-base mt-1 p-3 bg-muted/50 rounded-md">{selectedApplication.balance_income_difference}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">P/E and P/B Ratio</Label>
                    <p className="text-base mt-1 p-3 bg-muted/50 rounded-md">{selectedApplication.pe_pb_ratio_answer}</p>
                  </div>
                </TabsContent>

                <TabsContent value="case" className="space-y-6 mt-6">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Loan Transaction</Label>
                    <p className="text-base mt-1 p-3 bg-muted/50 rounded-md">{selectedApplication.loan_transaction_answer}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Life Annual Report</Label>
                    <p className="text-base mt-1 p-3 bg-muted/50 rounded-md">{selectedApplication.life_annual_report_answer}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Tinder Portfolio</Label>
                    <p className="text-base mt-1 p-3 bg-muted/50 rounded-md">{selectedApplication.tinder_portfolio_answer}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Stock Market Explanation</Label>
                    <p className="text-base mt-1 p-3 bg-muted/50 rounded-md">{selectedApplication.stock_market_explanation}</p>
                  </div>
                </TabsContent>

                <TabsContent value="sofi" className="space-y-6 mt-6">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">SoFI Platforms</Label>
                    <p className="text-base mt-1 p-3 bg-muted/50 rounded-md">{selectedApplication.sofi_platforms_answer}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">SoFI Purpose</Label>
                    <p className="text-base mt-1 p-3 bg-muted/50 rounded-md">{selectedApplication.sofi_purpose_answer}</p>
                  </div>
                  {selectedApplication.admin_review && (
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Admin Review</Label>
                      <p className="text-base mt-1 p-3 bg-primary/10 rounded-md border border-primary/20">{selectedApplication.admin_review}</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>

              {/* Action Buttons in Dialog */}
              {selectedApplication?.status === 'pending' && (
                <div className="flex gap-3 mt-8 pt-6 border-t">
                  <Button
                    onClick={() => handleStatusChange(selectedApplication.id, 'approved')}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Approve
                  </Button>
                  <Button
                    onClick={() => handleStatusChange(selectedApplication.id, 'waitlisted')}
                    className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white"
                  >
                    <AlertCircle className="w-4 h-4" />
                    Waitlist
                  </Button>
                  <Button
                    onClick={() => handleStatusChange(selectedApplication.id, 'rejected')}
                    variant="destructive"
                    className="flex items-center gap-2"
                  >
                    <XCircle className="w-4 h-4" />
                    Reject
                  </Button>
                </div>
              )}
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>

      {/* Status Change Confirmation Dialog */}
      <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {statusChangeData.newStatus === 'approved' && <CheckCircle2 className="w-5 h-5 text-green-600" />}
              {statusChangeData.newStatus === 'waitlisted' && <AlertCircle className="w-5 h-5 text-yellow-600" />}
              {statusChangeData.newStatus === 'rejected' && <XCircle className="w-5 h-5 text-red-600" />}
              Confirm {statusChangeData.newStatus === 'approved' ? 'Approval' : statusChangeData.newStatus === 'waitlisted' ? 'Waitlist' : 'Rejection'}
            </DialogTitle>
            <DialogDescription>
              Please enter your name and an optional review before {statusChangeData.newStatus === 'approved' ? 'approving' : statusChangeData.newStatus === 'waitlisted' ? 'waitlisting' : 'rejecting'} this application.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="admin-name" className="text-sm font-medium">
                Your Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="admin-name"
                value={statusChangeData.adminName}
                onChange={(e) => setStatusChangeData(prev => ({ ...prev, adminName: e.target.value }))}
                placeholder="Enter your name"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="admin-review" className="text-sm font-medium">
                Review Comments (Optional)
              </Label>
              <Textarea
                id="admin-review"
                value={statusChangeData.adminReview}
                onChange={(e) => setStatusChangeData(prev => ({ ...prev, adminReview: e.target.value }))}
                placeholder="Add any comments about this application..."
                className="mt-1 min-h-[100px]"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <Button
              variant="outline"
              onClick={() => setShowStatusDialog(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmStatusChange}
              disabled={!statusChangeData.adminName.trim()}
              className={`flex-1 ${
                statusChangeData.newStatus === 'approved' 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : statusChangeData.newStatus === 'waitlisted'
                  ? 'bg-yellow-600 hover:bg-yellow-700'
                  : 'bg-red-600 hover:bg-red-700'
              } text-white`}
            >
              Confirm {statusChangeData.newStatus === 'approved' ? 'Approval' : statusChangeData.newStatus === 'waitlisted' ? 'Waitlist' : 'Rejection'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};