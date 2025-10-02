import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';

export default function FraudFlagsCard({ fraudFlags, formatDate }) {
  if (!fraudFlags || fraudFlags.length === 0) return null;
  return (
    <Card className="hover:shadow-lg transition-shadow border-red-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-600">
          <AlertTriangle className="h-5 w-5" />
          Fraud Flags
        </CardTitle>
        <CardDescription>Security flags and warnings</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {fraudFlags.map((flag) => (
            <div key={flag._id} className={`p-3 rounded-lg border ${
              flag.resolved ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium">{flag.reason}</p>
                  <p className="text-sm text-gray-600">
                    Severity: <Badge variant={flag.severity === 'high' ? 'destructive' : 'secondary'} className="cursor-default">
                      {flag.severity}
                    </Badge>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Flagged: {formatDate(flag.flaggedAt)}
                    {flag.resolved && ` | Resolved: ${formatDate(flag.resolvedAt)}`}
                  </p>
                </div>
                <Badge variant={flag.resolved ? "default" : "destructive"} className="cursor-default">
                  {flag.resolved ? 'Resolved' : 'Active'}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
