"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import StatCard from "./components/StatCard";
import ChartCard from "./components/ChartCard";
import DataCompleteness from "./components/DataCompleteness";
import TopOrganizations from "./components/TopOrganizations";
import RecentlyVerified from "./components/RecentlyVerified";
import MostActiveCities from "./components/MostActiveCities";
import api from "@/lib/api";
import Link from "next/link";
import { toast } from "sonner";
import { IconRefreshDot, IconBuilding, IconCircleCheck, IconClock, IconTrendingUp, IconCalendar, IconCurrencyRupee, IconStar, IconX, IconRefresh } from "@tabler/icons-react";
import FullPageLoader from "@/components/pages/loader";


const COLORS = ['#228be6', '#40c057', '#fab005', '#fd7e14', '#845ef7'];

export default function OrganizationDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSummary = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/org/taskmaster/summary");
      if (response.data.success) {
        setData(response.data.summary);
      } else {
        toast.error(response.data.message || "Failed to fetch organization summary");
        setError("Failed to fetch organization summary");
      }
    } catch (error) {
      setError("Failed to fetch data. Please try again.");
      toast.error(error.response?.data?.message || "An error occurred while fetching data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  if (loading) return <FullPageLoader />;

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <IconX className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Dashboard</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <Button onClick={fetchSummary} className="bg-blue-600 hover:bg-blue-700">
            <IconRefresh className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }


  return (
    <div className="h-full">
      {/* Sticky Header */}
      <div className="flex items-center justify-between pb-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Organization Dashboard</h1>
        </div>
        <Button onClick={fetchSummary} variant="outline" className="flex items-center gap-2 px-3 font-medium">
          <IconRefreshDot size={16} />
          <span className="inline">Refresh</span>
        </Button>
      </div>

      <div className="w-full mx-auto space-y-1 sm:space-y-4">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-1 sm:gap-3">
          <StatCard
            title="Total Orgs"
            value={data.totalOrganizations}
            icon={IconBuilding}
            iconColor="#228be6"
            description="All organizations"
            compact
          />
          <StatCard
            title="Verified"
            value={data.verifiedOrganizations}
            icon={IconCircleCheck}
            iconColor="#40c057"
            description="Verified"
            compact
          />
          {data.pendingVerification > 0 ? (
            <Link href="/org/verify-org" className="block">
              <StatCard
                title="Pending"
                value={data.pendingVerification}
                icon={IconClock}
                iconColor="#fab005"
                description="Manage verifications"
                compact
              />
            </Link>
          ) : (
            <StatCard
              title="Pending"
              value={data.pendingVerification}
              icon={IconClock}
              iconColor="#fab005"
              description="No pending"
              compact
            />
          )}
          <StatCard
            title="Active"
            value={data.activeOrganizations}
            icon={IconTrendingUp}
            iconColor="#845ef7"
            description="Active now"
            compact
          />
        </div>

        {/* Secondary Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
          <StatCard
            title="Events"
            value={data.totalEventsHosted}
            icon={IconCalendar}
            iconColor="#4263eb"
            description="Events hosted"
            compact
          />
          <StatCard
            title="Revenue"
            value={`₹${data.totalRevenueGenerated.toLocaleString()}`}
            icon={IconCurrencyRupee}
            iconColor="#40c057"
            description="Total revenue"
            compact
          />
          <StatCard
            title="Avg. Rating"
            value={data.averageRating.toFixed(1)}
            icon={IconStar}
            iconColor="#fab005"
            description="Org ratings"
            compact
          />
          <StatCard
            title="High Rated"
            value={data.organizationsWithHighRating}
            icon={IconStar}
            iconColor="#fd7e14"
            description="> 4.0 rating"
            compact
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <ChartCard
            title="Organizations by Category"
            description="Distribution by category"
            icon={IconBuilding}
          >
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={data.organizationsByCategory}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ _id, count }) => `${_id}: ${count}`}
                  outerRadius={70}
                  fill="#228be6"
                  dataKey="count"
                >
                  {data.organizationsByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
          <ChartCard
            title="Monthly Registrations"
            description="Registrations over time"
            icon={IconTrendingUp}
          >
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={data.monthlyRegistrations}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#228be6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Data Completeness */}
        <DataCompleteness data={data} />

        {/* Tables Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <TopOrganizations orgs={data.topOrganizations} />
          <RecentlyVerified orgs={data.recentlyVerifiedOrganizations} />
        </div>

        {/* Most Active Cities */}
        <MostActiveCities data={data.mostActiveCities} />
      </div>
    </div>
  );
}