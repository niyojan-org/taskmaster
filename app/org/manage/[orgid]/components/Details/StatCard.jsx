import { Card, CardContent } from '@/components/ui/card';

export default function StatCard({ title, value, icon: Icon, color = "blue" }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className={`text-2xl font-bold ${
              color === 'blue' ? 'text-blue-600' :
              color === 'green' ? 'text-green-600' :
              color === 'yellow' ? 'text-yellow-600' :
              color === 'red' ? 'text-red-600' : 'text-gray-600'
            }`}>{value}</p>
          </div>
          <Icon className={`h-8 w-8 opacity-80 ${
            color === 'blue' ? 'text-blue-600' :
            color === 'green' ? 'text-green-600' :
            color === 'yellow' ? 'text-yellow-600' :
            color === 'red' ? 'text-red-600' : 'text-gray-600'
          }`} />
        </div>
      </CardContent>
    </Card>
  );
}
