"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  IconFile,
  IconCalendar,
  IconTag,
  IconWorld,
  IconLink,
  IconBuilding,
  IconCalendarEvent,
  IconEye,
  IconDownload,
  IconExternalLink,
} from "@tabler/icons-react";

export default function ViewResourceDialog({ open, onOpenChange, resource }) {
  if (!resource) return null;

  const formatFileSize = (bytes) => {
    if (!bytes) return "N/A";
    const sizes = ["Bytes", "KB", "MB", "GB"];
    if (bytes === 0) return "0 Bytes";
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleDownload = () => {
    if (resource.fileUrl) {
      window.open(resource.fileUrl, "_blank");
    }
  };

  const handleOpenLink = () => {
    if (resource.link) {
      window.open(resource.link, "_blank");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IconFile className="h-5 w-5" />
            Resource Details
          </DialogTitle>
          <DialogDescription>
            Complete information about this resource
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Resource Preview */}
          {resource.fileUrl && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                Preview
              </h3>
              {resource.type && (
                <>
                  {resource.type.includes("image") && (
                    <div className="border rounded-lg overflow-hidden bg-muted flex items-center justify-center p-4">
                      <img
                        src={resource.fileUrl}
                        alt={resource.title}
                        className="max-h-64 object-contain rounded"
                      />
                    </div>
                  )}
                  {resource.type.includes("video") && (
                    <video
                      src={resource.fileUrl}
                      controls
                      className="w-full rounded-lg border"
                    />
                  )}
                  {resource.type.includes("audio") && (
                    <audio src={resource.fileUrl} controls className="w-full" />
                  )}
                </>
              )}
            </div>
          )}

          <Separator />

          {/* Title and Status */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Title
            </h3>
            <div className="flex items-start justify-between gap-2">
              <p className="text-lg font-semibold">{resource.title}</p>
              <div className="flex gap-2 flex-wrap">
                <Badge
                  variant={
                    resource.status === "active"
                      ? "default"
                      : resource.status === "inactive"
                      ? "secondary"
                      : "outline"
                  }
                >
                  {resource.status}
                </Badge>
                {resource.isPublic && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <IconWorld className="h-3 w-3" />
                    Public
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          {resource.description && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Description
              </h3>
              <p className="text-sm">{resource.description}</p>
            </div>
          )}

          <Separator />

          {/* File Information */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">
              File Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">File Name</p>
                <p className="text-sm font-medium break-all">
                  {resource.fileName || "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">File Type</p>
                <Badge variant="outline" className="capitalize">
                  {resource.type || "N/A"}
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">File Size</p>
                <p className="text-sm font-medium">
                  {formatFileSize(resource.fileSize)}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">MIME Type</p>
                <p className="text-xs font-medium font-mono">
                  {resource.mimeType || "N/A"}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Additional Information */}
          <div className="grid grid-cols-2 gap-4">
            {/* Tags */}
            {resource.tags && resource.tags.length > 0 && (
              <div className="col-span-2">
                <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                  <IconTag className="h-4 w-4" />
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {resource.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Priority */}
            {resource.priority !== undefined && resource.priority !== null && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Priority
                </h3>
                <p className="text-2xl font-bold">{resource.priority}</p>
              </div>
            )}

            {/* Views Count */}
            {resource.viewsCount !== undefined && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                  <IconEye className="h-4 w-4" />
                  Views
                </h3>
                <p className="text-2xl font-bold">{resource.viewsCount || 0}</p>
              </div>
            )}

            {/* Organization */}
            {resource.organizationId && (
              <div className="col-span-2">
                <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                  <IconBuilding className="h-4 w-4" />
                  Organization ID
                </h3>
                <code className="text-sm bg-muted px-2 py-1 rounded">
                  {resource.organizationId}
                </code>
              </div>
            )}

            {/* Event */}
            {resource.eventId && (
              <div className="col-span-2">
                <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                  <IconCalendarEvent className="h-4 w-4" />
                  Event ID
                </h3>
                <code className="text-sm bg-muted px-2 py-1 rounded">
                  {resource.eventId}
                </code>
              </div>
            )}

            {/* External Link */}
            {resource.link && (
              <div className="col-span-2">
                <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                  <IconLink className="h-4 w-4" />
                  External Link
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleOpenLink}
                  className="w-full justify-start"
                >
                  <IconExternalLink className="h-4 w-4 mr-2" />
                  <span className="truncate">{resource.link}</span>
                </Button>
              </div>
            )}
          </div>

          <Separator />

          {/* Timestamps */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
              <IconCalendar className="h-4 w-4" />
              Timestamps
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Created At</p>
                <p className="text-sm">{formatDate(resource.createdAt)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Updated At</p>
                <p className="text-sm">{formatDate(resource.updatedAt)}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          {resource.fileUrl && (
            <div className="flex gap-2 pt-4">
              <Button onClick={handleDownload} className="flex-1">
                <IconDownload className="h-4 w-4 mr-2" />
                Download/View File
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
