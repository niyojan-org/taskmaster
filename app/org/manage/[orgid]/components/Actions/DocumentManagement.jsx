'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { IconCircleCheck, IconCircleX, IconExternalLink, IconFileText, IconAlertCircle } from '@tabler/icons-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function DocumentManagement({ documents, loading, makeApiCall }) {
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  if (!documents || documents.length === 0) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg text-center text-sm text-gray-500">
        <IconFileText className="w-8 h-8 mx-auto mb-2 text-gray-400" />
        No documents submitted
      </div>
    );
  }

  const handleVerify = (doc) => {
    makeApiCall('/verify-document', 'POST', { documentId: doc._id });
  };

  const handleRejectClick = (doc) => {
    setSelectedDocument(doc);
    setShowRejectDialog(true);
  };

  const handleReject = () => {
    if (rejectionReason.trim().length < 10 || !selectedDocument) {
      return;
    }
    makeApiCall('/reject-document', 'POST', { 
      documentId: selectedDocument._id,
      reason: rejectionReason 
    });
    setShowRejectDialog(false);
    setSelectedDocument(null);
    setRejectionReason('');
  };

  return (
    <div className="space-y-3">
      {documents.map((doc) => (
        <div key={doc._id} className="p-3 bg-gray-50 rounded-lg space-y-2">
          <div className="flex items-start justify-between">
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium">{doc.type}</p>
                <Badge 
                  variant={doc.verified ? "default" : doc.rejected ? "destructive" : "secondary"} 
                  className="text-xs cursor-default"
                >
                  {doc.verified ? 'Verified' : doc.rejected ? 'Rejected' : 'Pending'}
                </Badge>
              </div>
              {doc.documentId && (
                <p className="text-xs text-gray-600">ID: {doc.documentId}</p>
              )}
              <div className="flex items-center gap-2">
                <a
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-xs cursor-pointer flex items-center gap-1"
                >
                  <IconExternalLink className="w-3 h-3" />
                  View Document
                </a>
                {doc.verifiedAt && (
                  <span className="text-xs text-gray-500">
                    • Verified {new Date(doc.verifiedAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          </div>

          {doc.rejected && doc.rejectionReason && (
            <div className="p-2 bg-red-50 border border-red-200 rounded">
              <div className="flex items-start gap-2">
                <IconAlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs font-medium text-red-700">Rejection Reason</p>
                  <p className="text-xs text-red-600 mt-1">{doc.rejectionReason}</p>
                  {doc.rejectedAt && (
                    <p className="text-xs text-red-500 mt-1">
                      Rejected on {new Date(doc.rejectedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {!doc.verified && !doc.rejected && (
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => handleVerify(doc)}
                disabled={loading}
                className="flex-1 cursor-pointer bg-green-600 hover:bg-green-700 text-white"
              >
                <IconCircleCheck className="w-3 h-3 mr-1" />
                Verify
              </Button>
              <Button
                size="sm"
                onClick={() => handleRejectClick(doc)}
                disabled={loading}
                variant="destructive"
                className="flex-1 cursor-pointer"
              >
                <IconCircleX className="w-3 h-3 mr-1" />
                Reject
              </Button>
            </div>
          )}
        </div>
      ))}

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Document</DialogTitle>
            <DialogDescription>
              Provide a clear reason for rejecting this document.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {selectedDocument && (
              <div className="p-3 bg-gray-50 rounded-lg space-y-1 text-sm">
                <p><span className="text-gray-600">Type:</span> {selectedDocument.type}</p>
                {selectedDocument.documentId && (
                  <p><span className="text-gray-600">ID:</span> {selectedDocument.documentId}</p>
                )}
                <a
                  href={selectedDocument.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-xs cursor-pointer flex items-center gap-1"
                >
                  <IconExternalLink className="w-3 h-3" />
                  View Document
                </a>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="docRejectionReason">Rejection Reason *</Label>
              <Textarea
                id="docRejectionReason"
                placeholder="e.g., Document image is unclear. Please upload a high-quality scan showing all corners of the document."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
                className="resize-none"
              />
              <p className="text-xs text-gray-500">
                Minimum 10 characters required. Be specific about what needs to be corrected.
              </p>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-700 font-medium mb-1">Common rejection reasons:</p>
              <ul className="text-xs text-blue-600 space-y-0.5 list-disc list-inside">
                <li>Document image is unclear or blurry</li>
                <li>Document is expired or invalid</li>
                <li>Information does not match organization details</li>
                <li>Document appears to be tampered or edited</li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowRejectDialog(false);
                setSelectedDocument(null);
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
              {loading ? 'Rejecting...' : 'Reject Document'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
