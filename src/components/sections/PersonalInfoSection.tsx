import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormData } from "../InductionForm";

interface PersonalInfoSectionProps {
  data: FormData;
  updateData: (data: Partial<FormData>) => void;
  errors?: Record<string, string>;
}

export const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({
  data,
  updateData,
  errors = {}
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
            className={`transition-smooth focus:shadow-glow ${errors.fullName ? 'border-red-500' : ''}`}
          />
          {errors.fullName && (
            <p className="text-sm text-red-500 mt-1">{errors.fullName}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="bitsId" className="text-sm font-medium">
            BITS ID <span className="text-destructive">*</span>
          </Label>
          <Input
            id="bitsId"
            value={data.bitsId}
            onChange={(e) => updateData({ bitsId: e.target.value.toUpperCase() })}
            placeholder="e.g., 2023A7PS0000G"
            className={`transition-smooth focus:shadow-glow ${errors.bitsId ? 'border-red-500' : ''}`}
          />
          {errors.bitsId && (
            <p className="text-sm text-red-500 mt-1">{errors.bitsId}</p>
          )}
          <p className="text-xs text-muted-foreground">
            Format: YearCampusDisciplineBranchNumber[GHP]
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="mobileNumber" className="text-sm font-medium">
            Mobile Number <span className="text-destructive">*</span>
          </Label>
          <Input
            id="mobileNumber"
            type="tel"
            value={data.mobileNumber}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '').slice(0, 10);
              updateData({ mobileNumber: value });
            }}
            placeholder="9876543210"
            className={`transition-smooth focus:shadow-glow ${errors.mobileNumber ? 'border-red-500' : ''}`}
            maxLength={10}
          />
          {errors.mobileNumber && (
            <p className="text-sm text-red-500 mt-1">{errors.mobileNumber}</p>
          )}
          <p className="text-xs text-muted-foreground">
            Enter 10 digits without country code
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="whatsappNumber" className="text-sm font-medium">
            WhatsApp Number (if different)
          </Label>
          <Input
            id="whatsappNumber"
            type="tel"
            value={data.whatsappNumber}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '').slice(0, 10);
              updateData({ whatsappNumber: value });
            }}
            placeholder="9876543210"
            className="transition-smooth focus:shadow-glow"
            maxLength={10}
          />
          <p className="text-xs text-muted-foreground">
            Enter 10 digits without country code (optional)
          </p>
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
          className={`transition-smooth focus:shadow-glow ${errors.email ? 'border-red-500' : ''}`}
        />
        {errors.email && (
          <p className="text-sm text-red-500 mt-1">{errors.email}</p>
        )}
      </div>
    </div>
  );
};