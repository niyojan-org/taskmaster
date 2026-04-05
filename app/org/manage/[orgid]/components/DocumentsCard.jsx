"use client";

import { Badge } from "@/components/ui/badge";
import { IconFileText, IconExternalLink } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import CardFrame from "./CardFrame";
import { formatDate } from "./cardUtils";

function DocumentRow({ doc }) {
  return (
    <div className="rounded-xl border border-border bg-muted p-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">
            {doc.type || "Document"}
          </p>
          <p className="text-xs text-muted-foreground">
            Uploaded: {formatDate(doc.uploadedAt)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={doc.verified ? "default" : "outline"}>
            {doc.verified ? "Verified" : "Pending"}
          </Badge>
          {doc.rejected ? <Badge variant="outline">Rejected</Badge> : null}
        </div>
      </div>

      <div className="mt-3">
        <Button variant="outline" size="sm" asChild>
          <a href={doc.url} target="_blank" rel="noreferrer">
            <IconExternalLink />
            Open
          </a>
        </Button>
      </div>
    </div>
  );
}

function DocumentsCard({ data, isSaving, onSave }) {
  const documents = data.documents || [];

  return (
    <CardFrame
      title="Documents"
      description="Verification files and current status"
      icon={IconFileText}
      editable={false}
      isEditing={false}
      isSaving={isSaving}
      onEdit={() => {}}
      onCancel={() => {}}
      onSave={onSave}
      className="h-full"
    >
      <ScrollArea className="h-full min-h-0 pr-2">
        <div className="space-y-3">
          {documents.length ? (
            documents.map((doc) => (
              <DocumentRow key={doc._id || doc.url} doc={doc} />
            ))
          ) : (
            <div className="rounded-xl border border-border bg-muted p-4 text-sm text-muted-foreground">
              No documents available.
            </div>
          )}
        </div>
      </ScrollArea>
    </CardFrame>
  );
}

export default DocumentsCard;
