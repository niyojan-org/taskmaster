'use client';

import { useState } from 'react';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Shield, Ban, CheckCircle, AlertTriangle, Calendar, Flag, Settings, Loader2, FileText } from 'lucide-react';
import { toast } from 'sonner';
import ActionCard from './Actions/ActionCard';
import DocumentManagement from './Actions/DocumentManagement';
import BankAccountManagement from './Actions/BankAccountManagement';
import BlockOrganizationDialog from './Actions/BlockOrganizationDialog';
import VerifyOrganizationDialog from './Actions/VerifyOrganizationDialog';
import FraudFlagDialog from './Actions/FraudFlagDialog';
import WarningDialog from './Actions/WarningDialog';
import PendingFraudFlags from './Actions/PendingFraudFlags';

export default function OrganizationActions({ orgId, orgData, onUpdate }) {
  const [loading, setLoading] = useState(false);
  const [showDialogs, setShowDialogs] = useState({});
  const [formData, setFormData] = useState({});

  const makeApiCall = async (endpoint, method = 'PATCH', body = null) => {
    try {
      setLoading(true);
      const response = await api({
        url: `/tm/org/${orgId}${endpoint}`,
        method,
        data: body
      });

      if (response.data.success) {
        onUpdate();
        setShowDialogs({});
        setFormData({});
        toast.success(response.data.message || 'Action completed successfully!');
      } else {
        toast.error(response.data.message || 'Action failed');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
      toast.error(errorMessage);
      console.error('API call error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDialogClose = (dialogName) => {
    setShowDialogs(prev => ({ ...prev, [dialogName]: false }));
    setFormData({});
  };

  const handleFormSubmit = (endpoint, body, dialogName) => {
    makeApiCall(endpoint, 'PATCH', body);
    handleDialogClose(dialogName);
  };

  return (
    <div className="space-y-6">
      {/* Organization Status Actions */}
      <ActionCard
        title="Organization Status"
        description="Manage organization verification and blocking"
        icon={Shield}
        color="blue"
      >
        <div className="space-y-3">
          {/* Block/Unblock */}
          {!orgData.isBlocked ? (
            <Button
              onClick={() => setShowDialogs(prev => ({ ...prev, block: true }))}
              variant="destructive"
              className="w-full cursor-pointer"
              disabled={loading}
            >
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Ban className="w-4 h-4 mr-2" />}
              Block Organization
            </Button>
          ) : (
            <Button
              onClick={() => makeApiCall('/unblock')}
              variant="default"
              className="w-full bg-green-600 hover:bg-green-700 cursor-pointer"
              disabled={loading}
            >
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle className="w-4 h-4 mr-2" />}
              Unblock Organization
            </Button>
          )}

          {/* Verification */}
          {!orgData.verified ? (
            <Button
              onClick={() => setShowDialogs(prev => ({ ...prev, verify: true }))}
              variant="default"
              className="w-full bg-green-600 hover:bg-green-700 cursor-pointer"
              disabled={loading}
            >
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle className="w-4 h-4 mr-2" />}
              Verify Organization
            </Button>
          ) : (
            <Button
              onClick={() => makeApiCall('/unverify')}
              variant="destructive"
              className="w-full cursor-pointer"
              disabled={loading}
            >
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Ban className="w-4 h-4 mr-2" />}
              Remove Verification
            </Button>
          )}
        </div>
      </ActionCard>

      {/* Event Management */}
      <ActionCard
        title="Event Management"
        description="Control event creation permissions"
        icon={Calendar}
        color="orange"
      >
        {orgData.canCreateEvents ? (
          <Button
            onClick={() => makeApiCall('/block-event-creation')}
            variant="destructive"
            className="w-full cursor-pointer"
            disabled={loading}
          >
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Ban className="w-4 h-4 mr-2" />}
            Block Event Creation
          </Button>
        ) : (
          <Button
            onClick={() => makeApiCall('/unblock-event-creation')}
            variant="default"
            className="w-full bg-blue-600 hover:bg-blue-700 cursor-pointer"
            disabled={loading}
          >
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle className="w-4 h-4 mr-2" />}
            Allow Event Creation
          </Button>
        )}
      </ActionCard>

      {/* Security Actions */}
      <ActionCard
        title="Security & Compliance"
        description="Add warnings and fraud flags"
        icon={AlertTriangle}
        color="red"
      >
        <div className="space-y-3">
          <Button
            onClick={() => setShowDialogs(prev => ({ ...prev, fraudFlag: true }))}
            variant="destructive"
            className="w-full cursor-pointer"
            disabled={loading}
          >
            <Flag className="w-4 h-4 mr-2" />
            Add Fraud Flag
          </Button>

          <Button
            onClick={() => setShowDialogs(prev => ({ ...prev, warning: true }))}
            variant="outline"
            className="w-full border-yellow-300 text-yellow-700 hover:bg-yellow-50 cursor-pointer"
            disabled={loading}
          >
            <AlertTriangle className="w-4 h-4 mr-2" />
            Add Warning
          </Button>
        </div>
      </ActionCard>

      {/* Fraud Flags Resolution */}
      {orgData.fraudFlags?.some(flag => !flag.resolved) && (
        <ActionCard
          title="Pending Fraud Flags"
          description="Resolve active fraud flags"
          icon={Flag}
          color="purple"
        >
          <PendingFraudFlags fraudFlags={orgData.fraudFlags} loading={loading} makeApiCall={makeApiCall} />
        </ActionCard>
      )}

      {/* Document Management */}
      {orgData.documents && orgData.documents.length > 0 && (
        <ActionCard
          title="Document Management"
          description="Verify organization documents"
          icon={FileText}
          color="blue"
        >
          <DocumentManagement documents={orgData.documents} loading={loading} makeApiCall={makeApiCall} />
        </ActionCard>
      )}

      {/* Block Organization Dialog */}
      <BlockOrganizationDialog
        open={showDialogs.block}
        onClose={() => handleDialogClose('block')}
        onSubmit={() => handleFormSubmit('/block', {
          reason: formData.blockReason,
          blockType: formData.blockType
        }, 'block')}
        formData={formData}
        setFormData={setFormData}
        loading={loading}
      />

      {/* Verify Organization Dialog */}
      <VerifyOrganizationDialog
        open={showDialogs.verify}
        onClose={() => handleDialogClose('verify')}
        onSubmit={() => handleFormSubmit('/verify', {
          verificationNotes: formData.verificationNotes
        }, 'verify')}
        formData={formData}
        setFormData={setFormData}
        loading={loading}
      />

      {/* Fraud Flag Dialog */}
      <FraudFlagDialog
        open={showDialogs.fraudFlag}
        onClose={() => handleDialogClose('fraudFlag')}
        onSubmit={() => handleFormSubmit('/fraud-flag', {
          reason: formData.fraudReason,
          severity: formData.fraudSeverity
        }, 'fraudFlag')}
        formData={formData}
        setFormData={setFormData}
        loading={loading}
      />

      {/* Warning Dialog */}
      <WarningDialog
        open={showDialogs.warning}
        onClose={() => handleDialogClose('warning')}
        onSubmit={() => handleFormSubmit('/warning', {
          message: formData.warningMessage
        }, 'warning')}
        formData={formData}
        setFormData={setFormData}
        loading={loading}
      />
    </div>
  );
}
