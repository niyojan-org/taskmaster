'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Card, CardContent } from '@/components/ui/card';
import {
  IconDots,
  IconEdit,
  IconTrash,
  IconExternalLink,
  IconCircleCheck,
  IconCircleX,
  IconCopy,
  IconEye,
  IconWorld
} from '@tabler/icons-react';
import { toast } from 'sonner';

export default function DomainTable({ domains, onEdit, onDelete, onView }) {
  const [copiedId, setCopiedId] = useState(null);

  const getEnvironmentColor = (env) => {
    switch (env) {
      case 'production':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'staging':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'development':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const copyToClipboard = async (text, label) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(text);
      toast.success(`${label} copied to clipboard`);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const getPurposeBadges = (purposes) => {
    if (!purposes) return null;

    const activePurposes = Object.entries(purposes)
      .filter(([_, value]) => value === true)
      .map(([key]) => key);

    return activePurposes.map((purpose) => (
      <Badge key={purpose} variant="secondary" className="text-xs">
        {purpose.toUpperCase()}
      </Badge>
    ));
  };

  if (domains.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <IconWorld className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-medium text-muted-foreground">No domains found</p>
          <p className="text-sm text-muted-foreground mt-2">
            Create your first domain to get started
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Domain</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Environment</TableHead>
                <TableHead>Purposes</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {domains.map((domain) => (
                <TableRow key={domain._id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <span className="max-w-xs truncate">{domain.domain}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => copyToClipboard(domain.domain, 'Domain')}
                      >
                        {copiedId === domain.domain ? (
                          <IconCircleCheck className="h-3 w-3 text-green-600" />
                        ) : (
                          <IconCopy className="h-3 w-3" />
                        )}
                      </Button>
                      <a
                        href={domain.domain}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <IconExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </TableCell>
                  <TableCell>
                    {domain.isActive ? (
                      <Badge className="bg-green-100 text-green-800 border-green-300">
                        <IconCircleCheck className="h-3 w-3 mr-1" />
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-gray-100 text-gray-800 border-gray-300">
                        <IconCircleX className="h-3 w-3 mr-1" />
                        Inactive
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={getEnvironmentColor(domain.environment)}
                    >
                      {domain.environment}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {getPurposeBadges(domain.purposes)}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {domain.createdAt
                      ? new Date(domain.createdAt).toLocaleDateString()
                      : '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger className={cn(buttonVariants({ variant: "ghost" }), "h-8 w-8 p-0")}>
                        <span className="sr-only">Open menu</span>
                        <IconDots className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => copyToClipboard(domain._id, 'Domain ID')}
                        >
                          <IconCopy className="mr-2 h-4 w-4" />
                          Copy ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onView?.(domain)}>
                          <IconEye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(domain)}>
                          <IconEdit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onDelete(domain)}
                          className="text-red-600"
                        >
                          <IconTrash className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
