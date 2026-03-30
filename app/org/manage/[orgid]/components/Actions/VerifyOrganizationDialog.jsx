import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export default function VerifyOrganizationDialog({ open, onClose, onSubmit, formData, setFormData, loading }) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Verify Organization</DialogTitle>
          <DialogDescription>
            Approve this organization's verification and grant permissions.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex-1">
              <Label htmlFor="allowsEventCreation" className="text-sm font-medium">
                Allow Event Creation
              </Label>
              <p className="text-xs text-gray-500 mt-1">
                Enable this organization to create events on the platform
              </p>
            </div>
            <Switch
              id="allowsEventCreation"
              checked={formData.allowsEventCreation ?? true}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, allowsEventCreation: checked }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="verify-notes">Verification Notes (Optional)</Label>
            <Input
              id="verify-notes"
              placeholder="Add any verification notes..."
              value={formData.verificationNotes || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, verificationNotes: e.target.value }))}
            />
            <p className="text-xs text-gray-500">
              Internal notes for record keeping
            </p>
          </div>

          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-700 font-medium mb-1">Verification Checklist:</p>
            <ul className="text-xs text-blue-600 space-y-0.5 list-disc list-inside">
              <li>All required documents are verified</li>
              <li>Organization information is accurate</li>
              <li>Contact details are valid</li>
              <li>No fraud flags or compliance issues</li>
            </ul>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="cursor-pointer" disabled={loading}>
            Cancel
          </Button>
          <Button
            className="bg-green-600 hover:bg-green-700 cursor-pointer"
            onClick={onSubmit}
            disabled={loading}
          >
            {loading ? 'Verifying...' : 'Verify Organization'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
