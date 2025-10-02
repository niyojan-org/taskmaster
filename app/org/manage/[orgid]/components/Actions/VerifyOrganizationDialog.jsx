import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function VerifyOrganizationDialog({ open, onClose, onSubmit, formData, setFormData, loading }) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Verify Organization</DialogTitle>
          <DialogDescription>
            Mark this organization as verified after reviewing their documents and information.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="verify-notes">Verification Notes (Optional)</Label>
            <Input
              id="verify-notes"
              placeholder="Add any verification notes..."
              value={formData.verificationNotes || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, verificationNotes: e.target.value }))}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="cursor-pointer">
            Cancel
          </Button>
          <Button
            className="bg-green-600 hover:bg-green-700 cursor-pointer"
            onClick={onSubmit}
            disabled={loading}
          >
            Verify Organization
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
