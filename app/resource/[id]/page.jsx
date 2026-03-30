"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { resourceAPI } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  IconArrowLeft,
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
  IconEdit,
  IconTrash,
} from "@tabler/icons-react";

export default function ViewResourcePage() {
  const router = useRouter();
  const params = useParams();
  const resourceId = params.id;

  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (resourceId) {
      fetchResource();
    }
  }, [resourceId]);

  const fetchResource = async () => {
    try {
      setLoading(true);
      const response = await resourceAPI.getResourceById(resourceId);
      setResource(response.data.data);
    } catch (error) {
      console.error("Error fetching resource:", error);
      toast.error("Failed to load resource");
      router.push("/resource");
    } finally {
      setLoading(false);
    }
  };

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
    if (resource?.fileUrl) {
      window.open(resource.fileUrl, "_blank");
    }
  };

  const handleOpenLink = () => {
    if (resource?.link) {
      window.open(resource.link, "_blank");
    }
  };

  const handleEdit = () => {
    router.push(`/resource/${resourceId}/edit`);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 max-w-5xl">
        <Skeleton className="h-12 w-64 mb-6" />
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!resource) {
    return null;
  }

  return (
    <div className="container mx-auto max-w-5xl">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.push("/resource")}
          className="mb-4"
        >
          <IconArrowLeft className="h-4 w-4 mr-2" />
          Back to Resources
        </Button>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <IconFile className="h-8 w-8" />
              Resource Details
            </h1>
            <p className="text-muted-foreground mt-2">
              Complete information about this resource
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleEdit}>
              <IconEdit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Resource Preview */}
        {resource.fileUrl && (
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent>
              {resource.type && (
                <>
                  {resource.type.includes("image") && (
                    <div className="border rounded-lg overflow-hidden bg-muted flex items-center justify-center p-4">
                      <img
                        src={resource.fileUrl}
                        alt={resource.title}
                        className="max-h-96 object-contain rounded"
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
                  {!resource.type.includes("image") &&
                    !resource.type.includes("video") &&
                    !resource.type.includes("audio") && (
                      <div className="p-8 text-center border rounded-lg bg-muted">
                        <IconFile className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground">
                          Preview not available for this file type
                        </p>
                      </div>
                    )}
                </>
              )}
            </CardContent>
          </Card>
        )}

        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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

            {resource.description && (
              <>
                <Separator />
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    Description
                  </h3>
                  <p className="text-sm">{resource.description}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* File Information */}
        <Card>
          <CardHeader>
            <CardTitle>File Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </CardContent>
        </Card>

        {/* Additional Information */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Tags */}
              {resource.tags && resource.tags.length > 0 && (
                <div className="md:col-span-2">
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
                <div className="md:col-span-2">
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
                <div className="md:col-span-2">
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
                <div className="md:col-span-2">
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
          </CardContent>
        </Card>

        {/* Timestamps */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconCalendar className="h-5 w-5" />
              Timestamps
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Created At</p>
                <p className="text-sm">{formatDate(resource.createdAt)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Updated At</p>
                <p className="text-sm">{formatDate(resource.updatedAt)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        {resource.fileUrl && (
          <div className="flex gap-3">
            <Button onClick={handleDownload} className="flex-1">
              <IconDownload className="h-4 w-4 mr-2" />
              Download/View File
            </Button>
            <Button onClick={handleEdit} variant="outline" className="flex-1">
              <IconEdit className="h-4 w-4 mr-2" />
              Edit Resource
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
