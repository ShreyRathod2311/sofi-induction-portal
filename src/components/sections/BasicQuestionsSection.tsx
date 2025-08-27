import React from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FormData } from "../InductionForm";

interface BasicQuestionsSectionProps {
  data: FormData;
  updateData: (data: Partial<FormData>) => void;
}

export const BasicQuestionsSection: React.FC<BasicQuestionsSectionProps> = ({
  data,
  updateData
}) => {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <Label className="text-base font-medium">
          1. If a company has Assets worth ₹50,000 and Liabilities worth ₹35,000, what is its Equity? <span className="text-destructive">*</span>
        </Label>
        <Textarea
          value={data.assetsEquityAnswer}
          onChange={(e) => updateData({ assetsEquityAnswer: e.target.value })}
          placeholder="Enter your answer here..."
          className="min-h-[100px] transition-smooth focus:shadow-glow"
        />
      </div>

      <div className="space-y-3">
        <Label className="text-base font-medium">
          2. Define the three major financial statements <span className="text-destructive">*</span>
        </Label>
        <Textarea
          value={data.financialStatementsAnswer}
          onChange={(e) => updateData({ financialStatementsAnswer: e.target.value })}
          placeholder="Enter your answer here..."
          className="min-h-[120px] transition-smooth focus:shadow-glow"
        />
      </div>

      <div className="space-y-3">
        <Label className="text-base font-medium">
          3. Define net worth in your own words <span className="text-destructive">*</span>
        </Label>
        <Textarea
          value={data.netWorthAnswer}
          onChange={(e) => updateData({ netWorthAnswer: e.target.value })}
          placeholder="Enter your answer here..."
          className="min-h-[100px] transition-smooth focus:shadow-glow"
        />
      </div>

      <div className="space-y-3">
        <Label className="text-base font-medium">
          4. How is the balance sheet different from the Income Statement in terms of what they reveal about the company? <span className="text-destructive">*</span>
        </Label>
        <Textarea
          value={data.balanceIncomeAnswer}
          onChange={(e) => updateData({ balanceIncomeAnswer: e.target.value })}
          placeholder="Enter your answer here..."
          className="min-h-[120px] transition-smooth focus:shadow-glow"
        />
      </div>

      <div className="space-y-3">
        <Label className="text-base font-medium">
          5. What is P/E and P/B ratio? <span className="text-destructive">*</span>
        </Label>
        <Textarea
          value={data.pePbRatioAnswer}
          onChange={(e) => updateData({ pePbRatioAnswer: e.target.value })}
          placeholder="Enter your answer here..."
          className="min-h-[120px] transition-smooth focus:shadow-glow"
        />
      </div>
    </div>
  );
};