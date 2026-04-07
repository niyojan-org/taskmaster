import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IconArrowRight, IconBuilding, IconMapPin } from "@tabler/icons-react";
import { getSafeOrgId } from "./organizationHelpers";

function OrganizationStatusBadges({ org }) {
  const risk = org.riskLevel || "unknown";
  const isLowRisk = risk === "low";
  const isMedRisk = risk === "medium";

  return (
    <div className="flex flex-wrap gap-1.5">
      <Badge variant={org.verified ? "default" : "outline"}>
        {org.verified ? "Verified" : "Unverified"}
      </Badge>
      <Badge variant={org.isBlocked ? "destructive" : "secondary"}>
        {org.isBlocked ? "Blocked" : "Active"}
      </Badge>
      <Badge
        variant={
          isLowRisk ? "secondary" : isMedRisk ? "outline" : "destructive"
        }
        className="capitalize"
      >
        {risk}
      </Badge>
    </div>
  );
}

function OrganizationName({ org }) {
  return (
    <div className="flex items-center gap-3">
      {org.logo ? (
        <img
          src={org.logo}
          alt={`${org.name} logo`}
          className="h-10 w-10 rounded-lg border object-cover"
          loading="lazy"
        />
      ) : (
        <div className="flex h-10 w-10 items-center justify-center rounded-lg border bg-muted">
          <IconBuilding className="h-4 w-4 text-muted-foreground" />
        </div>
      )}
      <div>
        <p className="font-medium text-foreground">
          {org.name || "Untitled organization"}
        </p>
        <p className="text-xs text-muted-foreground">
          {org.slug ? `@${org.slug}` : "No slug"}
        </p>
      </div>
    </div>
  );
}

export default function OrganizationList({ organizations }) {
  return (
    <>
      <Card className="hidden md:block">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Organization</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Trust</TableHead>
                <TableHead>Events</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {organizations.map((org) => {
                const orgId = getSafeOrgId(org);

                return (
                  <TableRow key={orgId}>
                    <TableCell>
                      <OrganizationName org={org} />
                    </TableCell>
                    <TableCell className="capitalize">
                      {org.category || "-"}
                    </TableCell>
                    <TableCell>
                      <p className="max-w-56 truncate">{org.email || "-"}</p>
                      <p className="text-xs text-muted-foreground">
                        {org.phone || "-"}
                      </p>
                    </TableCell>
                    <TableCell>
                      <OrganizationStatusBadges org={org} />
                    </TableCell>
                    <TableCell>{org.trustScore ?? 0}/100</TableCell>
                    <TableCell>{org.stats?.totalEventsHosted ?? 0}</TableCell>
                    <TableCell>
                      {org.createdAt
                        ? new Date(org.createdAt).toLocaleDateString()
                        : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/org/manage/${orgId}`}>
                        <Button size="sm" variant="outline">
                          Manage
                          <IconArrowRight className="ml-1 h-4 w-4" />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-3 md:hidden">
        {organizations.map((org) => {
          const orgId = getSafeOrgId(org);

          return (
            <Card key={orgId}>
              <CardContent className="space-y-3 p-4">
                <OrganizationName org={org} />

                <div className="flex flex-wrap gap-2">
                  <OrganizationStatusBadges org={org} />
                </div>

                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>{org.email || "No email"}</p>
                  <p>{org.phone || "No phone"}</p>
                  <p className="flex items-center gap-1">
                    <IconMapPin className="h-3.5 w-3.5" />
                    {org.address?.city || "-"}, {org.address?.state || "-"}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t pt-2 text-sm">
                  <span className="text-muted-foreground">
                    Trust: {org.trustScore ?? 0}/100
                  </span>
                  <Link href={`/org/manage/${orgId}`}>
                    <Button size="sm" variant="outline">
                      Manage
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </>
  );
}
