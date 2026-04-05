"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  IconBuilding,
  IconClock,
  IconUser,
  IconMail,
  IconPhone,
  IconMapPin,
  IconWorld,
  IconFileText,
  IconRefresh,
  IconArrowRight,
  IconCircleCheck,
  IconCircleX,
  IconAlertCircle
} from "@tabler/icons-react";
import api from "@/lib/api";

export default function VerificationRequestsPage() {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPendingVerifications = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/organizations/taskmaster/verifications/pending/organizations");
      if (response.data.success) {
        console.log(response.data);
        setOrganizations(response.data.data);
      } else {
        setError("Failed to fetch pending verifications");
      }
    } catch (error) {
      setError("Failed to fetch data. Please try again.");
      console.error("Verification requests error:", error);
      toast.error("Failed to load verification requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingVerifications();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Verification Requests</h1>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded"></div>
                  <div className="h-4 bg-muted rounded w-5/6"></div>
                  <div className="h-4 bg-muted rounded w-4/6"></div>
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
      <div className="p-6">
        <div className="text-center py-12">
          <IconCircleX className="mx-auto h-12 w-12 text-destructive mb-4" />
          <h3 className="text-lg font-medium mb-2">Error Loading Verification Requests</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={fetchPendingVerifications}>
            <IconRefresh className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Verification Requests</h1>
          <p className="text-muted-foreground">
            {organizations.length} organization{organizations.length !== 1 ? 's' : ''} pending verification
          </p>
        </div>
        <Button onClick={fetchPendingVerifications} variant="outline" className="flex items-center gap-2">
          <IconRefresh className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      {/* No Pending Verifications */}
      {organizations.length === 0 ? (
        <div className="text-center py-12">
          <IconCircleCheck className="mx-auto h-12 w-12 text-green-600 dark:text-green-400 mb-4" />
          <h3 className="text-lg font-medium mb-2">No Pending Verifications</h3>
          <p className="text-muted-foreground">All organizations have been verified or processed.</p>
        </div>
      ) : (
        /* Organizations Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {organizations.map((org) => (
            <Link key={org._id} href={`/org/manage/${org._id}`}>
              <Card className="hover:shadow-lg transition-all duration-200 hover:border-primary/50 cursor-pointer group">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {org.logo ? (
                        <img
                          src={org.logo}
                          alt={`${org.name} logo`}
                          className="w-12 h-12 rounded-lg object-cover border"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                          <IconBuilding className="w-6 h-6 text-muted-foreground" />
                        </div>
                      )}
                      <div>
                        <CardTitle className="text-lg group-hover:text-primary transition-colors">
                          {org.name}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {org.category}
                          </Badge>
                          <Badge variant="outline" className="text-xs bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20">
                            <IconClock className="w-3 h-3 mr-1" />
                            Pending
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <IconArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  {/* Admin Info */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <IconUser className="w-4 h-4" />
                    <span>{org.owner?.name}</span>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <IconMail className="w-4 h-4" />
                      <span className="truncate">{org.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <IconPhone className="w-4 h-4" />
                      <span>{org.phone}</span>
                    </div>
                  </div>

                  {/* Address */}
                  {org.address && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <IconMapPin className="w-4 h-4" />
                      <span className="truncate">
                        {org.address.city}, {org.address.state}
                      </span>
                    </div>
                  )}

                  {/* Website */}
                  {org.website && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <IconWorld className="w-4 h-4" />
                      <span className="truncate">{org.website}</span>
                    </div>
                  )}

                  {/* Documents Status */}
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center gap-2 text-sm">
                      <IconFileText className="w-4 h-4" />
                      <span>{org.documents?.length || 0} document{org.documents?.length !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {org.stepsCompleted?.documents ? (
                        <Badge className="bg-green-500/10 text-green-700 dark:text-green-400 text-xs">
                          <IconCircleCheck className="w-3 h-3 mr-1" />
                          Complete
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="text-xs">
                          <IconAlertCircle className="w-3 h-3 mr-1" />
                          Incomplete
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Submitted Date */}
                  <div className="text-xs text-muted-foreground pt-1">
                    Submitted: {new Date(org.createdAt).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}