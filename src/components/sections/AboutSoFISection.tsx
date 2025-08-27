import React from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FormData } from "../InductionForm";

interface AboutSoFISectionProps {
  data: FormData;
  updateData: (data: Partial<FormData>) => void;
}

export const AboutSoFISection: React.FC<AboutSoFISectionProps> = ({
  data,
  updateData
}) => {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <Label className="text-base font-medium">
          1. What are the major platforms SoFI is active on? Do you follow them? If not, please follow them before Interview 😉 <span className="text-destructive">*</span>
        </Label>
        <Textarea
          value={data.sofiPlatformsAnswer}
          onChange={(e) => updateData({ sofiPlatformsAnswer: e.target.value })}
          placeholder="List the platforms and let us know if you follow them..."
          className="min-h-[120px] transition-smooth focus:shadow-glow"
        />
      </div>

      <div className="space-y-3">
        <Label className="text-base font-medium">
          2. What according to you does SoFI do? <span className="text-destructive">*</span>
        </Label>
        <Textarea
          value={data.sofiPurposeAnswer}
          onChange={(e) => updateData({ sofiPurposeAnswer: e.target.value })}
          placeholder="Share your understanding of SoFI's purpose and activities..."
          className="min-h-[120px] transition-smooth focus:shadow-glow"
        />
      </div>
    </div>
  );
};