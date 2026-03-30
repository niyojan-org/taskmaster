"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { resourceAPI } from "@/lib/api";
import { IconAlertTriangle, IconTrash } from "@tabler/icons-react";

export default function DeleteResourceDialog({
  open,
  onOpenChange,
  resource,
  onSuccess,
}) {
  const [loading, setLoading] = useState(false);
  const [permanent, setPermanent] = useState(false);

  const handleDelete = async () => {
    if (!resource) return;

    try {
      setLoading(true);
      await resourceAPI.deleteResource(resource._id, permanent);
      toast.success(
        permanent
          ? "Resource permanently deleted"
          : "Resource archived successfully"
      );
      setPermanent(false);
      onOpenChange(false);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error deleting resource:", error);
      toast.error(error.response?.data?.error || "Failed to delete resource");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setPermanent(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div
              className={`p-2 rounded-lg ${
                permanent ? "bg-destructive/10" : "bg-orange-500/10"
              }`}
            >
              <IconAlertTriangle
                className={`h-5 w-5 ${
                  permanent ? "text-destructive" : "text-orange-600 dark:text-orange-400"
                }`}
              />
            </div>
            <DialogTitle>
              {permanent ? "Permanently Delete" : "Archive"} Resource
            </DialogTitle>
          </div>
          <DialogDescription className="pt-4">
            {permanent ? (
              <>
                <strong className="text-destructive">Warning: </strong>
                This will permanently delete the resource and remove the file from
                cloud storage. This action cannot be undone.
              </>
            ) : (
              <>
                This will archive the resource. You can restore it later if needed.
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        {resource && (
          <div className="space-y-4">
            {/* Resource Info */}
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <div className="flex items-start gap-3">
                {resource.fileUrl &&
                  resource.type &&
                  resource.type.includes("image") && (
                    <img
                      src={resource.fileUrl}
                      alt={resource.title}
                      className="h-16 w-16 object-cover rounded"
                    />
                  )}
                <div className="flex-1 space-y-1">
                  <p className="font-medium">{resource.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {resource.fileName}
                  </p>
                  <div className="flex gap-2 text-xs text-muted-foreground">
                    <span className="capitalize">{resource.type}</span>
                    {resource.fileSize && (
                      <span>
                        •{" "}
                        {(resource.fileSize / 1024 / 1024).toFixed(2)} MB
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Delete Type Toggle */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-0.5">
                <Label htmlFor="permanent-delete" className="font-medium">
                  Permanent Delete
                </Label>
                <p className="text-sm text-muted-foreground">
                  Delete permanently instead of archiving
                </p>
              </div>
              <Switch
                id="permanent-delete"
                checked={permanent}
                onCheckedChange={setPermanent}
                disabled={loading}
              />
            </div>

            {permanent && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                <p className="text-sm text-destructive">
                  <strong>Note:</strong> Permanent deletion will remove:
                </p>
                <ul className="text-sm text-destructive/80 list-disc list-inside mt-2 space-y-1">
                  <li>Resource metadata from the database</li>
                  <li>File from cloud storage</li>
                  <li>All associated references</li>
                </ul>
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            disabled={loading}
            variant={permanent ? "destructive" : "default"}
          >
            {loading ? (
              <>
                <IconTrash className="h-4 w-4 mr-2 animate-pulse" />
                Deleting...
              </>
            ) : (
              <>
                <IconTrash className="h-4 w-4 mr-2" />
                {permanent ? "Delete Permanently" : "Archive Resource"}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
