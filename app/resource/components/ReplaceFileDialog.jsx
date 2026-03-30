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
import { toast } from "sonner";
import { resourceAPI } from "@/lib/api";
import { IconUpload, IconX, IconFileArrowRight } from "@tabler/icons-react";

export default function ReplaceFileDialog({
  open,
  onOpenChange,
  resource,
  onSuccess,
}) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);

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

    if (!resource || !selectedFile) {
      toast.error("Please select a file to upload");
      return;
    }

    // Create FormData
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      setLoading(true);
      await resourceAPI.replaceResourceFile(resource._id, formData);
      toast.success("File replaced successfully");
      handleClose();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error replacing file:", error);
      toast.error(error.response?.data?.error || "Failed to replace file");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setPreviewURL(null);
    onOpenChange(false);
  };

  const removeFile = () => {
    setSelectedFile(null);
    setPreviewURL(null);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IconFileArrowRight className="h-5 w-5" />
            Replace Resource File
          </DialogTitle>
          <DialogDescription>
            Upload a new file to replace the existing one. The metadata will be
            preserved.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Current File Info */}
          {resource && (
            <div>
              <h3 className="text-sm font-medium mb-2">Current File</h3>
              <div className="p-3 bg-muted rounded-md flex items-start gap-3">
                {resource.fileUrl &&
                  resource.type &&
                  resource.type.includes("image") && (
                    <img
                      src={resource.fileUrl}
                      alt={resource.title}
                      className="h-16 w-16 object-cover rounded"
                    />
                  )}
                <div className="flex-1 text-sm">
                  <p className="font-medium">{resource.title}</p>
                  <p className="text-muted-foreground">{resource.fileName}</p>
                  <div className="flex gap-2 text-xs text-muted-foreground mt-1">
                    <span className="capitalize">{resource.type}</span>
                    {resource.fileSize && (
                      <span>
                        • {(resource.fileSize / 1024 / 1024).toFixed(2)} MB
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* New File Upload */}
          <div className="space-y-2">
            <Label htmlFor="new-file">
              New File <span className="text-red-500">*</span>
            </Label>
            <Input
              id="new-file"
              type="file"
              onChange={handleFileChange}
              disabled={loading}
              accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
            />
            <p className="text-xs text-muted-foreground">
              File must match the resource type. The old file will be deleted from
              cloud storage.
            </p>
          </div>

          {/* New File Preview */}
          {selectedFile && (
            <div>
              <h3 className="text-sm font-medium mb-2">New File Preview</h3>
              <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-md">
                {previewURL && (
                  <img
                    src={previewURL}
                    alt="New file preview"
                    className="h-16 w-16 object-cover rounded"
                  />
                )}
                <div className="flex-1 text-sm">
                  <p className="font-medium">{selectedFile.name}</p>
                  <p className="text-muted-foreground">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Type: {selectedFile.type}
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
            </div>
          )}

          {/* Warning */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
            <p className="text-sm text-orange-800">
              <strong>Warning:</strong> This action will:
            </p>
            <ul className="text-sm text-orange-700 list-disc list-inside mt-2 space-y-1">
              <li>Delete the old file from cloud storage</li>
              <li>Upload the new file</li>
              <li>Update the file URL and metadata</li>
              <li>Preserve the resource title, description, and other metadata</li>
            </ul>
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
            <Button type="submit" disabled={loading || !selectedFile}>
              {loading ? (
                <>
                  <IconUpload className="h-4 w-4 mr-2 animate-pulse" />
                  Replacing...
                </>
              ) : (
                <>
                  <IconUpload className="h-4 w-4 mr-2" />
                  Replace File
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
