import { Card, CardContent } from "@/components/ui/card";
import {
  IconBuilding,
  IconCircleCheck,
  IconShieldX,
  IconCalendarStats,
} from "@tabler/icons-react";

export default function OrganizationSummaryCards({
  totalVisible,
  totalVerified,
  totalBlocked,
  totalEvents,
  avgTrust,
}) {
  const cards = [
    {
      title: "Visible Organizations",
      value: totalVisible,
      icon: IconBuilding,
      tone: "text-sky-600",
    },
    {
      title: "Verified",
      value: totalVerified,
      icon: IconCircleCheck,
      tone: "text-emerald-600",
    },
    {
      title: "Blocked",
      value: totalBlocked,
      icon: IconShieldX,
      tone: "text-rose-600",
    },
    {
      title: "Events Hosted",
      value: totalEvents,
      icon: IconCalendarStats,
      tone: "text-amber-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {cards.map((item) => (
        <Card key={item.title}>
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                {item.title}
              </p>
              <p className="text-2xl font-semibold text-foreground">
                {item.value}
              </p>
            </div>
            <item.icon className={`h-6 w-6 ${item.tone}`} />
          </CardContent>
        </Card>
      ))}

      <Card>
        <CardContent className="flex h-full flex-col justify-center p-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Avg Trust Score
          </p>
          <p className="text-2xl font-semibold text-foreground">{avgTrust}</p>
          <p className="text-xs text-muted-foreground">
            On current page results
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
