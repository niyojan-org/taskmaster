'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { X, Filter } from 'lucide-react';
import useDomainStore from '@/store/domainStore';

export default function DomainFilters() {
    const { filters, setFilters } = useDomainStore();

    const handleReset = () => {
        setFilters({
            environment: 'all',
            purpose: 'all',
            isActive: 'all',
        });
    };

    const hasActiveFilters =
        filters.environment !== 'all' ||
        filters.purpose !== 'all' ||
        filters.isActive !== 'all';

    return (
        <Card className='gap-2'>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-base flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Filters
                </CardTitle>
                {hasActiveFilters && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleReset}
                        className="h-8 px-2 lg:px-3"
                    >
                        <X className="h-4 w-4 mr-1" />
                        Reset
                    </Button>
                )}
            </CardHeader>
            <CardContent className="space-y-4 flex flex-wrap justify-between">
                {/* Environment Filter */}
                <div className="space-y-2">
                    <Label htmlFor="environment-filter">Environment</Label>
                    <Select
                        value={filters.environment}
                        onValueChange={(value) => setFilters({ environment: value })}
                    >
                        <SelectTrigger id="environment-filter">
                            <SelectValue placeholder="All Environments" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Environments</SelectItem>
                            <SelectItem value="development">Development</SelectItem>
                            <SelectItem value="staging">Staging</SelectItem>
                            <SelectItem value="production">Production</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Purpose Filter */}
                <div className="space-y-2">
                    <Label htmlFor="purpose-filter">Purpose</Label>
                    <Select
                        value={filters.purpose}
                        onValueChange={(value) => setFilters({ purpose: value })}
                    >
                        <SelectTrigger id="purpose-filter">
                            <SelectValue placeholder="All Purposes" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Purposes</SelectItem>
                            <SelectItem value="cors">CORS</SelectItem>
                            <SelectItem value="oauth">OAuth</SelectItem>
                            <SelectItem value="api">API</SelectItem>
                            <SelectItem value="passkey">Passkey</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Status Filter */}
                <div className="space-y-2">
                    <Label htmlFor="status-filter">Status</Label>
                    <Select
                        value={filters.isActive}
                        onValueChange={(value) => setFilters({ isActive: value })}
                    >
                        <SelectTrigger id="status-filter">
                            <SelectValue placeholder="All Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardContent>
        </Card>
    );
}
