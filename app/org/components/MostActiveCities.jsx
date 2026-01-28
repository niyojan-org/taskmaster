// MostActiveCities.jsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { IconMapPin } from "@tabler/icons-react";
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar } from "recharts";

export default function MostActiveCities({ data }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <IconMapPin size={20} />
          Most Active Cities
        </CardTitle>
        <CardDescription>Cities with the most organizations</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="city" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#228be6" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
