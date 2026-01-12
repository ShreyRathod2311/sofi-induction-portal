import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, CheckCircle2, PartyPopper } from "lucide-react";
import { PersonalInfoSection } from "./sections/PersonalInfoSection";
import { BasicQuestionsSection } from "./sections/BasicQuestionsSection";
import { CaseStudySection } from "./sections/CaseStudySection";
import { AboutSoFISection } from "./sections/AboutSoFISection";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface FormData {
  // Personal Information
  fullName: string;
  bitsId: string;
  mobileNumber: string;
  whatsappNumber: string;
  email: string;
  
  // Basic Questions
  assetsEquityAnswer: string;
  financialStatementsAnswer: string;
  netWorthAnswer: string;
  balanceIncomeAnswer: string;
  pePbRatioAnswer: string;
  
  // Case Study
  loanTransactionAnswer: string;
  lifeAnnualReportAnswer: string;
  tinderPortfolioAnswer: string;
  stockMarketExplanation: string;
  
  // About SoFI
  sofiPlatformsAnswer: string;
  sofiPurposeAnswer: string;
}

const initialFormData: FormData = {
  fullName: '',
  bitsId: '',
  mobileNumber: '',
  whatsappNumber: '',
  email: '',
  assetsEquityAnswer: '',
  financialStatementsAnswer: '',
  netWorthAnswer: '',
  balanceIncomeAnswer: '',
  pePbRatioAnswer: '',
  loanTransactionAnswer: '',
  lifeAnnualReportAnswer: '',
  tinderPortfolioAnswer: '',
  stockMarketExplanation: '',
  sofiPlatformsAnswer: '',
  sofiPurposeAnswer: ''
};

const sections = [
  { title: "Personal Information", description: "Let's start with your basic details" },
  { title: "Basic Questions", description: "Answer the following to test your fundamentals" },
  { title: "Case Study", description: "Apply your knowledge to these fun case studies" },
  { title: "About SoFI", description: "Check your awareness of the society" }
];

