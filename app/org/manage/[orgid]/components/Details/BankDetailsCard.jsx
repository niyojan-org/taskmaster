import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import api from '@/lib/api';
import { toast } from 'sonner';

export default function BankDetailsCard({ bankDetails, org, onUpdate }) {
  const [showPaidDialog, setShowPaidDialog] = useState(false);
  const [razorpayAccountId, setRazorpayAccountId] = useState('');
  const [loading, setLoading] = useState(false);
  const [showBankDialog, setShowBankDialog] = useState(false);
  const [bankForm, setBankForm] = useState(bankDetails || {});

  if (!bankDetails) return null;

  const handleAllowPaidEvents = async () => {
    setLoading(true);
    try {
      const res = await api.patch(`/tm/org/${org._id}/allow-paid-events`, { razorpayAccountId });
      if (res.data.success) {
        toast.success('Paid events allowed');
        setShowPaidDialog(false);
        onUpdate && onUpdate();
      } else {
        toast.error(res.data.message || 'Failed to allow paid events');
      }
    } catch (e) {
      toast.error(e.response?.data?.message || e.message || 'Error');
    } finally {
      setLoading(false);
    }
  };

  const handleUnallowPaidEvents = async () => {
    setLoading(true);
    try {
      const res = await api.patch(`/tm/org/${org._id}/reject-paid-events`);
      if (res.data.success) {
        toast.success('Paid events disabled');
        onUpdate && onUpdate();
      } else {
        toast.error(res.data.message || 'Failed to disable paid events');
      }
    } catch (e) {
      toast.error(e.response?.data?.message || e.message || 'Error');
    } finally {
      setLoading(false);
    }
  };

  const handleBankUpdate = async () => {
    setLoading(true);
    try {
      const res = await api({
        url: `/tm/org/${org._id}`,
        method: 'POST',
        data: { bankDetails: bankForm }
      });
      if (res.data.success) {
        toast.success('Bank details updated');
        setShowBankDialog(false);
        onUpdate && onUpdate();
      } else {
        toast.error(res.data.message || 'Failed to update bank details');
      }
    } catch (e) {
      toast.error(e.response?.data?.message || e.message || 'Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-green-600" />
          Bank Details
        </CardTitle>
        <CardDescription>Banking information for payments</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-600">Account Holder</p>
            <p className="text-gray-900">{bankDetails.accountHolderName}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Bank Name</p>
            <p className="text-gray-900">{bankDetails.bankName}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Account Number</p>
            <p className="text-gray-900">{bankDetails.accountNumber}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">IFSC Code</p>
            <p className="text-gray-900">{bankDetails.ifscCode}</p>
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          {org?.eventPreferences?.allowsPaidEvents ? (
            <Button onClick={handleUnallowPaidEvents} disabled={loading} variant="destructive">
              {loading ? 'Processing...' : 'Unallow Paid Events'}
            </Button>
          ) : (
            <Button onClick={() => setShowPaidDialog(true)} disabled={loading}>
              Allow Paid Events
            </Button>
          )}
          <Button onClick={() => setShowBankDialog(true)} variant="outline" disabled={loading}>
            Update Bank Details
          </Button>
        </div>

        {/* Allow Paid Events Dialog */}
        <Dialog open={showPaidDialog} onOpenChange={setShowPaidDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Allow Paid Events</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Razorpay Account ID"
                value={razorpayAccountId}
                onChange={e => setRazorpayAccountId(e.target.value)}
                disabled={loading}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowPaidDialog(false)} disabled={loading}>Cancel</Button>
              <Button onClick={handleAllowPaidEvents} disabled={!razorpayAccountId || loading}>
                {loading ? 'Processing...' : 'Allow Paid Events'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Update Bank Details Dialog */}
        <Dialog open={showBankDialog} onOpenChange={setShowBankDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Bank Details</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 gap-3">
              <Input
                placeholder="Account Holder Name"
                value={bankForm.accountHolderName || ''}
                onChange={e => setBankForm(f => ({ ...f, accountHolderName: e.target.value }))}
                disabled={loading}
              />
              <Input
                placeholder="Bank Name"
                value={bankForm.bankName || ''}
                onChange={e => setBankForm(f => ({ ...f, bankName: e.target.value }))}
                disabled={loading}
              />
              <Input
                placeholder="Account Number"
                value={bankForm.accountNumber || ''}
                onChange={e => setBankForm(f => ({ ...f, accountNumber: e.target.value }))}
                disabled={loading}
              />
              <Input
                placeholder="IFSC Code"
                value={bankForm.ifscCode || ''}
                onChange={e => setBankForm(f => ({ ...f, ifscCode: e.target.value }))}
                disabled={loading}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowBankDialog(false)} disabled={loading}>Cancel</Button>
              <Button onClick={handleBankUpdate} disabled={loading}>
                {loading ? 'Updating...' : 'Update'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
