'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { IconCircleCheck, IconCircleX, IconBuildingBank, IconAlertCircle } from '@tabler/icons-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

export default function BankAccountManagement({ bankDetails, loading, makeApiCall }) {
  const [showVerifyDialog, setShowVerifyDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [allowsPaidEvents, setAllowsPaidEvents] = useState(true);
  const [rejectionReason, setRejectionReason] = useState('');

  if (!bankDetails) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg text-center text-sm text-gray-500">
        <IconBuildingBank className="w-8 h-8 mx-auto mb-2 text-gray-400" />
        No bank details submitted
      </div>
    );
  }

  const handleVerify = () => {
    makeApiCall('/bank/verify', 'POST', { allowsPaidEvents });
    setShowVerifyDialog(false);
    setAllowsPaidEvents(true);
  };

  const handleReject = () => {
    if (rejectionReason.trim().length < 10) {
      return;
    }
    makeApiCall('/bank/reject', 'POST', { reason: rejectionReason });
    setShowRejectDialog(false);
    setRejectionReason('');
  };

  const isPending = bankDetails.reqForVerification && !bankDetails.verified;

  return (
    <div className="space-y-3">
      <div className="p-4 bg-gray-50 rounded-lg space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-2">
            <div>
              <p className="text-xs text-gray-500">Account Holder</p>
              <p className="text-sm font-medium">{bankDetails.accountHolderName}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Bank Name</p>
              <p className="text-sm font-medium">{bankDetails.bankName}</p>
            </div>
            {bankDetails.branchName && (
              <div>
                <p className="text-xs text-gray-500">Branch</p>
                <p className="text-sm">{bankDetails.branchName}</p>
              </div>
            )}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-xs text-gray-500">Account Number</p>
                <p className="text-sm font-mono">{bankDetails.accountNumber}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">IFSC Code</p>
                <p className="text-sm font-mono">{bankDetails.ifscCode}</p>
              </div>
            </div>
            {bankDetails.upiId && (
              <div>
                <p className="text-xs text-gray-500">UPI ID</p>
                <p className="text-sm">{bankDetails.upiId}</p>
              </div>
            )}
          </div>
          <div>
            <Badge 
              variant={bankDetails.verified ? "default" : isPending ? "secondary" : "outline"} 
              className="text-xs cursor-default"
            >
              {bankDetails.verified ? 'Verified' : isPending ? 'Pending' : 'Not Submitted'}
            </Badge>
          </div>
        </div>

        {bankDetails.rejectionReason && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-2">
              <IconAlertCircle className="w-4 h-4 text-red-500 mt-0.5" />
              <div>
                <p className="text-xs font-medium text-red-700">Rejection Reason</p>
                <p className="text-sm text-red-600 mt-1">{bankDetails.rejectionReason}</p>
                {bankDetails.rejectedAt && (
                  <p className="text-xs text-red-500 mt-1">
                    Rejected on {new Date(bankDetails.rejectedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {bankDetails.verified && bankDetails.verifiedAt && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-xs text-green-700">
              Verified on {new Date(bankDetails.verifiedAt).toLocaleDateString()}
            </p>
          </div>
        )}
      </div>

      {isPending && !loading && (
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={() => setShowVerifyDialog(true)}
            className="flex-1 cursor-pointer bg-green-600 hover:bg-green-700 text-white"
          >
            <IconCircleCheck className="w-4 h-4 mr-2" />
            Verify Bank Details
          </Button>
          <Button
            size="sm"
            onClick={() => setShowRejectDialog(true)}
            variant="destructive"
            className="flex-1 cursor-pointer"
          >
            <IconCircleX className="w-4 h-4 mr-2" />
            Reject
          </Button>
        </div>
      )}

      {/* Verify Dialog */}
      <Dialog open={showVerifyDialog} onOpenChange={setShowVerifyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verify Bank Details</DialogTitle>
            <DialogDescription>
              Approve the bank account details and set payment permissions.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Bank Account Details</Label>
              <div className="p-3 bg-gray-50 rounded-lg space-y-1 text-sm">
                <p><span className="text-gray-600">Holder:</span> {bankDetails.accountHolderName}</p>
                <p><span className="text-gray-600">Bank:</span> {bankDetails.bankName}</p>
                <p><span className="text-gray-600">Account:</span> {bankDetails.accountNumber}</p>
                <p><span className="text-gray-600">IFSC:</span> {bankDetails.ifscCode}</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1">
                <Label htmlFor="allowsPaidEvents" className="text-sm font-medium">
                  Allow Paid Events
                </Label>
                <p className="text-xs text-gray-500 mt-1">
                  Enable this organization to create paid/ticketed events
                </p>
              </div>
              <Switch
                id="allowsPaidEvents"
                checked={allowsPaidEvents}
                onCheckedChange={setAllowsPaidEvents}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowVerifyDialog(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleVerify}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700"
            >
              {loading ? 'Verifying...' : 'Verify Bank Details'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Bank Verification</DialogTitle>
            <DialogDescription>
              Provide a clear reason for rejecting the bank account verification.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="rejectionReason">Rejection Reason *</Label>
              <Textarea
                id="rejectionReason"
                placeholder="e.g., Account holder name does not match organization name. Please update and resubmit."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
                className="resize-none"
              />
              <p className="text-xs text-gray-500">
                Minimum 10 characters required. Be specific and helpful.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowRejectDialog(false);
                setRejectionReason('');
              }}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleReject}
              disabled={loading || rejectionReason.trim().length < 10}
              variant="destructive"
            >
              {loading ? 'Rejecting...' : 'Reject Verification'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
