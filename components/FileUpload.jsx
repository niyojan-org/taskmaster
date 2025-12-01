"use client";
import { useState } from "react";
import { toast } from "sonner";
import api from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const FileUpload = ({ onFileUpload, folder }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewURL, setPreviewURL] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewURL(URL.createObjectURL(file));
      setShowConfirm(true);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    if (!folder) {
      toast.error("Folder is not specified.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("folder", folder);

    try {
      setIsUploading(true);
      const res = await api.post("/api/util/upload", formData);
      const data = res.data;

      if (res.status === 200) {
        toast.success("File uploaded successfully!");
        onFileUpload(data.url);
        setSelectedFile(null);
        setPreviewURL("");
        setShowConfirm(false);
      } else {
        toast.error("Upload failed: " + (data.error || "Unknown error."));
      }
    } catch (error) {
      console.error(error);
      toast.error("Upload failed: " + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="picture">Picture</Label>
      <Input id="picture" type="file" onChange={handleFileChange} />

      {isUploading ? "Uploading..." : "Upload file"}

      {/* Confirmation Dialog */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Upload</DialogTitle>
          </DialogHeader>
          <div className="flex gap-4 items-center">
            {previewURL && (
              <img
                src={previewURL}
                alt="Preview"
                className="rounded-md border h-32 object-contain"
              />
            )}
            <p className="text-sm text-slate-500">{selectedFile?.name}</p>
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setShowConfirm(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpload} disabled={isUploading}>
              {isUploading ? "Uploading..." : "Confirm Upload"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FileUpload;
