import { useState } from "react";
import useResourceStore from "@/store/resourceStore";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  IconDotsVertical,
  IconEye,
  IconEdit,
  IconTrash,
  IconDownload,
  IconReplace,
  IconRestore,
  IconChevronLeft,
  IconChevronRight,
} from "@tabler/icons-react";
import { toast } from "sonner";
import { resourceAPI } from "@/lib/api";

export default function ResourceTable({
  onEdit,
  onView,
  onDelete,
  onReplaceFile,
  onBatchDelete,
}) {
  const {
    resources,
    currentPage,
    totalPages,
    totalResources,
    selectedResources,
    toggleResourceSelection,
    selectAllResources,
    clearSelection,
    setPage,
    setLimit,
    limit,
    isLoading,
  } = useResourceStore();

  const allSelected =
    resources.length > 0 && selectedResources.length === resources.length;
  const someSelected = selectedResources.length > 0 && !allSelected;

  const handleSelectAll = () => {
    if (allSelected) {
      clearSelection();
    } else {
      selectAllResources();
    }
  };

  const handleDownload = async (resource) => {
    try {
      const response = await resourceAPI.downloadResource(resource._id);
      const { downloadUrl } = response.data.data;
      window.open(downloadUrl, "_blank");
      toast.success("Download started");
    } catch (error) {
      toast.error("Failed to download resource");
    }
  };

  const handleRestore = async (resource) => {
    try {
      await resourceAPI.restoreResource(resource._id);
      toast.success("Resource restored successfully");
      window.location.reload();
    } catch (error) {
      toast.error("Failed to restore resource");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-primary text-primary-foreground";
      case "inactive":
        return "bg-secondary text-secondary-foreground";
      case "archived":
        return "bg-destructive text-destructive-foreground";
      case "processing":
        return "bg-accent text-accent-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getTypeColor = (type) => {
    const colors = {
      logo: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
      carousel: "bg-purple-500/10 text-purple-700 dark:text-purple-400",
      "event-banner": "bg-green-500/10 text-green-700 dark:text-green-400",
      flyer: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
      poster: "bg-pink-500/10 text-pink-700 dark:text-pink-400",
      "profile-picture": "bg-indigo-500/10 text-indigo-700 dark:text-indigo-400",
      "cover-image": "bg-cyan-500/10 text-cyan-700 dark:text-cyan-400",
      document: "bg-orange-500/10 text-orange-700 dark:text-orange-400",
      video: "bg-red-500/10 text-red-700 dark:text-red-400",
      audio: "bg-teal-500/10 text-teal-700 dark:text-teal-400",
      other: "bg-muted text-muted-foreground",
    };
    return colors[type] || colors.other;
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "N/A";
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getMetadataInfo = (metadata) => {
    if (!metadata) return "N/A";
    const parts = [];
    if (metadata.format) parts.push(metadata.format.toUpperCase());
    if (metadata.width && metadata.height) parts.push(`${metadata.width}×${metadata.height}`);
    return parts.join(" • ") || "N/A";
  };

  return (
    <Card>
      <CardContent className="p-0">
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-4">
            {selectedResources.length > 0 && (
              <>
                <span className="text-sm text-muted-foreground">
                  {selectedResources.length} selected
                </span>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={onBatchDelete}
                >
                  <IconTrash className="h-4 w-4 mr-2" />
                  Delete Selected
                </Button>
              </>
            )}
          </div>
          <div className="text-sm text-muted-foreground">
            Total: {totalResources} resources
          </div>
        </div>

        <div className="overflow-x-auto">
          <TooltipProvider>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={allSelected}
                      onCheckedChange={handleSelectAll}
                      aria-label="Select all"
                    />
                  </TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Format</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Public</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : resources.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8">
                    <p className="text-muted-foreground">No resources found</p>
                  </TableCell>
                </TableRow>
              ) : (
                resources.map((resource) => (
                  <TableRow key={resource._id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedResources.includes(resource._id)}
                        onCheckedChange={() =>
                          toggleResourceSelection(resource._id)
                        }
                        aria-label={`Select ${resource.title}`}
                      />
                    </TableCell>
                    <TableCell className="font-medium max-w-xs truncate">
                      <Tooltip>
                        <TooltipTrigger className="cursor-help">
                          {resource.title}
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">{resource.title}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={getTypeColor(resource.type)}
                      >
                        {resource.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Tooltip>
                        <TooltipTrigger className="text-sm cursor-help">
                          {getMetadataInfo(resource.metadata)}
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="space-y-1">
                            {resource.metadata?.format && (
                              <p>Format: {resource.metadata.format.toUpperCase()}</p>
                            )}
                            {resource.metadata?.width && resource.metadata?.height && (
                              <p>Dimensions: {resource.metadata.width} × {resource.metadata.height}px</p>
                            )}
                            {resource.metadata?.resourceType && (
                              <p>Type: {resource.metadata.resourceType}</p>
                            )}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(resource.status)}>
                        {resource.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{resource.priority || 0}</TableCell>
                    <TableCell>
                      <Tooltip>
                        <TooltipTrigger className="cursor-help">
                          {formatFileSize(resource.metadata?.bytes)}
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{resource.metadata?.bytes?.toLocaleString() || 0} bytes</p>
                        </TooltipContent>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      {resource.isPublic ? (
                        <Badge variant="outline" className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20">
                          Public
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-muted text-muted-foreground">
                          Private
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>{formatDate(resource.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <IconDotsVertical className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onView(resource)}>
                            <IconEye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onEdit(resource)}>
                            <IconEdit className="h-4 w-4 mr-2" />
                            Edit Metadata
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onReplaceFile(resource)}
                          >
                            <IconReplace className="h-4 w-4 mr-2" />
                            Replace File
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDownload(resource)}
                          >
                            <IconDownload className="h-4 w-4 mr-2" />
                            Download
                          </DropdownMenuItem>
                          {resource.status === "archived" ? (
                            <DropdownMenuItem
                              onClick={() => handleRestore(resource)}
                            >
                              <IconRestore className="h-4 w-4 mr-2" />
                              Restore
                            </DropdownMenuItem>
                          ) : (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => onDelete(resource)}
                                className="text-destructive focus:text-destructive"
                              >
                                <IconTrash className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          </TooltipProvider>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              Showing {resources.length > 0 ? ((currentPage - 1) * limit + 1) : 0} to{" "}
              {Math.min(currentPage * limit, totalResources)} of{" "}
              {totalResources} resources
            </div>
            
            <div className="flex items-center gap-4">
              {/* Rows per page selector */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Rows per page:</span>
                <select
                  className="h-8 rounded-md border border-input bg-background px-3 text-sm"
                  value={limit}
                  onChange={(e) => setLimit(Number(e.target.value))}
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>

              {/* Pagination buttons */}
              {totalPages > 1 && (
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(1)}
                    disabled={currentPage === 1}
                  >
                    First
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <IconChevronLeft className="h-4 w-4" />
                  </Button>
                  
                  {/* Page numbers */}
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? "default" : "outline"}
                          size="sm"
                          onClick={() => setPage(pageNum)}
                          className="w-9"
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <IconChevronRight className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(totalPages)}
                    disabled={currentPage === totalPages}
                  >
                    Last
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
