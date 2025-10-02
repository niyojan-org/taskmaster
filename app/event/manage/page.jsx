"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, Calendar, Tag, Building2, Star, Ban, AlertTriangle, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function EventManagePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});

  // Filter states
  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    category: searchParams.get("category") || "",
    status: searchParams.get("status") || "",
    isBlocked: searchParams.get("isBlocked") || "",
    featured: searchParams.get("featured") || "",
    fraudulent: searchParams.get("fraudulent") || "",
    orgId: searchParams.get("orgId") || "",
    sortBy: searchParams.get("sortBy") || "createdAt",
    sortOrder: searchParams.get("sortOrder") || "desc",
    page: parseInt(searchParams.get("page")) || 1,
    limit: parseInt(searchParams.get("limit")) || 10,
  });

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== "" && value !== null && value !== undefined) {
          queryParams.append(key, value);
        }
      });
      const response = await api.get(`/tm/event?${queryParams.toString()}`);
      if (response.data.success) {
        setEvents(response.data.events.docs);
        setPagination({
          totalDocs: response.data.events.totalDocs,
          limit: response.data.events.limit,
          totalPages: response.data.events.totalPages,
          page: response.data.events.page,
          hasPrevPage: response.data.events.hasPrevPage,
          hasNextPage: response.data.events.hasNextPage,
          prevPage: response.data.events.prevPage,
          nextPage: response.data.events.nextPage,
        });
      } else {
        setError(response.data.message || "Failed to fetch events");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
    // eslint-disable-next-line
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
    fetchEvents();
  };

  const updateURL = (newFilters) => {
    const queryParams = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== "" && value !== null && value !== undefined) {
        queryParams.append(key, value);
      }
    });
    router.push(`/event?page=${newFilters.page}&${queryParams.toString()}`);
  };

  const handleSearch = () => {
    fetchEvents();
  };

  const handleReset = () => {
    const resetFilters = {
      search: "",
      category: "",
      status: "",
      isBlocked: "",
      featured: "",
      fraudulent: "",
      orgId: "",
      sortBy: "createdAt",
      sortOrder: "desc",
      page: 1,
      limit: 10,
    };
    setFilters(resetFilters);
    updateURL(resetFilters);
    fetchEvents();
  };

  const EventCard = ({ event }) => (
    <Card className="hover:shadow-lg transition-shadow cursor-default">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {event.bannerImage ? (
              <img
                src={event.bannerImage}
                alt={event.title}
                className="w-12 h-12 rounded-xl object-cover border-2 border-gray-200"
              />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                <Calendar className="w-7 h-7 text-blue-400" />
              </div>
            )}
            <div>
              <CardTitle className="text-lg">{event.title}</CardTitle>
              <CardDescription>@{event.slug}</CardDescription>
              <div className="flex gap-2 mt-1">
                <Badge variant="secondary" className="text-xs">
                  {event.category}
                </Badge>
                <Badge
                  variant={event.status === "blocked" ? "destructive" : "default"}
                  className="text-xs"
                >
                  {event.status}
                </Badge>
                {event.featured && (
                  <Badge variant="default" className="text-xs">
                    Featured
                  </Badge>
                )}
                {event.fraudulent && (
                  <Badge variant="destructive" className="text-xs">
                    Fraudulent
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-1 items-end">
            <Badge variant={event.isBlocked ? "destructive" : "default"} className="cursor-default">
              {event.isBlocked ? "Blocked" : "Active"}
            </Badge>
            <Badge variant={event.isPublished ? "default" : "secondary"} className="cursor-default">
              {event.isPublished ? "Published" : "Draft"}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-gray-500" />
              <span className="truncate">{event.organization?.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-gray-500" />
              <span>{event.tags?.join(", ")}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span>{new Date(event.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-gray-500" />
              <span>{event.fraudFlags?.length || 0} Fraud Flags</span>
            </div>
          </div>
          <div className="flex items-center justify-between pt-3 border-t">
            <div className="text-xs text-gray-500">
              Created: {new Date(event.createdAt).toLocaleDateString()}
            </div>
            <Link href={`/event/${event._id}`}>
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
            <h1 className="text-3xl font-bold text-gray-900">Event Management</h1>
            <p className="text-gray-600">Loading events...</p>
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
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Events</h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <Button onClick={fetchEvents} className="bg-blue-600 hover:bg-blue-700 cursor-pointer">
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
          <h1 className="text-3xl font-bold text-gray-900">Event Management</h1>
          <p className="text-gray-600">{pagination.totalDocs} events found</p>
        </div>
        <Button
          onClick={fetchEvents}
          variant="outline"
          className="flex items-center gap-2 cursor-pointer"
        >
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">Filters & Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Search */}
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="flex gap-2">
                <Input
                  id="search"
                  placeholder="Search events..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                />
                <Button onClick={handleSearch} size="sm" className="cursor-pointer">
                  Search
                </Button>
              </div>
            </div>
            {/* Category */}
            <div className="space-y-2">
              <Label>Category</Label>
              <Input
                placeholder="Category"
                value={filters.category}
                onChange={(e) => handleFilterChange("category", e.target.value)}
              />
            </div>
            {/* Status */}
            <div className="space-y-2">
              <Label>Status</Label>
              <Input
                placeholder="Status"
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
              />
            </div>
            {/* Organization */}
            <div className="space-y-2">
              <Label>Organization ID</Label>
              <Input
                placeholder="Organization ID"
                value={filters.orgId}
                onChange={(e) => handleFilterChange("orgId", e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Blocked */}
            <div className="space-y-2">
              <Label>Blocked</Label>
              <Input
                placeholder="Blocked (true/false)"
                value={filters.isBlocked}
                onChange={(e) => handleFilterChange("isBlocked", e.target.value)}
              />
            </div>
            {/* Featured */}
            <div className="space-y-2">
              <Label>Featured</Label>
              <Input
                placeholder="Featured (true/false)"
                value={filters.featured}
                onChange={(e) => handleFilterChange("featured", e.target.value)}
              />
            </div>
            {/* Fraudulent */}
            <div className="space-y-2">
              <Label>Fraudulent</Label>
              <Input
                placeholder="Fraudulent (true/false)"
                value={filters.fraudulent}
                onChange={(e) => handleFilterChange("fraudulent", e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button onClick={handleSearch} className="cursor-pointer">
              Apply Filters
            </Button>
            <Button onClick={handleReset} variant="outline" className="cursor-pointer">
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <EventCard key={event._id} event={event} />
        ))}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
            {Math.min(pagination.page * pagination.limit, pagination.totalDocs)} of{" "}
            {pagination.totalDocs} results
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => handlePageChange(pagination.prevPage)}
              disabled={!pagination.hasPrevPage}
              variant="outline"
              size="sm"
              className="cursor-pointer"
            >
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
            </Button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {events.length === 0 && !loading && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Events Found</h3>
          <p className="text-gray-500 mb-4">
            {filters.search ||
            filters.category ||
            filters.status ||
            filters.isBlocked ||
            filters.featured ||
            filters.fraudulent ||
            filters.orgId
              ? "Try adjusting your filters to see more results."
              : "No events have been created yet."}
          </p>
          {(filters.search ||
            filters.category ||
            filters.status ||
            filters.isBlocked ||
            filters.featured ||
            filters.fraudulent ||
            filters.orgId) && (
            <Button onClick={handleReset} variant="outline" className="cursor-pointer">
              Clear Filters
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
