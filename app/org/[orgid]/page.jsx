"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function OrganizationManagePage() {
  const { orgid } = useParams();
  const router = useRouter();
  const [org, setOrg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => {
    if (!orgid) return;
    setLoading(true);
    api
      .get(`/org/admin/${orgid}`)
      .then((res) => {
        setOrg(res.data.data);
        setError("");
      })
      .catch(() => setError("Failed to load organization info."))
      .finally(() => setLoading(false));
  }, [orgid]);

  const handleAction = async (action) => {
    if (!orgid) return;
    setActionLoading(true);
    setError("");
    try {
      let response;
      if (action === "reject") {
        if (!rejectReason.trim()) {
          setError("Rejection reason is required.");
          setActionLoading(false);
          return;
        }
        response = await api.patch(`/org/admin/${orgid}/reject`, { reason: rejectReason });
        setShowRejectDialog(false);
        setRejectReason("");
        toast.success(response?.data?.message || "Organization rejected successfully");
      } else {
        response = await api.patch(`/org/admin/${orgid}/verify`);
        toast.success(response?.data?.message || "Organization verified successfully");
      }
      router.refresh();
    } catch (error) {
      let msg = "Action failed. Please try again.";
      if (error?.response?.data?.message) {
        msg = error.response.data.message;
      } else if (error?.message) {
        msg = error.message;
      }
      console.error("Action error:", error);
      toast.error(msg);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <div className="p-6">Loading…</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!org) return null;

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <Card>
        <CardHeader className="flex items-center gap-4">
          {org.logo && (
            <img src={org.logo} alt={org.name} className="w-20 h-20 rounded object-cover border" />
          )}
          <div>
            <CardTitle>{org.name}</CardTitle>
            <CardDescription>
              {org.category} - {org.subCategory}
            </CardDescription>
            <div className="text-sm text-muted-foreground">{org.email}</div>
            <div className="text-sm text-muted-foreground">{org.phone}</div>
            <div className="text-sm text-muted-foreground">
              Admin: {org.admin?.name} ({org.admin?.email})
            </div>
            <div className="text-sm text-muted-foreground">
              Created: {new Date(org.createdAt).toLocaleString()}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-2">
            <span className="font-medium">Address:</span> {org.address?.street}, {org.address?.city}
            , {org.address?.state}, {org.address?.country} {org.address?.zipCode}
          </div>
          <div className="mb-2">
            <span className="font-medium">Website:</span>{" "}
            <a
              href={org.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              {org.website}
            </a>
          </div>
          <div className="mb-2">
            <span className="font-medium">Documents:</span>
            <ul className="list-disc ml-5">
              {org.documents.map((doc) => (
                <li key={doc._id}>
                  <a href={doc.url} target="_blank" rel="noopener noreferrer" className="underline">
                    {doc.type}
                  </a>{" "}
                  {doc.verified ? (
                    <span className="text-green-600">(Verified)</span>
                  ) : (
                    <span className="text-yellow-600">(Pending)</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
          <div className="mb-2">
            <span className="font-medium">Support Contact:</span> {org.supportContact?.name} (
            {org.supportContact?.email}, {org.supportContact?.phone})
          </div>
          <div className="mb-2">
            <span className="font-medium">Bank Details:</span> {org.bankDetails?.accountHolderName},{" "}
            {org.bankDetails?.bankName}, {org.bankDetails?.accountNumber}
          </div>
          <div className="mb-2">
            <span className="font-medium">Social Links:</span>{" "}
            <a href={org.socialLinks?.facebook} target="_blank" rel="noopener noreferrer">
              Facebook
            </a>
            ,{" "}
            <a href={org.socialLinks?.instagram} target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
            ,{" "}
            <a href={org.socialLinks?.linkedin} target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
          </div>
        </CardContent>
        <CardFooter className="flex gap-4">
          <Button
            variant="default"
            disabled={actionLoading || org.verified}
            onClick={() => handleAction("verify")}
          >
            {org.verified ? "Verified" : actionLoading ? "Verifying..." : "Verify"}
          </Button>
          <Button
            variant="destructive"
            disabled={actionLoading || org.verified}
            onClick={() => setShowRejectDialog(true)}
          >
            Reject
          </Button>
        </CardFooter>
      </Card>
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Organization</DialogTitle>
          </DialogHeader>
          <div className="mb-4">
            <label className="block mb-2 font-medium">Reason for rejection</label>
            <Input
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter rejection reason"
              disabled={actionLoading}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowRejectDialog(false)}
              disabled={actionLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleAction("reject")}
              disabled={actionLoading || !rejectReason.trim()}
            >
              {actionLoading ? "Rejecting..." : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
