import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ActionCard({ title, description, icon: Icon, color = "blue", children }) {
  return (
    <Card className="hover:shadow-md transition-shadow cursor-default">
      <CardHeader className="pb-3">
        <CardTitle className={`flex items-center gap-2 ${color === 'blue' ? 'text-blue-600' :
          color === 'orange' ? 'text-orange-600' :
            color === 'red' ? 'text-red-600' :
              color === 'purple' ? 'text-purple-600' : 'text-gray-600'
          }`}>
          <Icon className="h-5 w-5" />
          {title}
        </CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="pt-0">
        {children}
      </CardContent>
    </Card>
  );
}
