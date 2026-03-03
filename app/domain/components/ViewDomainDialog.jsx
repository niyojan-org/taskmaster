'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  IconWorld, 
  IconCalendar, 
  IconShield, 
  IconActivity,
  IconFileText
} from '@tabler/icons-react';

export default function ViewDomainDialog({ open, onOpenChange, domain }) {
  if (!domain) return null;

  const getPurposes = () => {
    if (!domain.purposes) return [];
    return Object.entries(domain.purposes)
      .filter(([_, value]) => value === true)
      .map(([key]) => key);
  };

  const purposes = getPurposes();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IconWorld className="h-5 w-5" />
            Domain Details
          </DialogTitle>
          <DialogDescription>
            Complete information about this domain configuration
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Domain URL */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Domain URL
            </h3>
            <div className="flex items-center gap-2">
              <code className="relative rounded bg-muted px-3 py-2 font-mono text-sm flex-1">
                {domain.domain}
              </code>
              <Badge variant={domain.isActive ? 'default' : 'secondary'}>
                {domain.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Environment & Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                <IconActivity className="h-4 w-4" />
                Environment
              </h3>
              <Badge 
                variant="outline" 
                className="text-sm capitalize"
              >
                {domain.environment}
              </Badge>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                <IconShield className="h-4 w-4" />
                Status
              </h3>
              <Badge 
                variant={domain.isActive ? 'default' : 'secondary'}
                className="text-sm"
              >
                {domain.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Purposes */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
              <IconShield className="h-4 w-4" />
              Purposes
            </h3>
            {purposes.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {purposes.map((purpose) => (
                  <Badge key={purpose} variant="secondary">
                    {purpose.toUpperCase()}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No purposes assigned</p>
            )}
          </div>

          <Separator />

          {/* Notes */}
          {domain.notes && (
            <>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                  <IconFileText className="h-4 w-4" />
                  Notes
                </h3>
                <p className="text-sm bg-muted p-3 rounded-lg">
                  {domain.notes}
                </p>
              </div>
              <Separator />
            </>
          )}

          {/* Timestamps */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                <IconCalendar className="h-4 w-4" />
                Created At
              </h3>
              <p className="text-sm">
                {domain.createdAt 
                  ? new Date(domain.createdAt).toLocaleString()
                  : 'N/A'}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                <IconCalendar className="h-4 w-4" />
                Updated At
              </h3>
              <p className="text-sm">
                {domain.updatedAt 
                  ? new Date(domain.updatedAt).toLocaleString()
                  : 'N/A'}
              </p>
            </div>
          </div>

          {/* Domain ID */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Domain ID
            </h3>
            <code className="relative rounded bg-muted px-3 py-2 font-mono text-xs block">
              {domain._id}
            </code>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
