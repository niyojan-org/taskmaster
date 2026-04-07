import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { IconFilter, IconSearch } from "@tabler/icons-react";

export default function OrganizationFilters({
  filters,
  categories,
  isLoading,
  onFilterChange,
  onApply,
  onReset,
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <IconFilter className="h-5 w-5" />
          Search & Filters
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="space-y-2 xl:col-span-2">
            <Label htmlFor="organization-search">Search</Label>
            <div className="flex gap-2">
              <Input
                id="organization-search"
                placeholder="Search by name, slug, email"
                value={filters.search}
                onChange={(event) =>
                  onFilterChange("search", event.target.value)
                }
                onKeyDown={(event) => {
                  if (event.key === "Enter") onApply();
                }}
              />
              <Button type="button" onClick={onApply} disabled={isLoading}>
                <IconSearch className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <Select
              value={filters.category || "all"}
              onValueChange={(value) =>
                onFilterChange("category", value === "all" ? "" : value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Verification</Label>
            <Select
              value={filters.verified || "all"}
              onValueChange={(value) =>
                onFilterChange("verified", value === "all" ? "" : value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="true">Verified</SelectItem>
                <SelectItem value="false">Unverified</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Block Status</Label>
            <Select
              value={filters.isBlocked || "all"}
              onValueChange={(value) =>
                onFilterChange("isBlocked", value === "all" ? "" : value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="false">Active</SelectItem>
                <SelectItem value="true">Blocked</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Risk</Label>
            <Select
              value={filters.riskLevel || "all"}
              onValueChange={(value) =>
                onFilterChange("riskLevel", value === "all" ? "" : value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Sort By</Label>
            <Select
              value={filters.sortBy}
              onValueChange={(value) => onFilterChange("sortBy", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt">Created Date</SelectItem>
                <SelectItem value="updatedAt">Updated Date</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="trustScore">Trust Score</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Order</Label>
            <Select
              value={filters.sortOrder}
              onValueChange={(value) => onFilterChange("sortOrder", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">Descending</SelectItem>
                <SelectItem value="asc">Ascending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Page Size</Label>
            <Select
              value={String(filters.limit)}
              onValueChange={(value) => onFilterChange("limit", Number(value))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="30">30</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 border-t pt-4">
          <Button type="button" onClick={onApply} disabled={isLoading}>
            Apply Filters
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onReset}
            disabled={isLoading}
          >
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
