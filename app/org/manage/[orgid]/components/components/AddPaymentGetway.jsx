'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { CreditCard, Loader2, Edit, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';

export default function AddPaymentGetway({ orgId, orgData, onUpdate }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    razorpayAccountId: '',
    cashfreeAccountId: ''
  });

  // Check if payment gateways exist
  const hasPaymentGateways = orgData?.paymentGateways;
  const razorpayExists = hasPaymentGateways?.razorpayAccountId;
  const cashfreeExists = hasPaymentGateways?.cashfreeAccountId;
  const hasAnyGateway = razorpayExists || cashfreeExists;

  // Pre-fill form with existing data when opening for edit
  useEffect(() => {
    if (open && hasPaymentGateways) {
      setFormData({
        razorpayAccountId: hasPaymentGateways.razorpayAccountId || '',
        cashfreeAccountId: hasPaymentGateways.cashfreeAccountId || ''
      });
    }
  }, [open, hasPaymentGateways]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.razorpayAccountId && !formData.cashfreeAccountId) {
      toast.error('Please provide at least one payment gateway account ID');
      return;
    }

    try {
      setLoading(true);
      const response = await api.post('/tm/payment/addPaymentGateway', {
        razorpayAccountId: formData.razorpayAccountId || undefined,
        cashfreeAccountId: formData.cashfreeAccountId || undefined,
        orgId
      });

      if (response.data.success) {
        toast.success(response.data.message || 'Payment gateway updated successfully!');
        setOpen(false);
        if (onUpdate) onUpdate();
      } else {
        toast.error(response.data.message || 'Failed to update payment gateway');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Error updating payment gateway';
      toast.error(errorMessage);
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setOpen(false);
      if (!hasAnyGateway) {
        setFormData({ razorpayAccountId: '', cashfreeAccountId: '' });
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Display Existing Payment Gateways */}
      {hasAnyGateway && (
        <div className="space-y-3">
          {razorpayExists && (
            <Card className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <CreditCard className="w-4 h-4 text-blue-600" />
                    <p className="text-sm font-semibold text-blue-900">Razorpay</p>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <p className="text-xs text-gray-600 font-mono bg-white/60 px-2 py-1 rounded inline-block">
                    {razorpayExists}
                  </p>
                </div>
              </div>
            </Card>
          )}

          {cashfreeExists && (
            <Card className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <CreditCard className="w-4 h-4 text-purple-600" />
                    <p className="text-sm font-semibold text-purple-900">Cashfree</p>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <p className="text-xs text-gray-600 font-mono bg-white/60 px-2 py-1 rounded inline-block">
                    {cashfreeExists}
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Add/Edit Button */}
      <Button
        onClick={() => setOpen(true)}
        className={hasAnyGateway ? "w-full bg-orange-600 hover:bg-orange-700 cursor-pointer" : "w-full bg-blue-600 hover:bg-blue-700 cursor-pointer"}
        disabled={loading}
      >
        {hasAnyGateway ? (
          <>
            <Edit className="w-4 h-4 mr-2" />
            Edit Payment Gateways
          </>
        ) : (
          <>
            <CreditCard className="w-4 h-4 mr-2" />
            Add Payment Gateways
          </>
        )}
      </Button>

      {/* Dialog for Add/Edit */}
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {hasAnyGateway ? (
                <>
                  <Edit className="w-5 h-5 text-orange-600" />
                  Edit Payment Gateways
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  Add Payment Gateways
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              {hasAnyGateway 
                ? 'Update payment gateway account details for this organization.' 
                : 'Add payment gateway account details for this organization. Provide at least one gateway account ID.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-5 py-4">
              {/* Razorpay */}
              <div className="space-y-2">
                <Label htmlFor="razorpay-id" className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  Razorpay Account ID
                </Label>
                <div className="relative">
                  <Input
                    id="razorpay-id"
                    placeholder="acc_xxxxxxxxxxxxx"
                    value={formData.razorpayAccountId}
                    onChange={(e) => setFormData(prev => ({ ...prev, razorpayAccountId: e.target.value }))}
                    disabled={loading}
                    className="font-mono text-sm"
                  />
                  {formData.razorpayAccountId && (
                    <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-600" />
                  )}
                </div>
                {razorpayExists && !formData.razorpayAccountId && (
                  <p className="text-xs text-amber-600 flex items-center gap-1">
                    <XCircle className="w-3 h-3" />
                    Clear field to remove this gateway
                  </p>
                )}
              </div>

              {/* Cashfree */}
              <div className="space-y-2">
                <Label htmlFor="cashfree-id" className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                  Cashfree Account ID
                </Label>
                <div className="relative">
                  <Input
                    id="cashfree-id"
                    placeholder="Enter Cashfree account ID"
                    value={formData.cashfreeAccountId}
                    onChange={(e) => setFormData(prev => ({ ...prev, cashfreeAccountId: e.target.value }))}
                    disabled={loading}
                    className="font-mono text-sm"
                  />
                  {formData.cashfreeAccountId && (
                    <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-600" />
                  )}
                </div>
                {cashfreeExists && !formData.cashfreeAccountId && (
                  <p className="text-xs text-amber-600 flex items-center gap-1">
                    <XCircle className="w-3 h-3" />
                    Clear field to remove this gateway
                  </p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleClose} 
                className="cursor-pointer"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className={hasAnyGateway ? "bg-orange-600 hover:bg-orange-700 cursor-pointer" : "bg-blue-600 hover:bg-blue-700 cursor-pointer"}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {hasAnyGateway ? 'Updating...' : 'Adding...'}
                  </>
                ) : (
                  <>
                    {hasAnyGateway ? 'Update Gateways' : 'Add Gateways'}
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
