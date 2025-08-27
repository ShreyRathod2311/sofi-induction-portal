import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormData } from "../InductionForm";

interface PersonalInfoSectionProps {
  data: FormData;
  updateData: (data: Partial<FormData>) => void;
}

export const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({
  data,
  updateData
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="fullName" className="text-sm font-medium">
            Full Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="fullName"
            value={data.fullName}
            onChange={(e) => updateData({ fullName: e.target.value })}
            placeholder="Enter your full name"
            className="transition-smooth focus:shadow-glow"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bitsId" className="text-sm font-medium">
            BITS ID <span className="text-destructive">*</span>
          </Label>
          <Input
            id="bitsId"
            value={data.bitsId}
            onChange={(e) => updateData({ bitsId: e.target.value })}
            placeholder="e.g., 2023A7PS0000G"
            className="transition-smooth focus:shadow-glow"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="mobileNumber" className="text-sm font-medium">
            Mobile Number <span className="text-destructive">*</span>
          </Label>
          <Input
            id="mobileNumber"
            type="tel"
            value={data.mobileNumber}
            onChange={(e) => updateData({ mobileNumber: e.target.value })}
            placeholder="+91 98765 43210"
            className="transition-smooth focus:shadow-glow"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="whatsappNumber" className="text-sm font-medium">
            WhatsApp Number (if different)
          </Label>
          <Input
            id="whatsappNumber"
            type="tel"
            value={data.whatsappNumber}
            onChange={(e) => updateData({ whatsappNumber: e.target.value })}
            placeholder="+91 98765 43210"
            className="transition-smooth focus:shadow-glow"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium">
          Email ID <span className="text-destructive">*</span>
        </Label>
        <Input
          id="email"
          type="email"
          value={data.email}
          onChange={(e) => updateData({ email: e.target.value })}
          placeholder="your.email@example.com"
          className="transition-smooth focus:shadow-glow"
        />
      </div>
    </div>
  );
};