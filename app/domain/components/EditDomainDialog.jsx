'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import useDomainStore from '@/store/domainStore';

export default function EditDomainDialog({ open, onOpenChange, domain }) {
  const [formData, setFormData] = useState({
    domain: '',
    isActive: true,
    environment: 'development',
    purposes: {
      cors: false,
      passkey: false,
      oauth: false,
      api: false,
      admin: false,
    },
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const updateDomain = useDomainStore((state) => state.updateDomain);

  useEffect(() => {
    if (domain) {
      setFormData({
        domain: domain.domain || '',
        isActive: domain.isActive ?? true,
        environment: domain.environment || 'development',
        purposes: domain.purposes || {
          cors: false,
          passkey: false,
          oauth: false,
          api: false,
          admin: false,
        },
        notes: domain.notes || '',
      });
    }
  }, [domain]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.domain) {
      toast.error('Domain URL is required');
      return;
    }

    // Basic URL validation
    try {
      new URL(formData.domain);
    } catch (error) {
      toast.error('Please enter a valid URL');
      return;
    }

    setLoading(true);
    const result = await updateDomain(domain._id, formData);
    setLoading(false);

    if (result.success) {
      toast.success('Domain updated successfully');
      onOpenChange(false);
    } else {
      toast.error(result.error || 'Failed to update domain');
    }
  };

  const handlePurposeChange = (purpose, checked) => {
    setFormData((prev) => ({
      ...prev,
      purposes: {
        ...prev.purposes,
        [purpose]: checked,
      },
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Domain</DialogTitle>
          <DialogDescription>
            Update domain configuration and settings.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Domain URL */}
          <div className="space-y-2">
            <Label htmlFor="edit-domain">Domain URL *</Label>
            <Input
              id="edit-domain"
              placeholder="https://example.com"
              value={formData.domain}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, domain: e.target.value }))
              }
              required
            />
          </div>

          {/* Environment */}
          <div className="space-y-2">
            <Label htmlFor="edit-environment">Environment *</Label>
            <Select
              value={formData.environment}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, environment: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select environment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="development">Development</SelectItem>
                <SelectItem value="staging">Staging</SelectItem>
                <SelectItem value="production">Production</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Active Status */}
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="edit-isActive" className="flex-1">
              Active Status
              <p className="text-sm text-muted-foreground font-normal">
                Enable or disable this domain
              </p>
            </Label>
            <Switch
              id="edit-isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({ ...prev, isActive: checked }))
              }
            />
          </div>

          {/* Purposes */}
          <div className="space-y-3">
            <Label>Purposes</Label>
            <div className="space-y-3 rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="edit-cors" className="font-normal">
                    CORS
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Cross-Origin Resource Sharing
                  </p>
                </div>
                <Switch
                  id="edit-cors"
                  checked={formData.purposes.cors}
                  onCheckedChange={(checked) =>
                    handlePurposeChange('cors', checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="edit-oauth" className="font-normal">
                    OAuth
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    OAuth authentication
                  </p>
                </div>
                <Switch
                  id="edit-oauth"
                  checked={formData.purposes.oauth}
                  onCheckedChange={(checked) =>
                    handlePurposeChange('oauth', checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="edit-api" className="font-normal">
                    API
                  </Label>
                  <p className="text-sm text-muted-foreground">API access</p>
                </div>
                <Switch
                  id="edit-api"
                  checked={formData.purposes.api}
                  onCheckedChange={(checked) =>
                    handlePurposeChange('api', checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="edit-passkey" className="font-normal">
                    Passkey
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Passkey authentication
                  </p>
                </div>
                <Switch
                  id="edit-passkey"
                  checked={formData.purposes.passkey}
                  onCheckedChange={(checked) =>
                    handlePurposeChange('passkey', checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="edit-admin" className="font-normal">
                    Admin
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Admin panel access
                  </p>
                </div>
                <Switch
                  id="edit-admin"
                  checked={formData.purposes.admin}
                  onCheckedChange={(checked) =>
                    handlePurposeChange('admin', checked)
                  }
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="edit-notes">Notes</Label>
            <Textarea
              id="edit-notes"
              placeholder="Add any notes or description..."
              value={formData.notes}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, notes: e.target.value }))
              }
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Updating...' : 'Update Domain'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
