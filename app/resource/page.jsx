"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import useResourceStore from "@/store/resourceStore";
import { resourceAPI } from "@/lib/api";
import ResourceStats from "./components/ResourceStats";
import ResourceFilters from "./components/ResourceFilters";
import ResourceTable from "./components/ResourceTable";
import DeleteResourceDialog from "./components/DeleteResourceDialog";
import ReplaceFileDialog from "./components/ReplaceFileDialog";
import BatchDeleteDialog from "./components/BatchDeleteDialog";
import { Button } from "@/components/ui/button";
import { IconPlus, IconRefresh } from "@tabler/icons-react";

export default function ResourcePage() {
  const router = useRouter();
  const {
    resources,
    filters,
    currentPage,
    limit,
    setResources,
    setLoading,
    setError,
    isLoading,
  } = useResourceStore();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [replaceFileDialogOpen, setReplaceFileDialogOpen] = useState(false);
  const [batchDeleteDialogOpen, setBatchDeleteDialogOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit,
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== "")
        ),
      };

      const response = await resourceAPI.listResources(params);
      const { data, pagination } = response.data;

      setResources(
        data,
        pagination.total,
        pagination.page,
        pagination.pages
      );
    } catch (error) {
      setError(error.message);
      toast.error("Failed to fetch resources");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, [filters, currentPage, limit]);

  const handleCreateResource = () => {
    router.push("/resource/create");
  };

  const handleEditResource = (resource) => {
    router.push(`/resource/${resource._id}/edit`);
  };

  const handleViewResource = (resource) => {
    router.push(`/resource/${resource._id}`);
  };

  const handleDeleteResource = (resource) => {
    setSelectedResource(resource);
    setDeleteDialogOpen(true);
  };

  const handleReplaceFile = (resource) => {
    setSelectedResource(resource);
    setReplaceFileDialogOpen(true);
  };

  const handleBatchDelete = () => {
    setBatchDeleteDialogOpen(true);
  };

  return (
    <div className="container mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Resource Management
          </h1>
          <p className="text-muted-foreground">
            Manage all your files, images, and media resources
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={fetchResources}
            variant="outline"
            size="sm"
            disabled={isLoading}
          >
            <IconRefresh className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={handleCreateResource} size="sm">
            <IconPlus className="h-4 w-4 mr-2" />
            Upload Resource
          </Button>
        </div>
      </div>

      <ResourceStats />

      <ResourceFilters />

      <ResourceTable
        onEdit={handleEditResource}
        onView={handleViewResource}
        onDelete={handleDeleteResource}
        onReplaceFile={handleReplaceFile}
        onBatchDelete={handleBatchDelete}
      />

      <DeleteResourceDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        resource={selectedResource}
        onSuccess={fetchResources}
      />

      <ReplaceFileDialog
        open={replaceFileDialogOpen}
        onOpenChange={setReplaceFileDialogOpen}
        resource={selectedResource}
        onSuccess={fetchResources}
      />

      <BatchDeleteDialog
        open={batchDeleteDialogOpen}
        onOpenChange={setBatchDeleteDialogOpen}
        onSuccess={fetchResources}
      />
    </div>
  );
}
