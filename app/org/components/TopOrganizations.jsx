// TopOrganizations.jsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IconTrendingUp } from "@tabler/icons-react";

export default function TopOrganizations({ orgs }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <IconTrendingUp size={20} />
          Top Organizations
        </CardTitle>
        <CardDescription>Organizations by events and revenue</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orgs.slice(0, 5).map((org, index) => (
            <div key={org._id || index} className="flex items-center justify-between p-3 rounded-lg bg-muted">
              <div>
                <div className="font-medium">{org.name}</div>
                <div className="text-sm text-muted-foreground">{org.events} events</div>
              </div>
              <div className="text-right">
                <Badge variant="outline">#{index + 1}</Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
