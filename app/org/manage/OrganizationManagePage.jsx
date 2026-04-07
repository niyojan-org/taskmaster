"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { IconRefresh } from "@tabler/icons-react";
import OrganizationFilters from "./components/OrganizationFilters";
import OrganizationList from "./components/OrganizationList";
import OrganizationPagination from "./components/OrganizationPagination";
import OrganizationSummaryCards from "./components/OrganizationSummaryCards";
import {
  OrganizationLoadingState,
  OrganizationErrorState,
  OrganizationEmptyState,
} from "./components/OrganizationStates";
import {
  CATEGORY_OPTIONS,
  DEFAULT_FILTERS,
  buildQueryString,
  computeSummary,
  getInitialFilters,
  normalizeOrganizationsResponse,
} from "./components/organizationHelpers";

export default function OrganizationManagePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState(() => getInitialFilters(searchParams));
  const [organizations, setOrganizations] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalDocs: 0,
    totalPages: 1,
    hasPrevPage: false,
    hasNextPage: false,
    prevPage: null,
    nextPage: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrganizations = useCallback(async (activeFilters) => {
    try {
      setLoading(true);
      setError(null);

      const query = buildQueryString(activeFilters);
      const response = await api.get(`/organizations/taskmaster?${query}`);

      if (response.data.success) {
        const normalized = normalizeOrganizationsResponse(response.data);
        setOrganizations(normalized.organizations);
        setPagination(normalized.pagination);
      } else {
        setError(response.data.message || "Failed to fetch organizations");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Error fetching organizations";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateURL = useCallback(
    (nextFilters) => {
      const query = buildQueryString(nextFilters);
      router.push(`/org/manage?${query}`);
    },
    [router],
  );

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: key === "page" ? value : 1,
    }));
  };

  const handlePageChange = (newPage) => {
    const newFilters = { ...filters, page: newPage || 1 };
    setFilters(newFilters);
    updateURL(newFilters);
    fetchOrganizations(newFilters);
  };

  const handleSearch = () => {
    const newFilters = { ...filters, page: 1 };
    setFilters(newFilters);
    updateURL(newFilters);
    fetchOrganizations(newFilters);
  };

  const handleReset = () => {
    const resetFilters = { ...DEFAULT_FILTERS };
    setFilters(resetFilters);
    updateURL(resetFilters);
    fetchOrganizations(resetFilters);
  };

  const hasFilters = useMemo(
    () =>
      Boolean(
        filters.search ||
        filters.category ||
        filters.verified ||
        filters.isBlocked ||
        filters.riskLevel,
      ),
    [filters],
  );

  const summary = useMemo(() => {
    const base = computeSummary(organizations);
    const avgTrust = organizations.length
      ? Math.round(base.avgTrust / organizations.length)
      : 0;

    return {
      totalVisible: organizations.length,
      totalVerified: base.verified,
      totalBlocked: base.blocked,
      totalEvents: base.events,
      avgTrust,
    };
  }, [organizations]);

  useEffect(() => {
    fetchOrganizations(filters);
  }, []);

  return (
    <div className="min-h-screen space-y-6 bg-muted/20 p-4 md:p-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-foreground md:text-3xl">
            Organization Management
          </h1>
          <p className="text-sm text-muted-foreground">
            {pagination.totalDocs} organizations matched
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          className=""
          onClick={() => fetchOrganizations(filters)}
          disabled={loading}
        >
          <IconRefresh className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      <OrganizationFilters
        filters={filters}
        categories={CATEGORY_OPTIONS}
        isLoading={loading}
        onFilterChange={handleFilterChange}
        onApply={handleSearch}
        onReset={handleReset}
      />

      {loading ? <OrganizationLoadingState /> : null}

      {!loading && error ? (
        <OrganizationErrorState
          message={error}
          onRetry={() => fetchOrganizations(filters)}
        />
      ) : null}

      {!loading && !error ? (
        <>
          <OrganizationSummaryCards
            totalVisible={summary.totalVisible}
            totalVerified={summary.totalVerified}
            totalBlocked={summary.totalBlocked}
            totalEvents={summary.totalEvents}
            avgTrust={summary.avgTrust}
          />

          {organizations.length ? (
            <>
              <OrganizationList organizations={organizations} />
              <OrganizationPagination
                pagination={pagination}
                onPageChange={handlePageChange}
                isLoading={loading}
              />
            </>
          ) : (
            <OrganizationEmptyState
              hasFilters={hasFilters}
              onReset={handleReset}
            />
          )}
        </>
      ) : null}
    </div>
  );
}
