import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function FraudFlagDialog({ open, onClose, onSubmit, formData, setFormData, loading }) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Fraud Flag</DialogTitle>
          <DialogDescription>
            Flag this organization for suspicious or fraudulent activity.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="fraud-reason">Reason for fraud flag</Label>
            <Input
              id="fraud-reason"
              placeholder="Describe the fraudulent activity..."
              value={formData.fraudReason || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, fraudReason: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fraud-severity">Severity Level</Label>
            <Select
              value={formData.fraudSeverity || 'minor'}
              onValueChange={(value) => setFormData(prev => ({ ...prev, fraudSeverity: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="minor">Minor</SelectItem>
                <SelectItem value="major">Major</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="cursor-pointer">
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onSubmit}
            disabled={!formData.fraudReason || loading}
            className="cursor-pointer"
          >
            Add Fraud Flag
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
