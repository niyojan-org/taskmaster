import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, Mail, Phone, Globe, MapPin, Calendar, DollarSign, Users, TrendingUp, AlertTriangle, FileText, Shield, User } from 'lucide-react';
import StatCard from './Details/StatCard';
import FraudFlagsCard from './Details/FraudFlagsCard';
import SupportContactCard from './Details/SupportContactCard';
import BankDetailsCard from './Details/BankDetailsCard';
import DocumentsCard from './Details/DocumentsCard';

export default function OrganizationDetails({ orgData }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };


  return (
    <div className="space-y-6">
      {/* Basic Information Card */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-blue-600" />
            Basic Information
          </CardTitle>
          <CardDescription>Organization contact and basic details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">Email</p>
                <p className="text-gray-900">{orgData.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">Phone</p>
                <p className="text-gray-900">{orgData.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Building2 className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">Category</p>
                <p className="text-gray-900">{orgData.category} - {orgData.subCategory}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Globe className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">Website</p>
                <a href={orgData.website} target="_blank" rel="noopener noreferrer"
                  className="text-blue-600 hover:underline cursor-pointer">{orgData.website}</a>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Card */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-600" />
            Status & Permissions
          </CardTitle>
          <CardDescription>Current organization status and capabilities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Badge variant={orgData.verified ? "default" : "secondary"} className="cursor-default">
              {orgData.verified ? 'Verified' : 'Not Verified'}
            </Badge>
            <Badge variant={orgData.active ? "default" : "destructive"} className="cursor-default">
              {orgData.active ? 'Active' : 'Inactive'}
            </Badge>
            <Badge variant={orgData.isBlocked ? "destructive" : "default"} className="cursor-default">
              {orgData.isBlocked ? 'Blocked' : 'Not Blocked'}
            </Badge>
            <Badge variant={orgData.canCreateEvents ? "default" : "destructive"} className="cursor-default">
              {orgData.canCreateEvents ? 'Can Create Events' : 'Event Creation Blocked'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Card */}
      {orgData.stats && (
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Statistics
            </CardTitle>
            <CardDescription>Performance metrics and activity summary</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard
                title="Events Hosted"
                value={orgData.stats.totalEventsHosted || 0}
                icon={Calendar}
                color="blue"
              />
              <StatCard
                title="Tickets Sold"
                value={orgData.stats.totalTicketsSold || 0}
                icon={Users}
                color="green"
              />
              <StatCard
                title="Revenue"
                value={`₹${orgData.stats.totalRevenueGenerated || 0}`}
                icon={DollarSign}
                color="yellow"
              />
              <StatCard
                title="Warnings"
                value={orgData.stats.totalWarnings || 0}
                icon={AlertTriangle}
                color="red"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Administrator Card */}
      {orgData.admin && (
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-purple-600" />
              Administrator
            </CardTitle>
            <CardDescription>Organization admin contact information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{orgData.admin.name}</p>
                <p className="text-gray-600">{orgData.admin.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bank Details */}
      <BankDetailsCard bankDetails={orgData.bankDetails} org={orgData} orgId={orgData._id} onUpdate={() => { }} />

      {/* Address Card */}
      {orgData.address && (
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-orange-600" />
              Address
            </CardTitle>
            <CardDescription>Organization physical location</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <p className="text-gray-900">{orgData.address.street}</p>
              <p className="text-gray-900">{orgData.address.city}, {orgData.address.state}</p>
              <p className="text-gray-900">{orgData.address.country} - {orgData.address.zipCode}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Additional Information Card */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-gray-600" />
            Additional Information
          </CardTitle>
          <CardDescription>Timestamps and other details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-600">Created At</p>
              <p className="text-gray-900">{formatDate(orgData.createdAt)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Updated At</p>
              <p className="text-gray-900">{formatDate(orgData.updatedAt)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fraud Flags Card */}
      <FraudFlagsCard fraudFlags={orgData.fraudFlags} formatDate={formatDate} />

      {/* Support Contact */}
      <SupportContactCard supportContact={orgData.supportContact} />

      {/* Documents */}
      <DocumentsCard documents={orgData.documents} formatDate={formatDate} />
    </div>
  );
}
