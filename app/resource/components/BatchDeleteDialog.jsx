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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { resourceAPI } from "@/lib/api";
import useResourceStore from "@/store/resourceStore";
import { IconAlertTriangle, IconTrash } from "@tabler/icons-react";

export default function BatchDeleteDialog({ open, onOpenChange, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [permanent, setPermanent] = useState(false);
  const { resources, selectedResources, clearSelection } = useResourceStore();

  // Get selected resource objects
  const selectedResourceObjects = resources.filter((r) =>
    selectedResources.includes(r._id)
  );

  const handleBatchDelete = async () => {
    if (selectedResources.length === 0) {
      toast.error("No resources selected");
      return;
    }

    if (selectedResources.length > 50) {
      toast.error("Cannot delete more than 50 resources at once");
      return;
    }

    try {
      setLoading(true);
      const response = await resourceAPI.batchDeleteResources(
        selectedResources,
        permanent
      );
      
      const { deletedCount, errors } = response.data.data || {};
      
      if (errors && errors.length > 0) {
        toast.error(`Deleted ${deletedCount} resources, ${errors.length} failed`);
      } else {
        toast.success(
          permanent
            ? `${deletedCount} resources permanently deleted`
            : `${deletedCount} resources archived successfully`
        );
      }
      
      clearSelection();
      setPermanent(false);
      onOpenChange(false);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error batch deleting resources:", error);
      toast.error(error.response?.data?.error || "Failed to delete resources");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setPermanent(false);
    onOpenChange(false);
  };

  const getTotalSize = () => {
    return selectedResourceObjects.reduce(
      (total, resource) => total + (resource.fileSize || 0),
      0
    );
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 MB";
    const sizes = ["Bytes", "KB", "MB", "GB"];
    if (bytes === 0) return "0 Bytes";
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
  };

  const getTypeStats = () => {
    const typeCount = {};
    selectedResourceObjects.forEach((resource) => {
      const type = resource.type || "unknown";
      typeCount[type] = (typeCount[type] || 0) + 1;
    });
    return typeCount;
  };

  const typeStats = getTypeStats();

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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
              {permanent ? "Permanently Delete" : "Archive"} Multiple Resources
            </DialogTitle>
          </div>
          <DialogDescription className="pt-4">
            {permanent ? (
              <>
                <strong className="text-destructive">Warning: </strong>
                This will permanently delete {selectedResources.length} resource
                {selectedResources.length !== 1 ? "s" : ""} and remove all files
                from cloud storage. This action cannot be undone.
              </>
            ) : (
              <>
                This will archive {selectedResources.length} resource
                {selectedResources.length !== 1 ? "s" : ""}. You can restore them
                later if needed.
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-muted p-3 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Total Resources</p>
              <p className="text-2xl font-bold">{selectedResources.length}</p>
            </div>
            <div className="bg-muted p-3 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Total Size</p>
              <p className="text-2xl font-bold">{formatFileSize(getTotalSize())}</p>
            </div>
            <div className="bg-muted p-3 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Types</p>
              <p className="text-2xl font-bold">{Object.keys(typeStats).length}</p>
            </div>
          </div>

          <Separator />

          {/* Resource Types Breakdown */}
          <div>
            <h3 className="text-sm font-medium mb-2">Resource Types</h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(typeStats).map(([type, count]) => (
                <Badge key={type} variant="secondary" className="capitalize">
                  {type}: {count}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Resource List */}
          <div>
            <h3 className="text-sm font-medium mb-2">Selected Resources</h3>
            <div className="max-h-64 overflow-y-auto space-y-2 border rounded-lg p-2">
              {selectedResourceObjects.map((resource) => (
                <div
                  key={resource._id}
                  className="flex items-center gap-2 p-2 bg-muted rounded-md"
                >
                  {resource.fileUrl &&
                    resource.type &&
                    resource.type.includes("image") && (
                      <img
                        src={resource.fileUrl}
                        alt={resource.title}
                        className="h-10 w-10 object-cover rounded"
                      />
                    )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {resource.title}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {resource.fileName}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="capitalize text-xs">
                      {resource.type}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delete Type Toggle */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-0.5">
              <Label htmlFor="batch-permanent-delete" className="font-medium">
                Permanent Delete
              </Label>
              <p className="text-sm text-muted-foreground">
                Delete permanently instead of archiving
              </p>
            </div>
            <Switch
              id="batch-permanent-delete"
              checked={permanent}
              onCheckedChange={setPermanent}
              disabled={loading}
            />
          </div>

          {/* Warning */}
          {permanent ? (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
              <p className="text-sm text-destructive">
                <strong>Note:</strong> Permanent deletion will remove:
              </p>
              <ul className="text-sm text-destructive/80 list-disc list-inside mt-2 space-y-1">
                <li>All resource metadata from the database</li>
                <li>All files from cloud storage</li>
                <li>All associated references</li>
                <li>This action is irreversible</li>
              </ul>
            </div>
          ) : (
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
              <p className="text-sm text-primary">
                <strong>Note:</strong> Archiving will:
              </p>
              <ul className="text-sm text-primary/80 list-disc list-inside mt-2 space-y-1">
                <li>Set resource status to "archived"</li>
                <li>Keep files in cloud storage</li>
                <li>Allow restoration later</li>
              </ul>
            </div>
          )}
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
          <Button
            onClick={handleBatchDelete}
            disabled={loading || selectedResources.length === 0}
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
                {permanent
                  ? `Delete ${selectedResources.length} Permanently`
                  : `Archive ${selectedResources.length} Resources`}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
