import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  IconAlertCircle,
  IconBuilding,
  IconRefresh,
} from "@tabler/icons-react";

export function OrganizationLoadingState() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <Card key={index}>
            <CardContent className="space-y-2 p-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-14" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="space-y-3 p-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    </div>
  );
}

export function OrganizationErrorState({ message, onRetry }) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-2 p-8 text-center">
        <IconAlertCircle className="h-10 w-10 text-destructive" />
        <h2 className="text-xl font-semibold">Unable to load organizations</h2>
        <p className="max-w-xl text-muted-foreground">{message}</p>
        <Button type="button" onClick={onRetry}>
          <IconRefresh className="mr-2 h-4 w-4" />
          Retry
        </Button>
      </CardContent>
    </Card>
  );
}

export function OrganizationEmptyState({ hasFilters, onReset }) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-2 p-8 text-center">
        <IconBuilding className="h-10 w-10 text-muted-foreground" />
        <h2 className="text-xl font-semibold">No organizations found</h2>
        <p className="max-w-xl text-muted-foreground">
          {hasFilters
            ? "Try removing a few filters or using a broader search term."
            : "No organizations are available right now."}
        </p>
        {hasFilters ? (
          <Button type="button" variant="outline" onClick={onReset}>
            Clear Filters
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}
