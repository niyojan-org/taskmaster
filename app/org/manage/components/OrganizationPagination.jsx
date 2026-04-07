import { Button } from "@/components/ui/button";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";

export default function OrganizationPagination({ pagination, onPageChange, isLoading }) {
  if (!pagination || pagination.totalPages <= 1) return null;

  const start = (pagination.page - 1) * pagination.limit + 1;
  const end = Math.min(pagination.page * pagination.limit, pagination.totalDocs);

  return (
    <div className="flex flex-col items-start justify-between gap-3 rounded-xl border bg-card p-4 text-sm sm:flex-row sm:items-center">
      <p className="text-muted-foreground">
        Showing {start} to {end} of {pagination.totalDocs}
      </p>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => pagination.prevPage && onPageChange(pagination.prevPage)}
          disabled={!pagination.hasPrevPage || isLoading}
        >
          <IconChevronLeft className="mr-1 h-4 w-4" />
          Previous
        </Button>

        <span className="min-w-24 text-center text-muted-foreground">
          Page {pagination.page} / {pagination.totalPages}
        </span>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => pagination.nextPage && onPageChange(pagination.nextPage)}
          disabled={!pagination.hasNextPage || isLoading}
        >
          Next
          <IconChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}