
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Users, ShieldCheck, FileText, BarChart2, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function SuperAdminLanding() {
  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 my-auto flex flex-col items-center justify-center px-4 h-screen overflow-hidden">
      <Card className="shadow-2xl border-0 w-full overflow-hidden my-auto">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <ShieldCheck className="text-white w-10 h-10" />
          </div>
          <CardTitle className="text-3xl font-bold text-gray-800 mb-2">Super Admin Dashboard</CardTitle>
          <p className="text-gray-600 text-lg">Welcome! Manage organizations, users, resources, and analytics from one place.</p>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8">
          {/* Organizations */}
          <Link href="/org/manage">
            <div className="group rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 p-6 shadow hover:shadow-lg transition cursor-pointer flex flex-col items-center">
              <Building2 className="w-10 h-10 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
              <div className="font-semibold text-lg text-gray-800 mb-1">Organizations</div>
              <div className="text-gray-500 text-sm mb-3 text-center">View, verify, and manage all organizations</div>
              <Button variant="outline" className="group-hover:bg-blue-600 group-hover:text-white transition flex items-center gap-2">
                Manage <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </Link>
          {/* Users */}
          <Link href="/users">
            <div className="group rounded-xl bg-gradient-to-br from-indigo-100 to-blue-100 p-6 shadow hover:shadow-lg transition cursor-pointer flex flex-col items-center">
              <Users className="w-10 h-10 text-indigo-600 mb-2 group-hover:scale-110 transition-transform" />
              <div className="font-semibold text-lg text-gray-800 mb-1">Users</div>
              <div className="text-gray-500 text-sm mb-3 text-center">Manage all platform users and permissions</div>
              <Button variant="outline" className="group-hover:bg-indigo-600 group-hover:text-white transition flex items-center gap-2">
                Manage <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </Link>
          {/* Resources */}
          <Link href="/resource/manage">
            <div className="group rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 p-6 shadow hover:shadow-lg transition cursor-pointer flex flex-col items-center">
              <FileText className="w-10 h-10 text-blue-500 mb-2 group-hover:scale-110 transition-transform" />
              <div className="font-semibold text-lg text-gray-800 mb-1">Resources</div>
              <div className="text-gray-500 text-sm mb-3 text-center">View and manage all resources</div>
              <Button variant="outline" className="group-hover:bg-blue-500 group-hover:text-white transition flex items-center gap-2">
                Manage <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </Link>
          {/* Analytics */}
          <Link href="/analytics">
            <div className="group rounded-xl bg-gradient-to-br from-indigo-100 to-blue-100 p-6 shadow hover:shadow-lg transition cursor-pointer flex flex-col items-center">
              <BarChart2 className="w-10 h-10 text-indigo-500 mb-2 group-hover:scale-110 transition-transform" />
              <div className="font-semibold text-lg text-gray-800 mb-1">Analytics</div>
              <div className="text-gray-500 text-sm mb-3 text-center">View platform analytics and reports</div>
              <Button variant="outline" className="group-hover:bg-indigo-500 group-hover:text-white transition flex items-center gap-2">
                View <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
