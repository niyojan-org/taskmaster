"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import api from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  IconArrowLeft, 
  IconUpload, 
  IconRefresh, 
  IconX, 
  IconPhoto,
  IconCircleCheck,
  IconSparkles,
  IconLink,
  IconTag,
  IconAlertCircle
} from "@tabler/icons-react";

const RESOURCE_TYPES = [
  { value: 'logo', label: 'Logo', icon: '🎨', description: 'Brand logos and marks' },
  { value: 'carousel', label: 'Carousel', icon: '🎠', description: 'Rotating banner images' },
  { value: 'event-banner', label: 'Event Banner', icon: '🎪', description: 'Event promotional banners' },
  { value: 'flyer', label: 'Flyer', icon: '📄', description: 'Promotional flyers' },
  { value: 'poster', label: 'Poster', icon: '🖼️', description: 'Display posters' },
  { value: 'other', label: 'Other', icon: '📦', description: 'Other resource types' },
];

export default function CreateResourcePage() {
  const router = useRouter();
  const { user, isAuthenticated, authLoading } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "carousel",
    link: "",
    tags: "",
    priority: "1",
    active: true,
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewURL, setPreviewURL] = useState("");
  const [uploading, setUploading] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [tagList, setTagList] = useState([]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      // Create preview for images
      if (file.type.startsWith("image/")) {
        setPreviewURL(URL.createObjectURL(file));
      } else {
        setPreviewURL("");
      }
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewURL("");
  };

  const handleAddTag = () => {
    const tag = tagInput.trim();
    if (tag && !tagList.includes(tag)) {
      setTagList([...tagList, tag]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTagList(tagList.filter(tag => tag !== tagToRemove));
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      type: "carousel",
      link: "",
      tags: "",
      priority: "1",
      active: true,
    });
    setSelectedFile(null);
    setPreviewURL("");
    setTagList([]);
  };

  const handleCreateResource = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      toast.error("Please select a file");
      return;
    }

    if (!formData.title.trim()) {
      toast.error("Please enter a resource title");
      return;
    }

    try {
      setUploading(true);
      const formDataToSend = new FormData();
      formDataToSend.append("file", selectedFile);
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("type", formData.type);
      formDataToSend.append("link", formData.link);
      formDataToSend.append("tags", JSON.stringify(tagList));
      formDataToSend.append("priority", formData.priority);
      formDataToSend.append("active", formData.active);

      const response = await api.post("/util/resources", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        toast.success("Resource created successfully");
        resetForm();
        router.push("/resource");
      }
    } catch (error) {
      console.error("Failed to create resource:", error);
      toast.error(
        error.response?.data?.message || "Failed to create resource"
      );
    } finally {
      setUploading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20">
        <div className="text-center">
          <IconRefresh className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-7xl">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push("/resource")}
            className="mb-4 hover:bg-primary/10"
          >
            <IconArrowLeft className="mr-2 h-4 w-4" />
            Back to Resources
          </Button>
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Create New Resource
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg">
              Upload and configure a new resource for your website
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleCreateResource}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - File Upload & Preview */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="border-2 shadow-lg sticky top-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <IconUpload className="h-5 w-5" />
                    File Upload
                  </CardTitle>
                  <CardDescription>
                    Upload your resource file (max 10MB)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!selectedFile ? (
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                      <input
                        id="file"
                        type="file"
                        onChange={handleFileChange}
                        disabled={uploading}
                        className="hidden"
                        accept="image/*"
                      />
                      <label
                        htmlFor="file"
                        className="cursor-pointer flex flex-col items-center gap-3"
                      >
                        <div className="bg-primary/10 p-4 rounded-full">
                          <IconPhoto className="h-8 w-8 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium mb-1">Click to upload</p>
                          <p className="text-xs text-muted-foreground">
                            PNG, JPG, GIF up to 10MB
                          </p>
                        </div>
                      </label>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Preview */}
                      {previewURL ? (
                        <div className="relative group rounded-lg overflow-hidden border-2">
                          <img
                            src={previewURL}
                            alt="Preview"
                            className="w-full h-auto max-h-64 object-contain bg-muted"
                          />
                          <button
                            type="button"
                            onClick={handleRemoveFile}
                            className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <IconX className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="border-2 rounded-lg p-6 bg-muted/50">
                          <IconPhoto className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-sm text-center text-muted-foreground">
                            No preview available
                          </p>
                        </div>
                      )}
                      
                      {/* File Info */}
                      <div className="bg-muted/50 rounded-lg p-3 space-y-1">
                        <p className="text-sm font-medium truncate">
                          {selectedFile.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>

                      {/* Change File */}
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleRemoveFile}
                        className="w-full"
                        disabled={uploading}
                      >
                        <IconX className="h-4 w-4 mr-2" />
                        Remove File
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Form Fields */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <Card className="border-2 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <IconSparkles className="h-5 w-5" />
                    Basic Information
                  </CardTitle>
                  <CardDescription>
                    Essential details about your resource
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Title */}
                    <div className="md:col-span-2 space-y-2">
                      <Label htmlFor="title" className="flex items-center gap-2">
                        Title <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                        placeholder="Enter a descriptive title"
                        disabled={uploading}
                        required
                        className="h-11"
                      />
                    </div>

                    {/* Resource Type */}
                    <div className="space-y-2">
                      <Label htmlFor="type" className="flex items-center gap-2">
                        Resource Type <span className="text-destructive">*</span>
                      </Label>
                      <Select
                        value={formData.type}
                        onValueChange={(value) =>
                          setFormData({ ...formData, type: value })
                        }
                        disabled={uploading}
                      >
                        <SelectTrigger className="h-11">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {RESOURCE_TYPES.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              <div className="flex items-center gap-2">
                                <span>{type.icon}</span>
                                <div>
                                  <div className="font-medium">{type.label}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {type.description}
                                  </div>
                                </div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Priority */}
                    <div className="space-y-2">
                      <Label htmlFor="priority">Priority</Label>
                      <Input
                        id="priority"
                        type="number"
                        min="1"
                        max="100"
                        value={formData.priority}
                        onChange={(e) =>
                          setFormData({ ...formData, priority: e.target.value })
                        }
                        disabled={uploading}
                        className="h-11"
                      />
                    </div>

                    {/* Description */}
                    <div className="md:col-span-2 space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({ ...formData, description: e.target.value })
                        }
                        placeholder="Provide additional context about this resource"
                        disabled={uploading}
                        rows={4}
                        className="resize-none"
                      />
                    </div>

                    {/* Link */}
                    <div className="md:col-span-2 space-y-2">
                      <Label htmlFor="link" className="flex items-center gap-2">
                        <IconLink className="h-4 w-4" />
                        External Link (Optional)
                      </Label>
                      <Input
                        id="link"
                        type="url"
                        value={formData.link}
                        onChange={(e) =>
                          setFormData({ ...formData, link: e.target.value })
                        }
                        placeholder="https://example.com"
                        disabled={uploading}
                        className="h-11"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tags & Status */}
              <Card className="border-2 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <IconTag className="h-5 w-5" />
                    Tags & Status
                  </CardTitle>
                  <CardDescription>
                    Add tags for better organization
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Tags Input */}
                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags</Label>
                    <div className="flex gap-2">
                      <Input
                        id="tags"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddTag();
                          }
                        }}
                        placeholder="Type a tag and press Enter"
                        disabled={uploading}
                        className="h-11"
                      />
                      <Button
                        type="button"
                        onClick={handleAddTag}
                        variant="secondary"
                        disabled={uploading || !tagInput.trim()}
                      >
                        Add
                      </Button>
                    </div>
                  </div>

                  {/* Tag List */}
                  {tagList.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {tagList.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="pl-3 pr-1 py-1.5 text-sm"
                        >
                          #{tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="ml-2 hover:bg-destructive/20 rounded-full p-0.5"
                          >
                            <IconX className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Active Status */}
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <IconCircleCheck className={`h-5 w-5 ${formData.active ? 'text-green-500' : 'text-muted-foreground'}`} />
                      <div>
                        <Label className="cursor-pointer">Active Status</Label>
                        <p className="text-xs text-muted-foreground">
                          {formData.active ? 'Resource is active and visible' : 'Resource is inactive'}
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant={formData.active ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFormData({ ...formData, active: !formData.active })}
                      disabled={uploading}
                    >
                      {formData.active ? 'Active' : 'Inactive'}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <Card className="border-2 shadow-lg bg-muted/30">
                <CardContent className="pt-6">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.push("/resource")}
                      disabled={uploading}
                      className="flex-1 h-12"
                    >
                      <IconX className="mr-2 h-4 w-4" />
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={uploading || !selectedFile || !formData.title} 
                      className="flex-1 h-12 text-base font-semibold"
                    >
                      {uploading ? (
                        <>
                          <IconRefresh className="mr-2 h-5 w-5 animate-spin" />
                          Creating Resource...
                        </>
                      ) : (
                        <>
                          <IconUpload className="mr-2 h-5 w-5" />
                          Create Resource
                        </>
                      )}
                    </Button>
                  </div>
                  {(!selectedFile || !formData.title) && (
                    <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
                      <IconAlertCircle className="h-4 w-4" />
                      <span>Please upload a file and enter a title to continue</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
