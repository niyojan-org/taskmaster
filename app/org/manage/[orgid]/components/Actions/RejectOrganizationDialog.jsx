import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export default function RejectOrganizationDialog({ open, onClose, onSubmit, formData, setFormData, loading }) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reject Organization Verification</DialogTitle>
          <DialogDescription>
            Provide a clear and detailed reason for rejecting this organization's verification request.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="reject-reason">Rejection Reason *</Label>
            <Textarea
              id="reject-reason"
              placeholder="e.g., Incomplete documentation. Please upload valid GST certificate and PAN card."
              value={formData.rejectReason || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, rejectReason: e.target.value }))}
              rows={5}
              className="resize-none"
            />
            <p className="text-xs text-gray-500">
              Minimum 10 characters required. Be specific about what needs to be corrected.
            </p>
          </div>

          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-700 font-medium mb-1">Common rejection reasons:</p>
            <ul className="text-xs text-blue-600 space-y-0.5 list-disc list-inside">
              <li>Incomplete documentation - missing required documents</li>
              <li>Invalid or expired documents submitted</li>
              <li>Information mismatch between documents</li>
              <li>Organization details cannot be verified</li>
              <li>Suspicious or fraudulent activity detected</li>
            </ul>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="cursor-pointer" disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            className="cursor-pointer"
            onClick={onSubmit}
            disabled={loading || !formData.rejectReason || formData.rejectReason.trim().length < 10}
          >
            {loading ? 'Rejecting...' : 'Reject Verification'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
