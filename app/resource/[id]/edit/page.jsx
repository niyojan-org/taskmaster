"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { resourceAPI } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { IconDeviceFloppy, IconArrowLeft } from "@tabler/icons-react";

export default function EditResourcePage() {
  const router = useRouter();
  const params = useParams();
  const resourceId = params.id;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: [],
    priority: "",
    isPublic: false,
    status: "active",
    link: "",
  });
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (resourceId) {
      fetchResource();
    }
  }, [resourceId]);

  const fetchResource = async () => {
    try {
      setFetching(true);
      const response = await resourceAPI.getResourceById(resourceId);
      const resourceData = response.data.data;
      setResource(resourceData);
      
      setFormData({
        title: resourceData.title || "",
        description: resourceData.description || "",
        tags: Array.isArray(resourceData.tags) ? resourceData.tags.join(", ") : "",
        priority: resourceData.priority?.toString() || "",
        isPublic: resourceData.isPublic || false,
        status: resourceData.status || "active",
        link: resourceData.link || "",
      });
    } catch (error) {
      console.error("Error fetching resource:", error);
      toast.error("Failed to load resource");
      router.push("/resource");
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.title || formData.title.trim().length === 0) {
      toast.error("Title is required");
      return;
    }

    if (formData.title.length > 120) {
      toast.error("Title must be less than 120 characters");
      return;
    }

    if (formData.description && formData.description.length > 500) {
      toast.error("Description must be less than 500 characters");
      return;
    }

    // Prepare data
    const data = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      tags: formData.tags
        ? formData.tags.split(",").map((tag) => tag.trim()).filter((tag) => tag)
        : [],
      isPublic: formData.isPublic,
      status: formData.status,
    };

    if (formData.priority) {
      data.priority = parseInt(formData.priority);
    }

    if (formData.link) {
      data.link = formData.link.trim();
    }

    try {
      setLoading(true);
      await resourceAPI.updateResource(resourceId, data);
      toast.success("Resource updated successfully");
      router.push("/resource");
    } catch (error) {
      console.error("Error updating resource:", error);
      toast.error(error.response?.data?.error || "Failed to update resource");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <Skeleton className="h-12 w-64 mb-6" />
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-96 mt-2" />
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.push("/resource")}
          className="mb-4"
        >
          <IconArrowLeft className="h-4 w-4 mr-2" />
          Back to Resources
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Edit Resource</h1>
        <p className="text-muted-foreground mt-2">
          Update resource metadata. To replace the file itself, use the Replace File action from the resource list.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Resource Information</CardTitle>
          <CardDescription>
            Update the details below to modify your resource
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Current File Info */}
          {resource && (
            <div className="p-4 bg-muted rounded-md mb-6 flex items-start gap-4">
              {resource.fileUrl && resource.type?.includes("image") && (
                <img
                  src={resource.fileUrl}
                  alt={resource.title}
                  className="h-20 w-20 object-cover rounded"
                />
              )}
              <div className="flex-1 text-sm">
                <p className="font-medium">{resource.fileName}</p>
                <p className="text-muted-foreground capitalize">
                  Type: {resource.type}
                </p>
                {resource.fileSize && (
                  <p className="text-muted-foreground">
                    Size: {(resource.fileSize / 1024 / 1024).toFixed(2)} MB
                  </p>
                )}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="edit-title">
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="Enter resource title"
                maxLength={120}
                disabled={loading}
              />
              <p className="text-xs text-muted-foreground">
                {formData.title.length}/120 characters
              </p>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, description: e.target.value }))
                }
                placeholder="Enter resource description"
                maxLength={500}
                rows={4}
                disabled={loading}
              />
              <p className="text-xs text-muted-foreground">
                {formData.description.length}/500 characters
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Tags */}
              <div className="space-y-2">
                <Label htmlFor="edit-tags">Tags</Label>
                <Input
                  id="edit-tags"
                  value={formData.tags}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, tags: e.target.value }))
                  }
                  placeholder="tag1, tag2, tag3"
                  disabled={loading}
                />
                <p className="text-xs text-muted-foreground">
                  Comma-separated, max 10 tags
                </p>
              </div>

              {/* Priority */}
              <div className="space-y-2">
                <Label htmlFor="edit-priority">Priority</Label>
                <Input
                  id="edit-priority"
                  type="number"
                  value={formData.priority}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, priority: e.target.value }))
                  }
                  placeholder="0"
                  disabled={loading}
                />
                <p className="text-xs text-muted-foreground">
                  Higher = more important
                </p>
              </div>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="edit-status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, status: value }))
                }
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Link */}
            <div className="space-y-2">
              <Label htmlFor="edit-link">External Link/CTA</Label>
              <Input
                id="edit-link"
                type="url"
                value={formData.link}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, link: e.target.value }))
                }
                placeholder="https://example.com"
                disabled={loading}
              />
            </div>

            {/* Is Public */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-0.5">
                <Label htmlFor="edit-isPublic">Public Access</Label>
                <p className="text-sm text-muted-foreground">
                  Make this resource publicly accessible
                </p>
              </div>
              <Switch
                id="edit-isPublic"
                checked={formData.isPublic}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, isPublic: checked }))
                }
                disabled={loading}
              />
            </div>

            <div className="flex gap-3 justify-end pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/resource")}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <IconDeviceFloppy className="h-4 w-4 mr-2 animate-pulse" />
                    Saving...
                  </>
                ) : (
                  <>
                    <IconDeviceFloppy className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
