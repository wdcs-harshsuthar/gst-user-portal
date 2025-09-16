import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Switch } from '../../ui/switch';
import { Alert, AlertDescription } from '../../ui/alert';
import { Settings, Clock } from 'lucide-react';

interface SystemSettingsProps {
  settings: any;
  updateSetting: (key: string, value: any) => void;
}

export default function SystemSettings({ settings, updateSetting }: SystemSettingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          System Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Auto-Approval for Individual Applications</Label>
              <p className="text-xs text-gray-500">Automatically approve simple individual applications</p>
            </div>
            <Switch
              checked={settings.autoApprovalEnabled}
              onCheckedChange={(checked) => updateSetting('autoApprovalEnabled', checked)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxProcessingDays">Maximum Processing Days</Label>
            <Input
              id="maxProcessingDays"
              type="number"
              value={settings.maxProcessingDays}
              onChange={(e) => updateSetting('maxProcessingDays', parseInt(e.target.value))}
            />
            <p className="text-xs text-gray-500">SLA target for application processing</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reminderDays">Reminder Notification (Days)</Label>
            <Input
              id="reminderDays"
              type="number"
              value={settings.reminderDays}
              onChange={(e) => updateSetting('reminderDays', parseInt(e.target.value))}
            />
            <p className="text-xs text-gray-500">Send reminders for pending applications</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sessionTimeout">Session Timeout (Minutes)</Label>
            <Input
              id="sessionTimeout"
              type="number"
              value={settings.sessionTimeout}
              onChange={(e) => updateSetting('sessionTimeout', parseInt(e.target.value))}
            />
            <p className="text-xs text-gray-500">User session timeout duration</p>
          </div>
        </div>

        <Alert>
          <Clock className="h-4 w-4" />
          <AlertDescription>
            System changes may require a restart to take effect. Schedule maintenance windows appropriately.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}