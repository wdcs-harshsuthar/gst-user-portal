import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Alert, AlertDescription } from '../../ui/alert';
import { DollarSign, AlertCircle } from 'lucide-react';

interface FeeSettingsProps {
  settings: any;
  updateSetting: (key: string, value: any) => void;
}

export default function FeeSettings({ settings, updateSetting }: FeeSettingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Fee Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="individualFee">Individual Registration Fee ($)</Label>
            <Input
              id="individualFee"
              type="number"
              step="0.01"
              value={settings.individualFee}
              onChange={(e) => updateSetting('individualFee', parseFloat(e.target.value))}
            />
            <p className="text-xs text-gray-500">Base fee for individual GST registration</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="businessFee">Business Registration Fee ($)</Label>
            <Input
              id="businessFee"
              type="number"
              step="0.01"
              value={settings.businessFee}
              onChange={(e) => updateSetting('businessFee', parseFloat(e.target.value))}
            />
            <p className="text-xs text-gray-500">Base fee for business GST registration</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="soleProprietorshipFee">Sole Proprietorship Fee ($)</Label>
            <Input
              id="soleProprietorshipFee"
              type="number"
              step="0.01"
              value={settings.soleProprietorshipFee}
              onChange={(e) => updateSetting('soleProprietorshipFee', parseFloat(e.target.value))}
            />
            <p className="text-xs text-gray-500">Fee for sole proprietorship registration</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="processingFee">Processing Fee ($)</Label>
            <Input
              id="processingFee"
              type="number"
              step="0.01"
              value={settings.processingFee}
              onChange={(e) => updateSetting('processingFee', parseFloat(e.target.value))}
            />
            <p className="text-xs text-gray-500">Additional processing fee for online payments</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="latePenaltyRate">Late Penalty Rate (%)</Label>
            <Input
              id="latePenaltyRate"
              type="number"
              step="0.01"
              value={settings.latePenaltyRate * 100}
              onChange={(e) => updateSetting('latePenaltyRate', parseFloat(e.target.value) / 100)}
            />
            <p className="text-xs text-gray-500">Penalty rate for late registrations</p>
          </div>
        </div>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Fee changes will apply to new applications only. Existing applications will maintain their original fee structure.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}