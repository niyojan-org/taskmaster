import { useState } from "react";
import useResourceStore from "@/store/resourceStore";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IconSearch, IconX, IconFilter } from "@tabler/icons-react";

export default function ResourceFilters() {
  const { filters, updateFilters, resetFilters } = useResourceStore();
  const [showAdvanced, setShowAdvanced] = useState(false);

  const resourceTypes = [
    { value: "", label: "All Types" },
    { value: "logo", label: "Logo" },
    { value: "carousel", label: "Carousel" },
    { value: "event-banner", label: "Event Banner" },
    { value: "flyer", label: "Flyer" },
    { value: "poster", label: "Poster" },
    { value: "profile-picture", label: "Profile Picture" },
    { value: "cover-image", label: "Cover Image" },
    { value: "document", label: "Document" },
    { value: "video", label: "Video" },
    { value: "audio", label: "Audio" },
    { value: "other", label: "Other" },
  ];

  const statusOptions = [
    { value: "", label: "All Status" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "archived", label: "Archived" },
    { value: "processing", label: "Processing" },
  ];

  const sortOptions = [
    { value: "-createdAt", label: "Newest First" },
    { value: "createdAt", label: "Oldest First" },
    { value: "-priority", label: "Highest Priority" },
    { value: "priority", label: "Lowest Priority" },
    { value: "title", label: "Title A-Z" },
    { value: "-title", label: "Title Z-A" },
  ];

  const publicOptions = [
    { value: "", label: "All Resources" },
    { value: "true", label: "Public Only" },
    { value: "false", label: "Private Only" },
  ];

  const handleSearchChange = (e) => {
    updateFilters({ search: e.target.value });
  };

  const handleFilterChange = (key, value) => {
    updateFilters({ [key]: value });
  };

  const handleReset = () => {
    resetFilters();
    setShowAdvanced(false);
  };

  const hasActiveFilters =
    filters.type ||
    filters.status ||
    filters.search ||
    filters.isPublic ||
    filters.minPriority ||
    filters.maxPriority ||
    filters.tags ||
    filters.organizationId ||
    filters.eventId ||
    filters.createdFrom ||
    filters.createdTo;

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search resources by title, description, or tags..."
                value={filters.search}
                onChange={handleSearchChange}
                className="pl-9"
              />
            </div>

            <Select
              value={filters.type}
              onValueChange={(value) => handleFilterChange("type", value)}
            >
              <SelectTrigger className="w-full md:w-50">
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent>
                {resourceTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.status}
              onValueChange={(value) => handleFilterChange("status", value)}
            >
              <SelectTrigger className="w-full md:w-50">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.sort}
              onValueChange={(value) => handleFilterChange("sort", value)}
            >
              <SelectTrigger className="w-full md:w-50">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((sort) => (
                  <SelectItem key={sort.value} value={sort.value}>
                    {sort.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              <IconFilter className="h-4 w-4 mr-2" />
              {showAdvanced ? "Hide" : "Show"} Advanced Filters
            </Button>

            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={handleReset}>
                <IconX className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            )}
          </div>

          {showAdvanced && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t">
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  Public Status
                </label>
                <Select
                  value={filters.isPublic}
                  onValueChange={(value) =>
                    handleFilterChange("isPublic", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select visibility" />
                  </SelectTrigger>
                  <SelectContent>
                    {publicOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  Min Priority
                </label>
                <Input
                  type="number"
                  placeholder="Minimum priority"
                  value={filters.minPriority}
                  onChange={(e) =>
                    handleFilterChange("minPriority", e.target.value)
                  }
                />
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  Max Priority
                </label>
                <Input
                  type="number"
                  placeholder="Maximum priority"
                  value={filters.maxPriority}
                  onChange={(e) =>
                    handleFilterChange("maxPriority", e.target.value)
                  }
                />
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  Organization ID
                </label>
                <Input
                  placeholder="Filter by organization ID"
                  value={filters.organizationId}
                  onChange={(e) =>
                    handleFilterChange("organizationId", e.target.value)
                  }
                />
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  Event ID
                </label>
                <Input
                  placeholder="Filter by event ID"
                  value={filters.eventId}
                  onChange={(e) =>
                    handleFilterChange("eventId", e.target.value)
                  }
                />
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  Filter by Tags
                </label>
                <Input
                  placeholder="tag1, tag2, tag3"
                  value={filters.tags}
                  onChange={(e) => handleFilterChange("tags", e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  Created From
                </label>
                <Input
                  type="date"
                  value={filters.createdFrom ? filters.createdFrom.split('T')[0] : ''}
                  onChange={(e) => {
                    const value = e.target.value ? new Date(e.target.value).toISOString() : '';
                    handleFilterChange("createdFrom", value);
                  }}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  Created To
                </label>
                <Input
                  type="date"
                  value={filters.createdTo ? filters.createdTo.split('T')[0] : ''}
                  onChange={(e) => {
                    const value = e.target.value ? new Date(e.target.value).toISOString() : '';
                    handleFilterChange("createdTo", value);
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
