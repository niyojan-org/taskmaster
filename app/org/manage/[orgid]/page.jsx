'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Building2, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import OrganizationDetails from './components/OrganizationDetails';
import OrganizationActions from './components/OrganizationActions';

export default function ManageOrganizationPage() {
  const { orgid } = useParams();
  const [orgData, setOrgData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrganizationData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/tm/org/${orgid}`);
      
      if (response.data.success) {
        setOrgData(response.data.data);
      } else {
        setError(response.data.message || 'Failed to fetch organization data');
        toast.error(response.data.message || 'Failed to fetch organization data');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error fetching organization data';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orgid) {
      fetchOrganizationData();
    }
  }, [orgid]);

  const handleDataUpdate = () => {
    fetchOrganizationData();
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Organization Management</h1>
            <p className="text-gray-600">Loading organization details...</p>
          </div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-1">
            <Card className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="h-10 bg-gray-200 rounded"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-2xl mx-auto">
          <div className="text-center py-12">
            <XCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Organization</h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <Button onClick={fetchOrganizationData} className="bg-blue-600 hover:bg-blue-700">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!orgData) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-2xl mx-auto">
          <div className="text-center py-12">
            <Building2 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Organization Not Found</h3>
            <p className="text-gray-500 mb-4">No organization data found for this ID</p>
            <Button onClick={fetchOrganizationData} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {orgData.logo && (
            <img 
              src={orgData.logo} 
              alt={`${orgData.name} logo`}
              className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
            />
          )}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{orgData.name}</h1>
            <div className="flex items-center space-x-2 mt-1">
              <p className="text-gray-600">@{orgData.slug}</p>
              <Badge variant={orgData.verified ? "default" : "secondary"} className="cursor-default">
                {orgData.verified ? "Verified" : "Unverified"}
              </Badge>
              <Badge variant={orgData.active ? "default" : "destructive"} className="cursor-default">
                {orgData.active ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>
        </div>
        <Button onClick={fetchOrganizationData} variant="outline" className="flex items-center gap-2 cursor-pointer">
          <RefreshCw className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <OrganizationDetails orgData={orgData} />
        </div>
        <div className="lg:col-span-1">
          <OrganizationActions 
            orgId={orgid} 
            orgData={orgData} 
            onUpdate={handleDataUpdate}
          />
        </div>
      </div>
    </div>
  );
}
