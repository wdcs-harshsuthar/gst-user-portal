import React from 'react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface PropertyValuationProps {
  data: {
    declaredValue: string;
    taxRate: string;
    annualTaxAmount: string;
  };
  onChange: (field: string, value: any) => void;
  errors: Record<string, string>;
}

export default function PropertyValuation({ data, onChange, errors }: PropertyValuationProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="space-y-2">
        <Label htmlFor="declaredValue">Declared Value ($) *</Label>
        <Input
          id="declaredValue"
          type="number"
          step="0.01"
          value={data.declaredValue}
          onChange={(e) => onChange('declaredValue', e.target.value)}
          placeholder="0.00"
          className={errors.declaredValue ? 'border-red-500' : ''}
        />
        {errors.declaredValue && <p className="text-red-500 text-sm">{errors.declaredValue}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="taxRate">Tax Rate (%)</Label>
        <Input
          id="taxRate"
          value={data.taxRate}
          readOnly
          className="bg-gray-50"
        />
        <p className="text-sm text-muted-foreground">Fixed rate by law</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="annualTaxAmount">Annual Tax Amount ($)</Label>
        <Input
          id="annualTaxAmount"
          value={data.annualTaxAmount}
          readOnly
          className="bg-gray-50"
        />
      </div>
    </div>
  );
}