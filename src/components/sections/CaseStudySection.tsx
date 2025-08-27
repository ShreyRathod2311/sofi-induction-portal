import React from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FormData } from "../InductionForm";

interface CaseStudySectionProps {
  data: FormData;
  updateData: (data: Partial<FormData>) => void;
}

export const CaseStudySection: React.FC<CaseStudySectionProps> = ({
  data,
  updateData
}) => {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <Label className="text-base font-medium">
          1. Imagine you lend ₹1000 to your friend. In finance terms, what would this transaction affect and which report/s might be affected? <span className="text-destructive">*</span>
        </Label>
        <Textarea
          value={data.loanTransactionAnswer}
          onChange={(e) => updateData({ loanTransactionAnswer: e.target.value })}
          placeholder="Think about the impact on your balance sheet..."
          className="min-h-[120px] transition-smooth focus:shadow-glow"
        />
      </div>

      <div className="space-y-3">
        <Label className="text-base font-medium">
          2. Let's say your life had an annual report — what would be your biggest "asset," your biggest "liability," and your funniest "expense"? <span className="text-destructive">*</span>
        </Label>
        <Textarea
          value={data.lifeAnnualReportAnswer}
          onChange={(e) => updateData({ lifeAnnualReportAnswer: e.target.value })}
          placeholder="Be creative and have fun with this one!"
          className="min-h-[120px] transition-smooth focus:shadow-glow"
        />
      </div>

      <div className="space-y-3">
        <Label className="text-base font-medium">
          3. If Tinder profiles were stocks, how would you pick your portfolio? <span className="text-destructive">*</span>
        </Label>
        <Textarea
          value={data.tinderPortfolioAnswer}
          onChange={(e) => updateData({ tinderPortfolioAnswer: e.target.value })}
          placeholder="Apply your investment strategy to dating!"
          className="min-h-[120px] transition-smooth focus:shadow-glow"
        />
      </div>

      <div className="space-y-3">
        <Label className="text-base font-medium">
          4. If you were to ever meet a stranger completely unaware of Finance, how will you explain the Indian Stock Market to them and why companies participate in it? <span className="text-destructive">*</span>
        </Label>
        <Textarea
          value={data.stockMarketExplanation}
          onChange={(e) => updateData({ stockMarketExplanation: e.target.value })}
          placeholder="Keep it simple and relatable..."
          className="min-h-[140px] transition-smooth focus:shadow-glow"
        />
      </div>
    </div>
  );
};