"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Building2, 
  CheckCircle, 
  Clock, 
  XCircle, 
  Ban, 
  TrendingUp, 
  Users, 
  Calendar,
  DollarSign,
  Star,
  MapPin,
  FileText,
  CreditCard,
  Link as LinkIcon,
  Image,
  Globe,
  RefreshCw
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import api from "@/lib/api";
import Link from "next/link";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function OrganizationDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSummary = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/tm/org/summary");
      if (response.data.success) {
        setData(response.data.data);
      } else {
        setError("Failed to fetch organization summary");
      }
    } catch (error) {
      setError("Failed to fetch data. Please try again.");
      console.error("Dashboard error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Organization Dashboard</h1>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
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
          <XCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Dashboard</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <Button onClick={fetchSummary} className="bg-blue-600 hover:bg-blue-700">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const StatCard = ({ title, value, icon: Icon, color = "blue", description }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
        <Icon className={`h-5 w-5 text-${color}-600`} />
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold text-${color}-600`}>{value}</div>
        {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Organization Dashboard</h1>
          <p className="text-gray-600">Comprehensive overview of all organizations</p>
        </div>
        <Button onClick={fetchSummary} variant="outline" className="flex items-center gap-2">
          <RefreshCw className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Organizations"
          value={data.totalOrganizations}
          icon={Building2}
          color="blue"
          description="All registered organizations"
        />
        <StatCard
          title="Verified Organizations"
          value={data.verifiedOrganizations}
          icon={CheckCircle}
          color="green"
          description="Successfully verified"
        />
        {data.pendingVerification > 0 ? (
          <Link href="/org/verify-org" className="block">
            <StatCard
              title="Pending Verification"
              value={data.pendingVerification}
              icon={Clock}
              color="yellow"
              description="Click to manage verifications"
            />
          </Link>
        ) : (
          <StatCard
            title="Pending Verification"
            value={data.pendingVerification}
            icon={Clock}
            color="yellow"
            description="No pending verifications"
          />
        )}
        <StatCard
          title="Active Organizations"
          value={data.activeOrganizations}
          icon={TrendingUp}
          color="purple"
          description="Currently active"
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Events"
          value={data.totalEventsHosted}
          icon={Calendar}
          color="indigo"
          description="Events hosted"
        />
        <StatCard
          title="Revenue Generated"
          value={`₹${data.totalRevenueGenerated.toLocaleString()}`}
          icon={DollarSign}
          color="green"
          description="Total platform revenue"
        />
        <StatCard
          title="Average Rating"
          value={data.averageRating.toFixed(1)}
          icon={Star}
          color="yellow"
          description="Organization ratings"
        />
        <StatCard
          title="High Rated Orgs"
          value={data.organizationsWithHighRating}
          icon={Star}
          color="orange"
          description="Rating above 4.0"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Organization by Category */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Organizations by Category
            </CardTitle>
            <CardDescription>Distribution of organizations across categories</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.organizationsByCategory}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ _id, count }) => `${_id}: ${count}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {data.organizationsByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Monthly Registrations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Monthly Registrations
            </CardTitle>
            <CardDescription>Organization registrations over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.monthlyRegistrations}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Data Completeness */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Organization Data Completeness
          </CardTitle>
          <CardDescription>Overview of completed organization profiles</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div className="text-center">
              <FileText className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold text-blue-600">{data.organizationsWithDocuments}</div>
              <div className="text-sm text-gray-600">Documents</div>
            </div>
            <div className="text-center">
              <CreditCard className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <div className="text-2xl font-bold text-green-600">{data.organizationsWithBankDetails}</div>
              <div className="text-sm text-gray-600">Bank Details</div>
            </div>
            <div className="text-center">
              <LinkIcon className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <div className="text-2xl font-bold text-purple-600">{data.organizationsWithSocialLinks}</div>
              <div className="text-sm text-gray-600">Social Links</div>
            </div>
            <div className="text-center">
              <Image className="h-8 w-8 mx-auto mb-2 text-orange-600" />
              <div className="text-2xl font-bold text-orange-600">{data.organizationsWithLogo}</div>
              <div className="text-sm text-gray-600">Logo</div>
            </div>
            <div className="text-center">
              <Globe className="h-8 w-8 mx-auto mb-2 text-indigo-600" />
              <div className="text-2xl font-bold text-indigo-600">{data.organizationsWithWebsite}</div>
              <div className="text-sm text-gray-600">Website</div>
            </div>
            <div className="text-center">
              <CheckCircle className="h-8 w-8 mx-auto mb-2 text-yellow-600" />
              <div className="text-2xl font-bold text-yellow-600">{data.organizationsWithVerificationRequests}</div>
              <div className="text-sm text-gray-600">Verification Requests</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Organizations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Top Organizations
            </CardTitle>
            <CardDescription>Organizations by events and revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.topOrganizations.slice(0, 5).map((org, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">{org.name}</div>
                    <div className="text-sm text-gray-600">{org.events} events</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">₹{org.revenue.toLocaleString()}</div>
                    <Badge variant="outline">#{index + 1}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recently Verified */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Recently Verified
            </CardTitle>
            <CardDescription>Latest verified organizations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.recentlyVerifiedOrganizations.slice(0, 5).map((org, index) => (
                <div key={org._id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <div className="font-medium">{org.name}</div>
                    <div className="text-sm text-gray-600">
                      {new Date(org.verifiedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Verified</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Most Active Cities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Most Active Cities
          </CardTitle>
          <CardDescription>Cities with the most organizations</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.mostActiveCities}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="city" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}