export const InductionForm = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const updateFormData = (data: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
    // Clear validation errors when data is updated
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      Object.keys(data).forEach(key => {
        delete newErrors[key];
      });
      return newErrors;
    });
  };

  const validateBitsId = (bitsId: string): boolean => {
  const bitsIdRegex = /^\d{4}(PH|[ABCDHJ](A|B|C|D|J|[0-9]))(PS|TS|PX|RM|IS|IO|UB|CS|MM|MMPS|MM([ABHCDJ]|[0-9])(A|B|C|D|J|[0-9]))\d{4}[GHP]$/;
  return bitsIdRegex.test(bitsId);
};

  const validatePhoneNumber = (phone: string): boolean => {
    // Ensure exactly 10 digits, no more, no less
    return phone.length === 10 && /^\d{10}$/.test(phone);
  };

  const checkExistingBitsId = async (bitsId: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('bits_id')
        .eq('bits_id', bitsId)
        .maybeSingle();
      
      if (error) {
        console.error('Error checking BITS ID:', error);
        return false;
      }
      
      return !!data; // Returns true if BITS ID exists
    } catch (error) {
      console.error('Error checking BITS ID:', error);
      return false;
    }
  };

  const validateSection = async (section: number): Promise<boolean> => {
    const errors: Record<string, string> = {};
    
    switch (section) {
      case 0:
        if (!formData.fullName) errors.fullName = "Full name is required";
        if (!formData.bitsId) {
          errors.bitsId = "BITS ID is required";
        } else if (!validateBitsId(formData.bitsId)) {
          errors.bitsId = "Invalid BITS ID format";
        } else {
          const exists = await checkExistingBitsId(formData.bitsId);
          if (exists) {
            errors.bitsId = "This BITS ID has already been used for an application";
          }
        }
        if (!formData.mobileNumber) {
          errors.mobileNumber = "Mobile number is required";
        } else if (!validatePhoneNumber(formData.mobileNumber)) {
          errors.mobileNumber = "Mobile number must be exactly 10 digits";
        }
        if (!formData.email) errors.email = "Email is required";
        
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
        
      case 1:
        return !!(formData.assetsEquityAnswer && formData.financialStatementsAnswer && 
                 formData.netWorthAnswer && formData.balanceIncomeAnswer && formData.pePbRatioAnswer);
      case 2:
        return !!(formData.loanTransactionAnswer && formData.lifeAnnualReportAnswer && 
                 formData.tinderPortfolioAnswer && formData.stockMarketExplanation);
      case 3:
        return !!(formData.sofiPlatformsAnswer && formData.sofiPurposeAnswer);
      default:
        return false;
    }
  };

  const handleNext = async () => {
    const isValid = await validateSection(currentSection);
    if (isValid) {
      setCurrentSection(prev => Math.min(prev + 1, sections.length - 1));
    } else {
      toast({
        title: "Validation Error",
        description: "Please fix the errors before proceeding.",
        variant: "destructive"
      });
    }
  };

  const handlePrevious = () => {
    setCurrentSection(prev => Math.max(prev - 1, 0));
  };

  const handleSubmit = async () => {
    const isValid = await validateSection(3);
    if (!isValid) {
      toast({
        title: "Incomplete Form",
        description: "Please fill in all required fields before submitting.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('applications').insert({
        full_name: formData.fullName,
        bits_id: formData.bitsId,
        mobile_number: formData.mobileNumber,
        whatsapp_number: formData.whatsappNumber || null,
        email: formData.email,
        assets_equity_answer: formData.assetsEquityAnswer,
        financial_statements_answer: formData.financialStatementsAnswer,
        net_worth_answer: formData.netWorthAnswer,
        balance_income_difference: formData.balanceIncomeAnswer,
        pe_pb_ratio_answer: formData.pePbRatioAnswer,
        loan_transaction_answer: formData.loanTransactionAnswer,
        life_annual_report_answer: formData.lifeAnnualReportAnswer,
        tinder_portfolio_answer: formData.tinderPortfolioAnswer,
        stock_market_explanation: formData.stockMarketExplanation,
        sofi_platforms_answer: formData.sofiPlatformsAnswer,
        sofi_purpose_answer: formData.sofiPurposeAnswer
      });

      if (error) throw error;

      // Show success dialog
      setShowSuccessDialog(true);

      // Reset form
      setFormData(initialFormData);
      setCurrentSection(0);
      setValidationErrors({});
    } catch (error) {
      console.error('Submission error:', error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderSection = () => {
    switch (currentSection) {
      case 0:
        return <PersonalInfoSection data={formData} updateData={updateFormData} errors={validationErrors} />;
      case 1:
        return <BasicQuestionsSection data={formData} updateData={updateFormData} />;
      case 2:
        return <CaseStudySection data={formData} updateData={updateFormData} />;
      case 3:
        return <AboutSoFISection data={formData} updateData={updateFormData} />;
      default:
        return null;
    }
  };

  const progress = ((currentSection + 1) / sections.length) * 100;

  return (
    <>
      <div className="max-w-4xl mx-auto p-6">
        <Card className="shadow-elegant border-0 bg-gradient-subtle">
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-3xl font-bold text-gradient mb-2">
              SoFI Induction Application
            </CardTitle>
            <CardDescription className="text-lg">
              {sections[currentSection].description}
            </CardDescription>
            
            <div className="mt-6">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-medium">
                  Section {currentSection + 1} of {sections.length}
                </span>
                <span className="text-sm text-muted-foreground">
                  {Math.round(progress)}% Complete
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            <div className="flex justify-center mt-4 space-x-2">
              {sections.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-smooth ${
                    index < currentSection
                      ? 'bg-primary'
                      : index === currentSection
                      ? 'bg-primary/60'
                      : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                {currentSection < 3 && (
                  <CheckCircle2 
                    className={`w-6 h-6 ${
                      Object.keys(validationErrors).length === 0 ? 'text-primary' : 'text-muted-foreground'
                    }`} 
                  />
                )}
                {sections[currentSection].title}
              </h2>
              {renderSection()}
            </div>

            <div className="flex justify-between items-center pt-6 border-t">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentSection === 0}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>

              {currentSection < sections.length - 1 ? (
                <Button
                  onClick={handleNext}
                  className="flex items-center gap-2 bg-gradient-primary hover:shadow-glow transition-smooth"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={Object.keys(validationErrors).length > 0 || isSubmitting}
                  className="flex items-center gap-2 bg-gradient-primary hover:shadow-glow transition-smooth"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                  <CheckCircle2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <PartyPopper className="w-8 h-8 text-green-600" />
            </div>
            <DialogTitle className="text-2xl font-bold text-green-700">
              Application Submitted!
            </DialogTitle>
            <DialogDescription className="text-center mt-4 text-base">
              Thanks for applying to SoFI! We will update you soon with further details of your application.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center mt-6">
            <Button 
              onClick={() => setShowSuccessDialog(false)}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
