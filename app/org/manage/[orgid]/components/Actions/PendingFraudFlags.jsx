import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function PendingFraudFlags({ fraudFlags, loading, makeApiCall }) {
  if (!fraudFlags?.some(flag => !flag.resolved)) return null;
  return (
    <div className="space-y-2">
      {fraudFlags.filter(flag => !flag.resolved).map(flag => (
        <div key={flag._id} className="flex items-center justify-between p-2 bg-red-50 rounded-lg">
          <div className="flex-1">
            <p className="text-sm font-medium">{flag.reason.substring(0, 40)}...</p>
            <Badge variant="destructive" className="text-xs mt-1 cursor-default">
              {flag.severity}
            </Badge>
          </div>
          <Button
            size="sm"
            onClick={() => makeApiCall(`/fraud-flag/${flag._id}/resolve`)}
            disabled={loading}
            className="cursor-pointer"
          >
            Resolve
          </Button>
        </div>
      ))}
    </div>
  );
}
