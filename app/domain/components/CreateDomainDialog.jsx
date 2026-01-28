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

const initialFormData = {
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
};

export default function CreateDomainDialog({ open, onOpenChange }) {
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const createDomain = useDomainStore((state) => state.createDomain);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
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
    const result = await createDomain(formData);
    setLoading(false);

    if (result.success) {
      toast.success('Domain created successfully');
      setFormData(initialFormData);
      onOpenChange(false);
    } else {
      toast.error(result.error || 'Failed to create domain');
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

  const handleClose = () => {
    setFormData(initialFormData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Domain</DialogTitle>
          <DialogDescription>
            Add a new domain to your system. Fill in the details below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Domain URL */}
          <div className="space-y-2">
            <Label htmlFor="domain">Domain URL *</Label>
            <Input
              id="domain"
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
            <Label htmlFor="environment">Environment *</Label>
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
            <Label htmlFor="isActive" className="flex-1">
              Active Status
              <p className="text-sm text-muted-foreground font-normal">
                Enable or disable this domain
              </p>
            </Label>
            <Switch
              id="isActive"
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
                  <Label htmlFor="cors" className="font-normal">
                    CORS
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Cross-Origin Resource Sharing
                  </p>
                </div>
                <Switch
                  id="cors"
                  checked={formData.purposes.cors}
                  onCheckedChange={(checked) =>
                    handlePurposeChange('cors', checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="oauth" className="font-normal">
                    OAuth
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    OAuth authentication
                  </p>
                </div>
                <Switch
                  id="oauth"
                  checked={formData.purposes.oauth}
                  onCheckedChange={(checked) =>
                    handlePurposeChange('oauth', checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="api" className="font-normal">
                    API
                  </Label>
                  <p className="text-sm text-muted-foreground">API access</p>
                </div>
                <Switch
                  id="api"
                  checked={formData.purposes.api}
                  onCheckedChange={(checked) =>
                    handlePurposeChange('api', checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="passkey" className="font-normal">
                    Passkey
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Passkey authentication
                  </p>
                </div>
                <Switch
                  id="passkey"
                  checked={formData.purposes.passkey}
                  onCheckedChange={(checked) =>
                    handlePurposeChange('passkey', checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="admin" className="font-normal">
                    Admin
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Admin panel access
                  </p>
                </div>
                <Switch
                  id="admin"
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
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
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
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Domain'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
