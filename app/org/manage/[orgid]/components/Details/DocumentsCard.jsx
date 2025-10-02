import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function DocumentsCard({ documents, formatDate }) {
  if (!documents || documents.length === 0) return null;
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-indigo-600" />
          Documents
        </CardTitle>
        <CardDescription>Uploaded verification documents</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {documents.map((doc) => (
            <div key={doc._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">{doc.type}</p>
                <p className="text-sm text-gray-600">Uploaded: {formatDate(doc.uploadedAt)}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant={doc.verified ? "default" : "secondary"} className="cursor-default">
                  {doc.verified ? 'Verified' : 'Pending'}
                </Badge>
                <a 
                  href={doc.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm cursor-pointer"
                >
                  View
                </a>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
