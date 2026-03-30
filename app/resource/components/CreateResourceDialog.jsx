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
import { toast } from "sonner";
import { resourceAPI } from "@/lib/api";
import { IconUpload, IconX } from "@tabler/icons-react";

const initialFormData = {
  file: null,
  title: "",
  type: "",
  description: "",
  tags: "",
  priority: "",
  isPublic: false,
  organizationId: "",
  eventId: "",
  link: "",
};

const RESOURCE_TYPES = [
  { value: "logo", label: "Logo" },
  { value: "carousel", label: "Carousel" },
  { value: "event-banner", label: "Event Banner" },
  { value: "flyer", label: "Flyer" },
  { value: "poster", label: "Poster" },
  { value: "profile-picture", label: "Profile Picture" },
  { value: "cover-image", label: "Cover Image" },
  { value: "document", label: "Document" },
  { value: "video", label: "Video" },
  { value: "audio", label: "Audio" },
  { value: "other", label: "Other" },
];

export default function CreateResourceDialog({ open, onOpenChange, onSuccess }) {
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [previewURL, setPreviewURL] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, file }));
      
      // Create preview for images
      if (file.type.startsWith("image/")) {
        const url = URL.createObjectURL(file);
        setPreviewURL(url);
      } else {
        setPreviewURL(null);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.file) {
      toast.error("Please select a file to upload");
      return;
    }

    if (!formData.title || formData.title.trim().length === 0) {
      toast.error("Title is required");
      return;
    }

    if (formData.title.length > 120) {
      toast.error("Title must be less than 120 characters");
      return;
    }

    if (!formData.type) {
      toast.error("Resource type is required");
      return;
    }

    if (formData.description && formData.description.length > 500) {
      toast.error("Description must be less than 500 characters");
      return;
    }

    // Create FormData
    const data = new FormData();
    data.append("file", formData.file);
    data.append("title", formData.title.trim());
    data.append("type", formData.type);
    
    if (formData.description) {
      data.append("description", formData.description.trim());
    }
    
    if (formData.tags) {
      data.append("tags", formData.tags);
    }
    
    if (formData.priority) {
      data.append("priority", formData.priority);
    }
    
    // Only send isPublic when true (defaults to false on backend)
    if (formData.isPublic) {
      data.append("isPublic", "true");
    }
    
    if (formData.organizationId) {
      data.append("organizationId", formData.organizationId);
    }
    
    if (formData.eventId) {
      data.append("eventId", formData.eventId);
    }
    
    if (formData.link) {
      data.append("link", formData.link);
    }

    try {
      setLoading(true);
      await resourceAPI.createResource(data);
      toast.success("Resource uploaded successfully");
      handleClose();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error creating resource:", error);
      toast.error(error.response?.data?.error || "Failed to upload resource");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData(initialFormData);
    setPreviewURL(null);
    onOpenChange(false);
  };

  const removeFile = () => {
    setFormData((prev) => ({ ...prev, file: null }));
    setPreviewURL(null);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload New Resource</DialogTitle>
          <DialogDescription>
            Upload a new file with metadata. Supported files: images, videos, documents, and audio.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* File Upload */}
          <div className="space-y-2">
            <Label htmlFor="file">
              File <span className="text-red-500">*</span>
            </Label>
            <Input
              id="file"
              type="file"
              onChange={handleFileChange}
              disabled={loading}
              accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
            />
            {formData.file && (
              <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
                {previewURL && (
                  <img
                    src={previewURL}
                    alt="Preview"
                    className="h-16 w-16 object-cover rounded"
                  />
                )}
                <div className="flex-1 text-sm">
                  <p className="font-medium">{formData.file.name}</p>
                  <p className="text-muted-foreground">
                    {(formData.file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={removeFile}
                  disabled={loading}
                >
                  <IconX className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">
              Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
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

          {/* Type */}
          <div className="space-y-2">
            <Label htmlFor="type">
              Resource Type <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.type}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, type: value }))
              }
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select resource type" />
              </SelectTrigger>
              <SelectContent>
                {RESOURCE_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
              }
              placeholder="Enter resource description"
              maxLength={500}
              rows={3}
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground">
              {formData.description.length}/500 characters
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Tags */}
            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
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
              <Label htmlFor="priority">Priority</Label>
              <Input
                id="priority"
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

          <div className="grid grid-cols-2 gap-4">
            {/* Organization ID */}
            <div className="space-y-2">
              <Label htmlFor="organizationId">Organization ID</Label>
              <Input
                id="organizationId"
                value={formData.organizationId}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    organizationId: e.target.value,
                  }))
                }
                placeholder="Optional"
                disabled={loading}
              />
            </div>

            {/* Event ID */}
            <div className="space-y-2">
              <Label htmlFor="eventId">Event ID</Label>
              <Input
                id="eventId"
                value={formData.eventId}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, eventId: e.target.value }))
                }
                placeholder="Optional"
                disabled={loading}
              />
            </div>
          </div>

          {/* Link */}
          <div className="space-y-2">
            <Label htmlFor="link">External Link/CTA</Label>
            <Input
              id="link"
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
              <Label htmlFor="isPublic">Public Access</Label>
              <p className="text-sm text-muted-foreground">
                Make this resource publicly accessible
              </p>
            </div>
            <Switch
              id="isPublic"
              checked={formData.isPublic}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({ ...prev, isPublic: checked }))
              }
              disabled={loading}
            />
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
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <IconUpload className="h-4 w-4 mr-2 animate-pulse" />
                  Uploading...
                </>
              ) : (
                <>
                  <IconUpload className="h-4 w-4 mr-2" />
                  Upload Resource
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
