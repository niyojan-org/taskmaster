import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function WarningDialog({ open, onClose, onSubmit, formData, setFormData, loading }) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Warning</DialogTitle>
          <DialogDescription>
            Issue a warning to the organization for policy violations or concerns.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="warning-message">Warning Message</Label>
            <Input
              id="warning-message"
              placeholder="Enter warning message..."
              value={formData.warningMessage || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, warningMessage: e.target.value }))}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="cursor-pointer">
            Cancel
          </Button>
          <Button
            className="bg-yellow-600 hover:bg-yellow-700 cursor-pointer"
            onClick={onSubmit}
            disabled={!formData.warningMessage || loading}
          >
            Add Warning
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
