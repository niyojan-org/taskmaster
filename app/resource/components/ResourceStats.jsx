import useResourceStore from "@/store/resourceStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  IconFiles,
  IconFileCheck,
  IconFileOff,
  IconArchive,
  IconWorld,
  IconLock,
  IconCloudUpload,
  IconStar,
} from "@tabler/icons-react";
import { useState, useEffect } from "react";
import { resourceAPI } from "@/lib/api";

export default function ResourceStats() {
  const { totalResources } = useResourceStore();
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    archived: 0,
    public: 0,
    private: 0,
    processing: 0,
    highPriority: 0,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      // Fetch stats from different status/filters
      const [activeRes, inactiveRes, archivedRes, publicRes, processingRes] = await Promise.all([
        resourceAPI.listResources({ status: "active", limit: 1 }),
        resourceAPI.listResources({ status: "inactive", limit: 1 }),
        resourceAPI.listResources({ status: "archived", limit: 1 }),
        resourceAPI.listResources({ isPublic: true, limit: 1 }),
        resourceAPI.listResources({ status: "processing", limit: 1 }),
      ]);

      setStats({
        total: totalResources,
        active: activeRes.data.pagination?.total || 0,
        inactive: inactiveRes.data.pagination?.total || 0,
        archived: archivedRes.data.pagination?.total || 0,
        public: publicRes.data.pagination?.total || 0,
        private: totalResources - (publicRes.data.pagination?.total || 0),
        processing: processingRes.data.pagination?.total || 0,
        highPriority: 0, // Can be calculated from minPriority filter
      });
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Resources",
      value: totalResources,
      icon: IconFiles,
      description: "All resources",
      color: "text-primary",
    },
    {
      title: "Active",
      value: stats.active,
      icon: IconFileCheck,
      description: "Currently active",
      color: "text-green-600 dark:text-green-400",
    },
    {
      title: "Public",
      value: stats.public,
      icon: IconWorld,
      description: "Publicly accessible",
      color: "text-purple-600 dark:text-purple-400",
    },
    {
      title: "Archived",
      value: stats.archived,
      icon: IconArchive,
      description: "Soft-deleted",
      color: "text-muted-foreground",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? (
                  <div className="h-8 w-16 bg-muted animate-pulse rounded" />
                ) : (
                  stat.value
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
