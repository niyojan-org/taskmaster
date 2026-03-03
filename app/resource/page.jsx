"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import api from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { IconPlus, IconFileText } from "@tabler/icons-react";

// Import components
import ResourceStats from "./components/ResourceStats";
import ResourceFilters from "./components/ResourceFilters";
import ResourceCard from "./components/ResourceCard";
import EditResourceDialog from "./components/EditResourceDialog";
import DeleteResourceDialog from "./components/DeleteResourceDialog";

export default function ResourceDashboard() {
    const router = useRouter();
    const { user, isAuthenticated, authLoading } = useAuth();
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [limit] = useState(12);
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [stats, setStats] = useState(null);

    // Dialog states
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedResource, setSelectedResource] = useState(null);
    const [uploading, setUploading] = useState(false);

    const isAdmin = user?.role === "admin";

    // Fetch resources
    useEffect(() => {
        fetchResources();
    }, [page, categoryFilter]);

    // Calculate stats
    useEffect(() => {
        if (resources && resources.length > 0) {
            calculateStats();
        }
    }, [resources]);

    const fetchResources = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString(),
            });

            if (categoryFilter && categoryFilter !== "all") {
                params.append("category", categoryFilter);
            }

            if (searchQuery) {
                params.append("search", searchQuery);
            }

            const response = await api.get(`/util/resources?${params.toString()}`);

            if (response.data.success) {
                setResources(response.data.resources || []);
                setTotalPages(response.data.pages || 1);
                setTotalItems(response.data.total || 0);
            } else {
                setResources([]);
            }
        } catch (error) {
            console.error("Failed to fetch resources:", error);
            toast.error("Failed to load resources");
            setResources([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        setPage(1);
        fetchResources();
    };

    const calculateStats = () => {
        const stats = {
            total: totalItems,
            carousel: 0,
            poster: 0,
            banner: 0,
            logo: 0,
            active: 0,
        };

        resources.forEach((resource) => {
            const type = resource.type?.toLowerCase();
            if (type === 'carousel') {
                stats.carousel++;
            } else if (type === 'poster') {
                stats.poster++;
            } else if (type?.includes('banner')) {
                stats.banner++;
            } else if (type === 'logo') {
                stats.logo++;
            }
            if (resource.active) {
                stats.active++;
            }
        });

        setStats(stats);
    };

    const handleUpdateResource = async (formData, selectedFile) => {
        if (!selectedResource) return;

        try {
            setUploading(true);
            const formDataToSend = new FormData();

            if (selectedFile) {
                formDataToSend.append("file", selectedFile);
            }
            formDataToSend.append("name", formData.name);
            formDataToSend.append("description", formData.description);
            formDataToSend.append("category", formData.category);

            const response = await api.put(
                `/util/resources/${selectedResource._id}`,
                formDataToSend,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            if (response.data.success) {
                toast.success("Resource updated successfully");
                setEditDialogOpen(false);
                resetForm();
                setSelectedResource(null);
                fetchResources();
            }
        } catch (error) {
            console.error("Failed to update resource:", error);
            toast.error(
                error.response?.data?.message || "Failed to update resource"
            );
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteResource = async () => {
        if (!selectedResource) return;

        try {
            const response = await api.delete(
                `/util/resources/${selectedResource._id}`
            );

            if (response.data.success) {
                toast.success("Resource deleted successfully");
                setDeleteDialogOpen(false);
                setSelectedResource(null);
                fetchResources();
            }
        } catch (error) {
            console.error("Failed to delete resource:", error);
            toast.error(
                error.response?.data?.message || "Failed to delete resource"
            );
        }
    };

    const openEditDialog = (resource) => {
        setSelectedResource(resource);
        setEditDialogOpen(true);
    };

    const openDeleteDialog = (resource) => {
        setSelectedResource(resource);
        setDeleteDialogOpen(true);
    };

    if (authLoading) {
        return (
            <div className="container mx-auto p-6">
                <Skeleton className="h-12 w-64 mb-6" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                        <Skeleton key={i} className="h-64" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
            <div className="container mx-auto p-6 max-w-7xl">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="space-y-2">
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                                Resource Control Panel
                            </h1>
                            <p className="text-muted-foreground text-lg">
                                Manage all your website resources and media files
                            </p>
                        </div>
                        {isAuthenticated && isAdmin && (
                            <Button 
                                onClick={() => router.push("/resource/create")}
                                size="lg"
                                className="shadow-lg hover:shadow-xl transition-shadow"
                            >
                                <Plus className="mr-2 h-5 w-5" />
                                Create Resource
                            </Button>
                        )}
                    </div>
                </div>

                {/* Stats Dashboard */}
                {stats && <ResourceStats stats={stats} />}

                {/* Filters */}
                <div className="mb-6">
                    <ResourceFilters
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        categoryFilter={categoryFilter}
                        setCategoryFilter={setCategoryFilter}
                        onSearch={handleSearch}
                        onRefresh={fetchResources}
                    />
                </div>

                {/* Resources Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <Skeleton key={i} className="h-96 rounded-xl" />
                        ))}
                    </div>
                ) : !resources || resources.length === 0 ? (
                    <Card className="border-2 shadow-lg">
                        <CardContent className="flex flex-col items-center justify-center py-16">
                            <div className="bg-muted rounded-full p-6 mb-4">
                                <IconFileText className="h-16 w-16 text-muted-foreground" />
                            </div>
                            <p className="text-2xl font-semibold mb-2">No resources found</p>
                            <p className="text-muted-foreground mb-6 text-center max-w-md">
                                {isAdmin
                                    ? "Get started by creating your first resource"
                                    : "Check back later for new resources"}
                            </p>
                            {isAdmin && (
                                <Button 
                                    onClick={() => router.push("/resource/create")}
                                    size="lg"
                                >
                                    <IconPlus className="mr-2 h-5 w-5" />
                                    Create Your First Resource
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {resources.map((resource) => (
                                <ResourceCard
                                    key={resource.id}
                                    resource={resource}
                                    isAdmin={isAdmin}
                                    onEdit={openEditDialog}
                                    onDelete={openDeleteDialog}
                                />
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-muted/50 rounded-lg border-2">
                                <p className="text-sm text-muted-foreground">
                                    Showing <span className="font-semibold text-foreground">{(page - 1) * limit + 1}</span> to{" "}
                                    <span className="font-semibold text-foreground">{Math.min(page * limit, totalItems)}</span> of{" "}
                                    <span className="font-semibold text-foreground">{totalItems}</span> resources
                                </p>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                                        disabled={page === 1}
                                    >
                                        Previous
                                    </Button>
                                    <div className="flex items-center gap-2 px-3 py-1 bg-primary text-primary-foreground rounded-md text-sm font-medium">
                                        <span>Page {page} of {totalPages}</span>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                        disabled={page === totalPages}
                                    >
                                        Next
                                    </Button>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* Edit Resource Dialog */}
                <EditResourceDialog
                    open={editDialogOpen}
                    onOpenChange={setEditDialogOpen}
                    resource={selectedResource}
                    onUpdate={handleUpdateResource}
                    uploading={uploading}
                />

                {/* Delete Confirmation Dialog */}
                <DeleteResourceDialog
                    open={deleteDialogOpen}
                    onOpenChange={setDeleteDialogOpen}
                    resource={selectedResource}
                    onConfirm={handleDeleteResource}
                />
            </div>
        </div>
    );
}
