"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Tag,
  Star,
  Ban,
  AlertTriangle,
  Eye,
  Users,
  Ticket,
  BarChart2,
  FileText,
  CheckCircle,
  XCircle,
  Flag,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

function StatCard({ title, value, icon: Icon, color = "blue", description }) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
        {Icon && <Icon className={`h-5 w-5 text-${color}-600`} />}
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold text-${color}-600`}>{value}</div>
        {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
      </CardContent>
    </Card>
  );
}

function TopEventsList({ events, type }) {
  if (!Array.isArray(events)) return null;
  return (
    <ul className="space-y-2">
      {events.length === 0 ? (
        <li className="text-gray-500">No data available</li>
      ) : (
        events.map((event) => (
          <li key={event._id} className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <span className="font-medium text-gray-700">{event.title}</span>
              {event.organization && (
                <span className="ml-2 text-xs text-gray-500">Org: {typeof event.organization === "string" ? event.organization : event.organization.name}</span>
              )}
            </div>
            <Badge variant="secondary">
              {type === "views"
                ? `Views: ${event.viewCount}`
                : `Registrations: ${event.totalRegistrations}`}
            </Badge>
          </li>
        ))
      )}
    </ul>
  );
}

function EventTypePieChart({ data }) {
  if (!Array.isArray(data)) return null;
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 1.2;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text
        x={x}
        y={y}
        fill="#333"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={12}
      >
        {data[index].name}: {data[index].value} ({(percent * 100).toFixed(1)}%)
      </text>
    );
  };
  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={80}
          label={renderCustomizedLabel}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-type-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Legend />
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}

export default function EventDashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSummary = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get("/tm/event/summary");
      if (response.data.success) {
        setSummary(response.data.summary);
      } else {
        setError(response.data.message || "Failed to fetch event summary");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching event summary");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  if (loading) {
    return (
      <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold text-gray-900">Event Dashboard</h1>
        <p className="text-gray-600">Loading event summary...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-2xl mx-auto">
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Error Loading Event Summary
            </h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <Button
              onClick={fetchSummary}
              className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Prepare chart data
  const statusData = [
    { name: "Blocked", value: summary.blockedEvents },
    { name: "Featured", value: summary.featuredEvents },
    { name: "Fraudulent", value: summary.fraudulentEvents },
    { name: "Published", value: summary.publishedEvents },
    { name: "Draft", value: summary.draftEvents },
    { name: "Completed", value: summary.completedEvents },
    { name: "Cancelled", value: summary.cancelledEvents },
  ];

  const typeData = [
    { name: "Private", value: summary.privateEvents },
    { name: "Public", value: summary.publicEvents },
    { name: "Online", value: summary.onlineEvents },
    { name: "Offline", value: summary.offlineEvents },
    { name: "Hybrid", value: summary.hybridEvents },
  ];

  const registrationData = [
    { name: "Open Registration", value: summary.openRegistrationEvents },
    { name: "Closed Registration", value: summary.closedRegistrationEvents },
  ];

  const fraudData = [
    { name: "Critical", value: summary.criticalFraudEvents },
    { name: "Major", value: summary.majorFraudEvents },
    { name: "Minor", value: summary.minorFraudEvents },
  ];

  const topViewedEvents = summary.topViewedEvents?.slice(0, 5) || [];
  const topRegisteredEvents = summary.topRegisteredEvents?.slice(0, 5) || [];

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Event Dashboard</h1>
        <Button
          onClick={fetchSummary}
          variant="outline"
          className="flex items-center gap-2 cursor-pointer"
        >
          Refresh
        </Button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Events" value={summary.totalEvents} icon={Calendar} color="blue" />
        <StatCard title="Blocked Events" value={summary.blockedEvents} icon={Ban} color="red" />
        <StatCard title="Featured Events" value={summary.featuredEvents} icon={Star} color="yellow" />
        <StatCard title="Fraudulent Events" value={summary.fraudulentEvents} icon={AlertTriangle} color="orange" />
        <StatCard title="Published Events" value={summary.publishedEvents} icon={CheckCircle} color="green" />
        <StatCard title="Draft Events" value={summary.draftEvents} icon={FileText} color="gray" />
        <StatCard title="Completed Events" value={summary.completedEvents} icon={CheckCircle} color="blue" />
        <StatCard title="Cancelled Events" value={summary.cancelledEvents} icon={XCircle} color="red" />
        <StatCard title="Private Events" value={summary.privateEvents} icon={Tag} color="gray" />
        <StatCard title="Public Events" value={summary.publicEvents} icon={Tag} color="blue" />
        <StatCard title="Online Events" value={summary.onlineEvents} icon={Tag} color="indigo" />
        <StatCard title="Offline Events" value={summary.offlineEvents} icon={Tag} color="green" />
        <StatCard title="Hybrid Events" value={summary.hybridEvents} icon={Tag} color="purple" />
        <StatCard title="Feedback Enabled Events" value={summary.feedbackEnabledEvents} icon={BarChart2} color="yellow" />
        <StatCard title="Total Registrations" value={summary.totalRegistrations} icon={Users} color="purple" />
        <StatCard title="Total View Count" value={summary.totalViewCount} icon={Eye} color="indigo" />
        <StatCard title="Total Tickets Sold" value={summary.totalTicketsSold} icon={Ticket} color="green" />
        <StatCard title="Total Fraud Flags" value={summary.totalFraudFlags} icon={Flag} color="red" />
        <StatCard title="Critical Fraud Events" value={summary.criticalFraudEvents} icon={AlertTriangle} color="red" />
        <StatCard title="Major Fraud Events" value={summary.majorFraudEvents} icon={AlertTriangle} color="orange" />
        <StatCard title="Minor Fraud Events" value={summary.minorFraudEvents} icon={AlertTriangle} color="yellow" />
        <StatCard title="Events With Sessions" value={summary.eventsWithSessions} icon={BarChart2} color="blue" />
        <StatCard title="Events With Coupons" value={summary.eventsWithCoupons} icon={BarChart2} color="green" />
        <StatCard title="Events With Attachments" value={summary.eventsWithAttachments} icon={BarChart2} color="gray" />
        <StatCard title="Events With Media Gallery" value={summary.eventsWithMediaGallery} icon={BarChart2} color="purple" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Event Status Distribution</CardTitle>
            <CardDescription>
              Blocked, Featured, Fraudulent, Published, Draft, Completed, Cancelled
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={statusData}>
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#8884D8">
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Event Type Distribution</CardTitle>
            <CardDescription>Private, Public, Online, Offline, Hybrid</CardDescription>
          </CardHeader>
          <CardContent>
            <EventTypePieChart data={typeData} />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Registration Status</CardTitle>
            <CardDescription>Open vs Closed Registration</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={registrationData}>
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#00C49F">
                  {registrationData.map((entry, index) => (
                    <Cell key={`cell-reg-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fraud Event Breakdown</CardTitle>
            <CardDescription>Critical, Major, Minor</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={fraudData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {fraudData.map((entry, index) => (
                    <Cell key={`cell-fraud-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Events */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Top Viewed Events</CardTitle>
            <CardDescription>Top 5 events by view count</CardDescription>
          </CardHeader>
          <CardContent>
            <TopEventsList events={topViewedEvents} type="views" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Registered Events</CardTitle>
            <CardDescription>Top 5 events by registrations</CardDescription>
          </CardHeader>
          <CardContent>
            <TopEventsList events={topRegisteredEvents} type="registrations" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
