'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import useDomainStore from '@/store/domainStore';
import { IconAlertTriangle } from '@tabler/icons-react';

export default function DeleteDomainDialog({ open, onOpenChange, domain }) {
  const [loading, setLoading] = useState(false);
  const deleteDomain = useDomainStore((state) => state.deleteDomain);

  const handleDelete = async () => {
    if (!domain) return;

    setLoading(true);
    const result = await deleteDomain(domain._id);
    setLoading(false);

    if (result.success) {
      toast.success('Domain deleted successfully');
      onOpenChange(false);
    } else {
      toast.error(result.error || 'Failed to delete domain');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="bg-red-100 p-2 rounded-lg">
              <IconAlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <DialogTitle>Delete Domain</DialogTitle>
          </div>
          <DialogDescription className="pt-4">
            Are you sure you want to delete this domain? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>

        {domain && (
          <div className="bg-muted p-4 rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Domain:</span>
              <span className="text-muted-foreground">{domain.domain}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="font-medium">Environment:</span>
              <span className="text-muted-foreground">
                {domain.environment}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="font-medium">Status:</span>
              <span className="text-muted-foreground">
                {domain.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete Domain'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
