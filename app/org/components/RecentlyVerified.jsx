// RecentlyVerified.jsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IconCircleCheck } from "@tabler/icons-react";

export default function RecentlyVerified({ orgs }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <IconCircleCheck size={20} />
          Recently Verified
        </CardTitle>
        <CardDescription>Latest verified organizations</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orgs.slice(0, 5).map((org) => (
            <div key={org._id} className="flex items-center justify-between p-3 rounded-lg bg-green-50">
              <div>
                <div className="font-medium">{org.name}</div>
                <div className="text-sm text-muted-foreground">{new Date(org.verifiedAt).toLocaleDateString()}</div>
              </div>
              <Badge className="bg-green-100 text-green-800">Verified</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
