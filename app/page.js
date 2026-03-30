"use client";

import { Separator } from "@/components/ui/separator";

import { StatCard } from "@/components/dashboard/StatCard";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { SystemHealth } from "@/components/dashboard/SystemHealth";
import { PendingApprovals } from "@/components/dashboard/PendingApprovals";
import { IconBuilding, IconCalendar, IconFileText, IconSettings2, IconUser } from "@tabler/icons-react";

export default function SuperAdminDashboard() {
  // Mock data - replace with real API calls
  const quickActions = [
    { label: "Create Organization", icon: IconBuilding, onClick: () => { } },
    { label: "Manage Users", icon: IconUser, onClick: () => { } },
    { label: "Review Resources", icon: IconFileText, onClick: () => { } },
    { label: "System Settings", icon: IconSettings2, onClick: () => { } },
  ];

  const recentActivities = [
    {
      user: { name: "John Doe", initials: "JD" },
      action: "Created new organization 'Tech Corp'",
      type: "Organization",
      time: "5 min ago"
    },
    {
      user: { name: "Sarah Smith", initials: "SS" },
      action: "Verified organization 'Startup Inc'",
      type: "Verification",
      time: "12 min ago"
    },
    {
      user: { name: "Mike Johnson", initials: "MJ" },
      action: "Flagged suspicious activity",
      type: "Security",
      time: "1 hour ago"
    },
  ];

  const systemServices = [
    { name: "API Server", status: "operational" },
    { name: "Database", status: "operational" },
    { name: "Storage", status: "operational" },
    { name: "Email Service", status: "degraded" },
  ];

  const pendingApprovals = [
    {
      title: "New Organization Registration",
      description: "TechStartup LLC requesting verification",
      type: "Organization",
      time: "2 hours ago"
    },
    {
      title: "Resource Upload",
      description: "Conference video awaiting approval",
      type: "Resource",
      time: "5 hours ago"
    },
  ];

  return (
    <div className="h-full">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Super Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor and manage the entire platform from here
          </p>
        </div>

        <Separator />

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Organizations"
            value="248"
            description="+12 from last month"
            icon={IconBuilding}
            trend={5.2}
          />
          <StatCard
            title="Active Users"
            value="1,842"
            description="+180 from last month"
            icon={IconUser}
            trend={10.8}
          />
          <StatCard
            title="Events This Month"
            value="64"
            description="+8 from last month"
            icon={IconCalendar}
            trend={14.3}
          />
          <StatCard
            title="Pending Reviews"
            value="23"
            description="Requires attention"
            icon={IconSettings2}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - 2 columns wide */}
          <div className="lg:col-span-2 space-y-6">
            <PendingApprovals items={pendingApprovals} />
            <RecentActivity activities={recentActivities} />
          </div>

          {/* Right Column - 1 column wide */}
          <div className="space-y-6">
            <QuickActions actions={quickActions} />
            <SystemHealth services={systemServices} />
          </div>
        </div>
      </div>
    </div>
  );
}
