import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { IconChevronDown, IconFilter, IconSearch } from "@tabler/icons-react";

function FilterDropdown({ value, placeholder, options, onChange }) {
  const selectedLabel =
    options.find((option) => option.value === value)?.label || placeholder;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          buttonVariants({ variant: "outline" }),
          "w-full justify-between font-normal",
        )}
      >
        <span className="truncate">{selectedLabel}</span>
        <IconChevronDown className="h-4 w-4 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-full min-w-48" align="start">
        <DropdownMenuRadioGroup value={value} onValueChange={onChange}>
          {options.map((option) => (
            <DropdownMenuRadioItem key={option.value} value={option.value} className="capitalize w-full">
              {option.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function OrganizationFilters({
  filters,
  categories,
  isLoading,
  onFilterChange,
  onApply,
  onReset,
}) {
  const categoryOptions = [
    { value: "all", label: "All categories" },
    ...categories.map((category) => ({ value: category, label: category })),
  ];

  const verificationOptions = [
    { value: "all", label: "All" },
    { value: "true", label: "Verified" },
    { value: "false", label: "Unverified" },
  ];

  const blockStatusOptions = [
    { value: "all", label: "All" },
    { value: "false", label: "Active" },
    { value: "true", label: "Blocked" },
  ];

  const riskOptions = [
    { value: "all", label: "All" },
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
  ];

  const sortByOptions = [
    { value: "createdAt", label: "Created Date" },
    { value: "updatedAt", label: "Updated Date" },
    { value: "name", label: "Name" },
    { value: "trustScore", label: "Trust Score" },
  ];

  const sortOrderOptions = [
    { value: "desc", label: "Descending" },
    { value: "asc", label: "Ascending" },
  ];

  const pageSizeOptions = [
    { value: "10", label: "10" },
    { value: "20", label: "20" },
    { value: "30", label: "30" },
    { value: "50", label: "50" },
  ];

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

          <div className="space-y-2 w-full">
            <Label>Category</Label>
            <FilterDropdown
              value={filters.category || "all"}
              placeholder="All categories"
              options={categoryOptions}
              onChange={(value) =>
                onFilterChange("category", value === "all" ? "" : value)
              }
            />
          </div>

          <div className="space-y-2 w-full">
            <Label>Verification</Label>
            <FilterDropdown
              value={filters.verified || "all"}
              placeholder="All"
              options={verificationOptions}
              onChange={(value) =>
                onFilterChange("verified", value === "all" ? "" : value)
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Block Status</Label>
            <FilterDropdown
              value={filters.isBlocked || "all"}
              placeholder="All"
              options={blockStatusOptions}
              onChange={(value) =>
                onFilterChange("isBlocked", value === "all" ? "" : value)
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Risk</Label>
            <FilterDropdown
              value={filters.riskLevel || "all"}
              placeholder="All"
              options={riskOptions}
              onChange={(value) =>
                onFilterChange("riskLevel", value === "all" ? "" : value)
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Sort By</Label>
            <FilterDropdown
              value={filters.sortBy}
              placeholder="Sort By"
              options={sortByOptions}
              onChange={(value) => onFilterChange("sortBy", value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Order</Label>
            <FilterDropdown
              value={filters.sortOrder}
              placeholder="Order"
              options={sortOrderOptions}
              onChange={(value) => onFilterChange("sortOrder", value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Page Size</Label>
            <FilterDropdown
              value={String(filters.limit)}
              placeholder="Page Size"
              options={pageSizeOptions}
              onChange={(value) => onFilterChange("limit", Number(value))}
            />
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
