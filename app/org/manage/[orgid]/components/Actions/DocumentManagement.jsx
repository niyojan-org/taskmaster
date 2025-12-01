import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

export default function DocumentManagement({ documents, loading, makeApiCall }) {
  if (!documents || documents.length === 0) return null;
  return (
    <div className="space-y-2">
      {documents.map((doc) => (
        <div key={doc._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex-1">
            <p className="text-sm font-medium">{doc.type}</p>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={doc.verified ? "default" : "secondary"} className="text-xs cursor-default">
                {doc.verified ? 'Verified' : 'Pending'}
              </Badge>
              <a
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-xs cursor-pointer"
              >
                View Document
              </a>
            </div>
          </div>
          {!doc.verified && (
            <Button
              size="sm"
              onClick={() => makeApiCall(`/document/${doc._id}`)}
              disabled={loading}
              className="cursor-pointer bg-green-600 hover:bg-green-700 text-white"
            >
              <CheckCircle className="w-3 h-3 mr-1" />
              Verify
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}
