"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  LayoutGrid, 
  Image, 
  Flag, 
  Sparkles,
  CheckCircle,
  TrendingUp
} from "lucide-react";

export default function ResourceStats({ stats }) {
  const statCards = [
    {
      title: "Total Resources",
      value: stats?.total || 0,
      icon: LayoutGrid,
      description: "All resources in system",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Carousel Items",
      value: stats?.carousel || 0,
      icon: Image,
      description: "Rotating banners",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Posters",
      value: stats?.poster || 0,
      icon: Flag,
      description: "Event posters",
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Active Resources",
      value: stats?.active || 0,
      icon: CheckCircle,
      description: "Currently active",
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
      {statCards.map((stat, index) => (
        <Card key={index} className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/30">
          <div className={`absolute top-0 right-0 w-32 h-32 ${stat.bgColor} rounded-full -mr-16 -mt-16 opacity-50 group-hover:opacity-70 transition-opacity`} />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <div className={`${stat.bgColor} p-2 rounded-lg`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <div className="text-3xl font-bold">{stat.value}</div>
              {stat.value > 0 && (
                <TrendingUp className="h-4 w-4 text-green-500" />
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
