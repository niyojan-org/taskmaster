import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

export default function BankAccountManagement({ bankAccount, loading, makeApiCall }) {
  if (!bankAccount) return null;
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
        <div className="flex-1">
          <p className="text-sm font-medium">{bankAccount.accountHolder}</p>
          <p className="text-xs text-gray-500">{bankAccount.accountNumber}</p>
        </div>
        <Button
          size="sm"
          onClick={() => makeApiCall(`/bank-account/${bankAccount._id}`)}
          disabled={loading}
          className="cursor-pointer bg-green-600 hover:bg-green-700 text-white"
        >
          <CheckCircle className="w-3 h-3 mr-1" />
          Verify
        </Button>
      </div>
    </div>
  );
}
