'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import useDomainStore from '@/store/domainStore';
import DomainStats from './components/DomainStats';
import DomainTable from './components/DomainTable';
import DomainFilters from './components/DomainFilters';
import CreateDomainDialog from './components/CreateDomainDialog';
import EditDomainDialog from './components/EditDomainDialog';
import DeleteDomainDialog from './components/DeleteDomainDialog';
import ViewDomainDialog from './components/ViewDomainDialog';
import { toast } from 'sonner';
import { IconPlus, IconRefresh, IconSearch } from '@tabler/icons-react';

export default function DomainManagementPage() {
    const {
        domains,
        loading,
        error,
        fetchDomains,
        getFilteredDomains,
        getStats,
        clearError,
    } = useDomainStore();

    const [searchQuery, setSearchQuery] = useState('');
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const [selectedDomain, setSelectedDomain] = useState(null);

    useEffect(() => {
        fetchDomains();
    }, [fetchDomains]);

    useEffect(() => {
        if (error) {
            toast.error(error);
            clearError();
        }
    }, [error, clearError]);

    const handleRefresh = () => {
        fetchDomains();
        toast.success('Domains refreshed');
    };

    const handleEdit = (domain) => {
        setSelectedDomain(domain);
        setEditDialogOpen(true);
    };

    const handleDelete = (domain) => {
        setSelectedDomain(domain);
        setDeleteDialogOpen(true);
    };

    const handleView = (domain) => {
        setSelectedDomain(domain);
        setViewDialogOpen(true);
    };

    // Get filtered domains
    const filteredDomains = getFilteredDomains();

    // Apply search query
    const searchedDomains = filteredDomains.filter((domain) =>
        domain.domain.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Get statistics
    const stats = getStats();

    return (
        <div className="container mx-auto space-y-6 pb-6">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between w-full">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Domain Management
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Manage and configure your domain settings
                    </p>
                </div>
                <div className="flex gap-2 w-full">
                    <Button
                        variant="outline"
                        onClick={handleRefresh}
                        disabled={loading}
                        size="default"
                        className="flex-1"
                    >
                        <IconRefresh className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                    <Button onClick={() => setCreateDialogOpen(true)} size="default" className="flex-1">
                        <IconPlus className="h-4 w-4 mr-2" />
                        Add Domain
                    </Button>
                </div>
            </div>

            {/* Statistics */}
            <DomainStats stats={stats} />

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Filters Sidebar */}
                <div className="lg:col-span-1">
                    <DomainFilters />
                </div>

                {/* Domains List */}
                <div className="lg:col-span-3 space-y-4">
                    {/* Search Bar */}
                    <div className="relative">
                        <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search domains..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    {/* Results Count */}
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>
                            Showing {searchedDomains.length} of {domains.length} domains
                        </span>
                    </div>

                    {/* Domains Table */}
                    {loading && domains.length === 0 ? (
                        <div className="flex items-center justify-center py-12">
                            <IconRefresh className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : (
                        <DomainTable
                            domains={searchedDomains}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onView={handleView}
                        />
                    )}
                </div>
            </div>

            {/* Dialogs */}
            <CreateDomainDialog
                open={createDialogOpen}
                onOpenChange={setCreateDialogOpen}
            />
            <EditDomainDialog
                open={editDialogOpen}
                onOpenChange={setEditDialogOpen}
                domain={selectedDomain}
            />
            <DeleteDomainDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                domain={selectedDomain}
            />
            <ViewDomainDialog
                open={viewDialogOpen}
                onOpenChange={setViewDialogOpen}
                domain={selectedDomain}
            />
        </div>
    );
}
