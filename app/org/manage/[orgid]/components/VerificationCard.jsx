"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Field, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { IconShieldCheck } from "@tabler/icons-react";
import CardFrame from "./CardFrame";

function VerificationCard({
  data,
  isSaving,
  onVerifyOrganization,
  onRejectVerification,
  onUnverifyOrganization,
}) {
  const [verifyOpen, setVerifyOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [unverifyOpen, setUnverifyOpen] = useState(false);
  const [allowsEventCreation, setAllowsEventCreation] = useState(
    data.allowsEventCreation ?? true,
  );
  const [verifyNote, setVerifyNote] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [unverifyReason, setUnverifyReason] = useState("");

  const pendingVerification = !!data.reqForVerification && !data.verified;

  const handleVerify = async () => {
    await onVerifyOrganization?.({ allowsEventCreation, note: verifyNote });
    setVerifyOpen(false);
    setVerifyNote("");
  };

  const handleReject = async () => {
    await onRejectVerification?.({ reason: rejectReason });
    setRejectOpen(false);
    setRejectReason("");
  };

  const handleUnverify = async () => {
    await onUnverifyOrganization?.({ reason: unverifyReason });
    setUnverifyOpen(false);
    setUnverifyReason("");
  };

  return (
    <>
      <CardFrame
        title="Verification"
        description="Approve, reject, or unverify organization status"
        icon={IconShieldCheck}
        editable={false}
        isEditing={false}
        isSaving={isSaving}
        onEdit={() => {}}
        onCancel={() => {}}
        onSave={() => {}}
      >
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant={data.verified ? "default" : "outline"}>
              {data.verified ? "Verified" : "Unverified"}
            </Badge>
            <Badge variant={data.reqForVerification ? "default" : "outline"}>
              {data.reqForVerification
                ? "Verification Requested"
                : "No Verification Request"}
            </Badge>
          </div>

          <div className="flex flex-wrap gap-2">
            {pendingVerification ? (
              <>
                <Button
                  size="sm"
                  onClick={() => setVerifyOpen(true)}
                  disabled={isSaving}
                >
                  Verify Organization
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setRejectOpen(true)}
                  disabled={isSaving}
                >
                  Reject Request
                </Button>
              </>
            ) : null}

            {data.verified ? (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setUnverifyOpen(true)}
                disabled={isSaving}
              >
                Unverify Organization
              </Button>
            ) : null}
          </div>
        </div>
      </CardFrame>

      <Dialog open={verifyOpen} onOpenChange={setVerifyOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verify Organization</DialogTitle>
            <DialogDescription>
              Send verification with event-creation permission and optional
              note.
            </DialogDescription>
          </DialogHeader>

          <Field
            orientation="horizontal"
            className="items-center justify-between rounded-xl border border-border bg-muted px-3 py-2"
          >
            <FieldLabel>Allow Event Creation</FieldLabel>
            <Switch
              checked={allowsEventCreation}
              onCheckedChange={setAllowsEventCreation}
              disabled={isSaving}
            />
          </Field>

          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">
              Verification Note (Optional)
            </p>
            <Textarea
              value={verifyNote}
              onChange={(e) => setVerifyNote(e.target.value)}
              placeholder="Add verification note"
              disabled={isSaving}
            />
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setVerifyOpen(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button onClick={handleVerify} disabled={isSaving}>
              {isSaving ? "Verifying..." : "Verify"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Verification Request</DialogTitle>
            <DialogDescription>
              Provide a reason that will be sent in the reject request body.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Reason</p>
            <Textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter reason"
              disabled={isSaving}
            />
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRejectOpen(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              onClick={handleReject}
              disabled={isSaving || !rejectReason.trim()}
            >
              {isSaving ? "Rejecting..." : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={unverifyOpen} onOpenChange={setUnverifyOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Unverify Organization</DialogTitle>
            <DialogDescription>
              Provide a reason that will be sent in the unverify request body.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Reason</p>
            <Textarea
              value={unverifyReason}
              onChange={(e) => setUnverifyReason(e.target.value)}
              placeholder="Enter reason"
              disabled={isSaving}
            />
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setUnverifyOpen(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUnverify}
              disabled={isSaving || !unverifyReason.trim()}
            >
              {isSaving ? "Submitting..." : "Unverify"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default VerificationCard;
