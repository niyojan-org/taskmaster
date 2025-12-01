import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Phone } from 'lucide-react';

export default function SupportContactCard({ supportContact }) {
  if (!supportContact) return null;
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Phone className="h-5 w-5 text-blue-600" />
          Support Contact
        </CardTitle>
        <CardDescription>Organization support contact information</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="font-medium text-gray-900">{supportContact.name}</p>
          <p className="text-gray-600">{supportContact.email}</p>
          <p className="text-gray-600">{supportContact.phone}</p>
        </div>
      </CardContent>
    </Card>
  );
}
