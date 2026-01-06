"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, RefreshCw, Filter } from "lucide-react";

const CATEGORIES = [
  { value: "all", label: "All Types" },
  { value: "carousel", label: "Carousel" },
  { value: "poster", label: "Posters" },
  { value: "banner", label: "Banners" },
  { value: "event-banner", label: "Event Banners" },
  { value: "logo", label: "Logos" },
];

export default function ResourceFilters({
  searchQuery,
  setSearchQuery,
  categoryFilter,
  setCategoryFilter,
  onSearch,
  onRefresh,
}) {
  return (
    <Card className="border-2 shadow-sm">
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by title, description, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onSearch()}
                className="pl-9 h-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-48 h-10">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={onSearch} className="h-10 px-4">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
            <Button onClick={onRefresh} variant="outline" className="h-10 px-4">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
