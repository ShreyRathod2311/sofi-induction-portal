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
          1. Company A acquires Company B for ₹500 Cr. Company B's book value is ₹300 Cr. How would you account for the ₹200 Cr difference on Company A's balance sheet? What are the implications for future financial statements? <span className="text-destructive">*</span>
        </Label>
        <Textarea
          value={data.loanTransactionAnswer}
          onChange={(e) => updateData({ loanTransactionAnswer: e.target.value })}
          placeholder="Discuss goodwill, intangible assets, impairment testing, and impact on income statement..."
          className="min-h-[140px] transition-smooth focus:shadow-glow"
        />
      </div>

      <div className="space-y-3">
        <Label className="text-base font-medium">
          2. A manufacturing company shows ₹100 Cr inventory at year-end. During the year, raw material costs increased by 40%, but the company's gross margin remained stable. What questions would you ask as an analyst, and what red flags might this scenario indicate? <span className="text-destructive">*</span>
        </Label>
        <Textarea
          value={data.lifeAnnualReportAnswer}
          onChange={(e) => updateData({ lifeAnnualReportAnswer: e.target.value })}
          placeholder="Consider inventory valuation methods, margin sustainability, pricing power, and potential accounting issues..."
          className="min-h-[140px] transition-smooth focus:shadow-glow"
        />
      </div>

      <div className="space-y-3">
        <Label className="text-base font-medium">
          3. A tech startup has negative operating cash flow but is raising capital at increasing valuations. The company reports increasing revenue but flat gross margins. Using financial statement analysis, how would you assess whether this is a viable business model or a bubble waiting to burst? <span className="text-destructive">*</span>
        </Label>
        <Textarea
          value={data.tinderPortfolioAnswer}
          onChange={(e) => updateData({ tinderPortfolioAnswer: e.target.value })}
          placeholder="Analyze burn rate, unit economics, customer acquisition costs, lifetime value, and path to profitability..."
          className="min-h-[160px] transition-smooth focus:shadow-glow"
        />
      </div>

      <div className="space-y-3">
        <Label className="text-base font-medium">
          4. Two retail companies have identical revenue (₹1000 Cr) and EBITDA (₹150 Cr), but Company X trades at 15x EBITDA while Company Y trades at 8x EBITDA. Using your knowledge of financial statements and valuation, what factors could justify this valuation gap? Provide at least three potential reasons. <span className="text-destructive">*</span>
        </Label>
        <Textarea
          value={data.stockMarketExplanation}
          onChange={(e) => updateData({ stockMarketExplanation: e.target.value })}
          placeholder="Consider growth rates, capital intensity, working capital efficiency, competitive moats, management quality, etc..."
          className="min-h-[160px] transition-smooth focus:shadow-glow"
        />
      </div>
    </div>
  );
};