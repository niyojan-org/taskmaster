import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function BlockOrganizationDialog({ open, onClose, onSubmit, formData, setFormData, loading }) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Block Organization</DialogTitle>
          <DialogDescription>
            This will prevent the organization from accessing their account and creating events.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="block-reason">Reason for blocking</Label>
            <Input
              id="block-reason"
              placeholder="Enter reason..."
              value={formData.blockReason || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, blockReason: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="block-type">Block Type</Label>
            <Select
              value={formData.blockType || 'temporary'}
              onValueChange={(value) => setFormData(prev => ({ ...prev, blockType: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select block type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="temporary">Temporary</SelectItem>
                <SelectItem value="permanent">Permanent</SelectItem>
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
            disabled={!formData.blockReason || loading}
            className="cursor-pointer"
          >
            Block Organization
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
