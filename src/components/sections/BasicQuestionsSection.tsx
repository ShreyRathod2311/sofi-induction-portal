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
          1. A company reports ₹10 Cr depreciation expense. How does this impact each of the three financial statements? Explain the flow. <span className="text-destructive">*</span>
        </Label>
        <Textarea
          value={data.assetsEquityAnswer}
          onChange={(e) => updateData({ assetsEquityAnswer: e.target.value })}
          placeholder="Explain the impact on Income Statement, Balance Sheet, and Cash Flow Statement..."
          className="min-h-[120px] transition-smooth focus:shadow-glow"
        />
      </div>

      <div className="space-y-3">
        <Label className="text-base font-medium">
          2. If a company's Cash Flow from Operations is consistently higher than Net Income, what does this indicate about the company's earnings quality and working capital management? <span className="text-destructive">*</span>
        </Label>
        <Textarea
          value={data.financialStatementsAnswer}
          onChange={(e) => updateData({ financialStatementsAnswer: e.target.value })}
          placeholder="Discuss earnings quality, working capital efficiency, and what this trend suggests..."
          className="min-h-[140px] transition-smooth focus:shadow-glow"
        />
      </div>

      <div className="space-y-3">
        <Label className="text-base font-medium">
          3. A company's current ratio is 2.5 and quick ratio is 0.8. What does this tell you about the company's liquidity position and inventory levels? Should this be a concern? <span className="text-destructive">*</span>
        </Label>
        <Textarea
          value={data.netWorthAnswer}
          onChange={(e) => updateData({ netWorthAnswer: e.target.value })}
          placeholder="Analyze the liquidity metrics and explain potential red flags..."
          className="min-h-[120px] transition-smooth focus:shadow-glow"
        />
      </div>

      <div className="space-y-3">
        <Label className="text-base font-medium">
          4. Explain how a company can have positive net income but negative cash flow from operations. Provide two specific scenarios where this would occur. <span className="text-destructive">*</span>
        </Label>
        <Textarea
          value={data.balanceIncomeAnswer}
          onChange={(e) => updateData({ balanceIncomeAnswer: e.target.value })}
          placeholder="Describe scenarios with specific examples (e.g., receivables, inventory, etc.)..."
          className="min-h-[140px] transition-smooth focus:shadow-glow"
        />
      </div>

      <div className="space-y-3">
        <Label className="text-base font-medium">
          5. If a company's Debt-to-Equity ratio increases from 0.5 to 1.2 over two years while Return on Equity (ROE) increases from 12% to 18%, what does this suggest about the company's leverage strategy and financial risk? <span className="text-destructive">*</span>
        </Label>
        <Textarea
          value={data.pePbRatioAnswer}
          onChange={(e) => updateData({ pePbRatioAnswer: e.target.value })}
          placeholder="Analyze the relationship between leverage, ROE, and financial risk..."
          className="min-h-[140px] transition-smooth focus:shadow-glow"
        />
      </div>
    </div>
  );
};