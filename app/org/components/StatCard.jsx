// StatCard.jsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function StatCard({ title, value, icon: Icon, description, iconColor, valueColor, onClick, compact }) {
  return (
    <Card
      onClick={onClick}
      className={`transition-shadow border gap-0 shadow-sm hover:shadow-md ${onClick ? "cursor-pointer" : ""} ${compact ? "p-2" : "p-4"}`}
    >
      <CardHeader className={`flex flex-row items-center justify-between space-y-0 pb-1 px-2 ${compact ? "min-h-0" : ""}`} style={{ minHeight: 0 }}>
        <CardTitle className={`text-sm font-medium text-muted-foreground flex items-center gap-2 ${compact ? "" : "text-sm"}`}>
          {Icon && <Icon size={18} color={iconColor} />}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className={`px-2 py-1 ${compact ? "" : "py-2"}`} style={{ minHeight: 0 }}>
        <div className={`font-bold ${compact ? "text-lg" : "text-2xl"}`} style={valueColor ? { color: valueColor } : {}}>{value}</div>
        {description && <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">{description}</p>}
      </CardContent>
    </Card>
  );
}
