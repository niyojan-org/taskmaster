'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Building2, 
  Search, 
  Filter, 
  RefreshCw, 
  ChevronLeft, 
  ChevronRight,
  Eye,
  MapPin,
  Mail,
  Phone,
  Globe,
  Calendar,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Users
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

export default function OrganizationManagePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});
  
  // Filter states
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    verified: searchParams.get('verified') || '',
    isBlocked: searchParams.get('isBlocked') || '',
    riskLevel: searchParams.get('riskLevel') || '',
    sortBy: searchParams.get('sortBy') || 'createdAt',
    sortOrder: searchParams.get('sortOrder') || 'desc',
    page: parseInt(searchParams.get('page')) || 1,
    limit: parseInt(searchParams.get('limit')) || 10
  });

  const fetchOrganizations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== '' && value !== null && value !== undefined) {
          queryParams.append(key, value);
        }
      });

      const response = await api.get(`/tm/org?${queryParams.toString()}`);
      
      if (response.data.success) {
        setOrganizations(response.data.docs);
        setPagination({
          totalDocs: response.data.totalDocs,
          limit: response.data.limit,
          totalPages: response.data.totalPages,
          page: response.data.page,
          hasPrevPage: response.data.hasPrevPage,
          hasNextPage: response.data.hasNextPage,
          prevPage: response.data.prevPage,
          nextPage: response.data.nextPage
        });
      } else {
        setError(response.data.message || 'Failed to fetch organizations');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error fetching organizations';
      setError(errorMessage);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value, page: 1 };
    setFilters(newFilters);
    updateURL(newFilters);
  };

  const handlePageChange = (newPage) => {
    const newFilters = { ...filters, page: newPage };
    setFilters(newFilters);
    updateURL(newFilters);
    fetchOrganizations();
  };

  const updateURL = (newFilters) => {
    const queryParams = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        queryParams.append(key, value);
      }
    });
    router.push(`/org/manage?${queryParams.toString()}`);
  };

  const handleSearch = () => {
    fetchOrganizations();
  };

  const handleReset = () => {
    const resetFilters = {
      search: '',
      category: '',
      verified: '',
      isBlocked: '',
      riskLevel: '',
      sortBy: 'createdAt',
      sortOrder: 'desc',
      page: 1,
      limit: 10
    };
    setFilters(resetFilters);
    updateURL(resetFilters);
    fetchOrganizations();
  };

  const OrganizationCard = ({ org }) => (
    <Card className="hover:shadow-lg transition-shadow cursor-default">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {org.logo && (
              <img 
                src={org.logo} 
                alt={`${org.name} logo`}
                className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
              />
            )}
            <div>
              <CardTitle className="text-lg">{org.name}</CardTitle>
              <CardDescription>@{org.slug}</CardDescription>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <Badge variant={org.verified ? "default" : "secondary"} className="cursor-default">
              {org.verified ? 'Verified' : 'Unverified'}
            </Badge>
            <Badge variant={org.isBlocked ? "destructive" : "default"} className="cursor-default">
              {org.isBlocked ? 'Blocked' : 'Active'}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-gray-500" />
              <span className="truncate">{org.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-500" />
              <span>{org.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-gray-500" />
              <span className="truncate">{org.category} - {org.subCategory}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span className="truncate">{org.address?.city}, {org.address?.state}</span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2 border-t">
            <div className="text-center">
              <div className="font-semibold text-blue-600">{org.stats?.totalEventsHosted || 0}</div>
              <div className="text-xs text-gray-600">Events</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-green-600">{org.stats?.totalTicketsSold || 0}</div>
              <div className="text-xs text-gray-600">Tickets</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-yellow-600">₹{org.stats?.totalRevenueGenerated || 0}</div>
              <div className="text-xs text-gray-600">Revenue</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-red-600">{org.stats?.totalWarnings || 0}</div>
              <div className="text-xs text-gray-600">Warnings</div>
            </div>
          </div>

          {/* Risk & Trust */}
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Risk Level:</span>
              <Badge variant={
                org.riskLevel === 'high' ? 'destructive' : 
                org.riskLevel === 'medium' ? 'secondary' : 'default'
              } className="cursor-default">
                {org.riskLevel}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Trust Score:</span>
              <span className="font-semibold">{org.trustScore}/100</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-3 border-t">
            <div className="text-xs text-gray-500">
              Created: {new Date(org.createdAt).toLocaleDateString()}
            </div>
            <Link href={`/org/manage/${org._id}`}>
              <Button size="sm" className="cursor-pointer">
                <Eye className="w-4 h-4 mr-1" />
                Manage
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Organization Management</h1>
            <p className="text-gray-600">Loading organizations...</p>
          </div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-2xl mx-auto">
          <div className="text-center py-12">
            <XCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Organizations</h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <Button onClick={fetchOrganizations} className="bg-blue-600 hover:bg-blue-700 cursor-pointer">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Organization Management</h1>
          <p className="text-gray-600">
            {pagination.totalDocs} organizations found
          </p>
        </div>
        <Button onClick={fetchOrganizations} variant="outline" className="flex items-center gap-2 cursor-pointer">
          <RefreshCw className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <Card className="w-full">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Filter className="h-6 w-6" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {/* Search */}
            <div className="space-y-3">
              <Label htmlFor="search" className="text-sm font-medium">Search</Label>
              <div className="flex gap-3 w-full">
                <Input
                  id="search"
                  placeholder="Search organizations..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="flex-1"
                />
                <Button onClick={handleSearch} size="default" className="cursor-pointer px-4">
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Category */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Category</Label>
              <Select value={filters.category || 'all'} onValueChange={(value) => handleFilterChange('category', value === 'all' ? '' : value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="startup">Startup</SelectItem>
                  <SelectItem value="government">Government</SelectItem>
                  <SelectItem value="ngo">NGO</SelectItem>
                  <SelectItem value="educational">Educational</SelectItem>
                  <SelectItem value="corporate">Corporate</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Verified Status */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Verification Status</Label>
              <Select value={filters.verified || 'all'} onValueChange={(value) => handleFilterChange('verified', value === 'all' ? '' : value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="true">Verified</SelectItem>
                  <SelectItem value="false">Unverified</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Risk Level */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Risk Level</Label>
              <Select value={filters.riskLevel || 'all'} onValueChange={(value) => handleFilterChange('riskLevel', value === 'all' ? '' : value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All Levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Block Status */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Block Status</Label>
              <Select value={filters.isBlocked || 'all'} onValueChange={(value) => handleFilterChange('isBlocked', value === 'all' ? '' : value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All Organizations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Organizations</SelectItem>
                  <SelectItem value="false">Active</SelectItem>
                  <SelectItem value="true">Blocked</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sort By */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Sort By</Label>
              <Select value={filters.sortBy} onValueChange={(value) => handleFilterChange('sortBy', value)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt">Created Date</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="trustScore">Trust Score</SelectItem>
                  <SelectItem value="totalEventsHosted">Events Hosted</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sort Order */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Sort Order</Label>
              <Select value={filters.sortOrder} onValueChange={(value) => handleFilterChange('sortOrder', value)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">Descending</SelectItem>
                  <SelectItem value="asc">Ascending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
            <Button onClick={handleSearch} className="cursor-pointer flex-1 sm:flex-none sm:px-8">
              Apply Filters
            </Button>
            <Button onClick={handleReset} variant="outline" className="cursor-pointer flex-1 sm:flex-none sm:px-8">
              Reset All
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Organizations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {organizations.map((org) => (
          <OrganizationCard key={org._id} org={org} />
        ))}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.totalDocs)} of {pagination.totalDocs} results
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => handlePageChange(pagination.prevPage)}
              disabled={!pagination.hasPrevPage}
              variant="outline"
              size="sm"
              className="cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                const pageNum = pagination.page - 2 + i;
                if (pageNum < 1 || pageNum > pagination.totalPages) return null;
                
                return (
                  <Button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    variant={pageNum === pagination.page ? "default" : "outline"}
                    size="sm"
                    className="cursor-pointer"
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>

            <Button
              onClick={() => handlePageChange(pagination.nextPage)}
              disabled={!pagination.hasNextPage}
              variant="outline"
              size="sm"
              className="cursor-pointer"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {organizations.length === 0 && !loading && (
        <div className="text-center py-12">
          <Building2 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Organizations Found</h3>
          <p className="text-gray-500 mb-4">
            {filters.search || filters.category || filters.verified || filters.isBlocked || filters.riskLevel
              ? 'Try adjusting your filters to see more results.'
              : 'No organizations have been registered yet.'}
          </p>
          {(filters.search || filters.category || filters.verified || filters.isBlocked || filters.riskLevel) && (
            <Button onClick={handleReset} variant="outline" className="cursor-pointer">
              Clear Filters
            </Button>
          )}
        </div>
      )}
    </div>
  );
}